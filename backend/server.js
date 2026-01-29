const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'pinecone_secret_key';

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: '未授权' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: '无效的令牌' });
    req.user = user;
    next();
  });
};

// 注册接口已移至下方，与邮箱支持的版本合并

// 登录接口
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  // 查询用户
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: '登录失败' });
    }

    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 生成令牌
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });

      res.json({ token, user_id: user.id, username: user.username, pinecone_count: user.pinecone_count });
    });
  });
});

// 获取今日单词接口
app.get('/api/words', authenticateToken, (req, res) => {
  const { level = 1, count = 10 } = req.query;

  // 获取指定等级的单词
  db.all(
    'SELECT id, word, meaning FROM words WHERE difficulty = ? ORDER BY id LIMIT ?',
    [level, count],
    (err, words) => {
      if (err) {
        return res.status(500).json({ message: '获取单词失败' });
      }

      res.json(words);
    }
  );
});

// 创建打卡记录接口
app.post('/api/checkins', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { level = 1, word_count = 10 } = req.body;
  const today = new Date().toISOString().split('T')[0];

  // 检查今天是否已打卡
  db.get(
    'SELECT * FROM checkins WHERE user_id = ? AND checkin_date = ?',
    [userId, today],
    (err, existingCheckin) => {
      if (err) {
        return res.status(500).json({ message: '打卡失败' });
      }

      if (existingCheckin) {
        return res.status(400).json({ message: '今天已经打卡过了' });
      }

      // 获取指定等级的单词
      db.all(
        'SELECT id, word, meaning FROM words WHERE difficulty = ? ORDER BY id LIMIT ?',
        [level, word_count],
        (err, words) => {
          if (err) {
            return res.status(500).json({ message: '获取单词失败' });
          }

          if (words.length === 0) {
            return res.status(404).json({ message: '没有找到合适的单词' });
          }

          // 开始事务
          db.serialize(() => {
            // 创建打卡记录
            db.run(
              'INSERT INTO checkins (user_id, checkin_date, status) VALUES (?, ?, ?)',
              [userId, today, 'pending'],
              function (err) {
                if (err) {
                  return res.status(500).json({ message: '创建打卡记录失败' });
                }

                const checkinId = this.lastID;

                // 关联单词到打卡记录
                const insertCheckinWord = db.prepare('INSERT INTO checkin_words (checkin_id, word_id) VALUES (?, ?)');
                
                words.forEach(word => {
                  insertCheckinWord.run(checkinId, word.id);
                });

                insertCheckinWord.finalize((err) => {
                  if (err) {
                    return res.status(500).json({ message: '关联单词失败' });
                  }

                  res.json({ checkin_id: checkinId, words });
                });
              }
            );
          });
        }
      );
    }
  );
});

// 获取今日打卡状态接口
app.get('/api/checkins/today', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  db.get(
    'SELECT id, status FROM checkins WHERE user_id = ? AND checkin_date = ?',
    [userId, today],
    (err, checkin) => {
      if (err) {
        return res.status(500).json({ message: '获取打卡状态失败' });
      }

      if (!checkin) {
        return res.json({ checked_in: false });
      }

      res.json({ checked_in: true, checkin_id: checkin.id, status: checkin.status });
    }
  );
});

// 提交练习答案接口
app.post('/api/exercises/submit', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { checkin_id, answers } = req.body;

  // 验证打卡记录存在且属于当前用户
  db.get(
    'SELECT * FROM checkins WHERE id = ? AND user_id = ?',
    [checkin_id, userId],
    (err, checkin) => {
      if (err) {
        return res.status(500).json({ message: '获取打卡记录失败' });
      }

      if (!checkin) {
        return res.status(404).json({ message: '打卡记录不存在' });
      }

      if (checkin.status === 'completed') {
        return res.status(400).json({ message: '该打卡已经完成' });
      }

      // 获取打卡的单词
      db.all(
        'SELECT cw.word_id, w.word FROM checkin_words cw JOIN words w ON cw.word_id = w.id WHERE cw.checkin_id = ?',
        [checkin_id],
        (err, checkinWords) => {
          if (err) {
            return res.status(500).json({ message: '获取打卡单词失败' });
          }

          // 评分逻辑
          let score = 0;
          const totalQuestions = checkinWords.length;

          checkinWords.forEach(checkinWord => {
            const userAnswer = answers.find(a => a.word_id == checkinWord.word_id);
            if (userAnswer && userAnswer.answer.toLowerCase() === checkinWord.word.toLowerCase()) {
              score += 100 / totalQuestions;
            }
          });

          const passed = score >= 60;
          // 用户打卡几个单词就获得几个松果
          const earnedPinecones = totalQuestions;

          // 开始事务
          db.serialize(() => {
            // 创建练习记录
            db.run(
              'INSERT INTO exercises (checkin_id, score, passed) VALUES (?, ?, ?)',
              [checkin_id, Math.round(score), passed],
              function (err) {
                if (err) {
                  return res.status(500).json({ message: '创建练习记录失败' });
                }

                const exerciseId = this.lastID;

                // 无论是否通过测试，都更新用户松果数量
                // 更新用户松果数量
                db.run(
                  'UPDATE users SET pinecone_count = pinecone_count + ? WHERE id = ?',
                  [earnedPinecones, userId],
                  (err) => {
                    if (err) {
                      return res.status(500).json({ message: '更新松果数量失败' });
                    }

                    // 构建包含打卡词语的原因
                    const correctWords = checkinWords.filter(checkinWord => {
                      const userAnswer = answers.find(a => a.word_id == checkinWord.word_id);
                      return userAnswer && userAnswer.answer.toLowerCase() === checkinWord.word.toLowerCase();
                    });
                    const wordList = correctWords.map(w => w.word).join(', ');
                    const reason = wordList ? `成功捡到松果: ${wordList}` : '成功捡到松果';
                    
                    // 记录松果日志
                    db.run(
                      'INSERT INTO pinecone_logs (user_id, amount, type, reason, reference_id) VALUES (?, ?, ?, ?, ?)',
                      [userId, earnedPinecones, 'earned', reason, exerciseId],
                      (err) => {
                        if (err) {
                          return res.status(500).json({ message: '记录松果日志失败' });
                        }

                        // 更新打卡状态
                        db.run(
                          'UPDATE checkins SET status = ? WHERE id = ?',
                          ['completed', checkin_id],
                          (err) => {
                            if (err) {
                              return res.status(500).json({ message: '更新打卡状态失败' });
                            }

                            res.json({ passed, score: Math.round(score), pinecone_earned: earnedPinecones });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          });
        }
      );
    }
  );
});

// 获取用户松果总数接口
app.get('/api/users/pinecones', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get(
    'SELECT pinecone_count FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: '获取松果数量失败' });
      }

      res.json({ pinecone_count: user.pinecone_count });
    }
  );
});

// 获取松果变动记录接口
app.get('/api/users/pinecones/logs', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT id, amount, type, reason, created_at FROM pinecone_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [userId],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ message: '获取松果记录失败' });
      }

      res.json(logs);
    }
  );
});

// 获取松果币银行信息接口
app.get('/api/bank/info', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get(
    'SELECT * FROM pinecone_bank WHERE user_id = ?',
    [userId],
    (err, bank) => {
      if (err) {
        return res.status(500).json({ message: '获取松果币银行信息失败' });
      }

      if (!bank) {
        // 如果用户没有银行记录，创建新的
        db.run(
          'INSERT INTO pinecone_bank (user_id, pinecone_coins, total_trees) VALUES (?, 0, 0)',
          [userId],
          (err) => {
            if (err) {
              return res.status(500).json({ message: '创建松果币银行失败' });
            }
            res.json({ pinecone_coins: 0, total_trees: 0 });
          }
        );
      } else {
        res.json(bank);
      }
    }
  );
});

// 浇水达到20次后生成树并换取松果币接口
app.post('/api/bank/harvest-tree', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { water_count } = req.body;

  if (water_count < 20) {
    return res.status(400).json({ message: '浇水次数不足20次，无法兑换松果币' });
  }

  // 计算可以兑换的树的数量
  const treeCount = Math.floor(water_count / 20);
  const pineconeCoins = treeCount * 10;

  // 使用事务处理
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // 更新松果币银行
    db.run(
      'UPDATE pinecone_bank SET pinecone_coins = pinecone_coins + ?, total_trees = total_trees + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [pineconeCoins, treeCount, userId],
      (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ message: '更新松果币银行失败' });
        }

        // 记录松果币日志
        db.run(
          'INSERT INTO pinecone_logs (user_id, amount, type, reason, reference_id) VALUES (?, ?, ?, ?, ?)',
          [userId, pineconeCoins, 'earned', `兑换成长树获得 ${pineconeCoins} 松果币`, null],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ message: '记录松果币日志失败' });
            }

            // 插入成长树记录
            db.run(
              'INSERT INTO growth_trees (user_id, water_count) VALUES (?, ?)',
              [userId, water_count],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ message: '记录成长树失败' });
                }

                db.run('COMMIT');
                res.json({
                  success: true,
                  treeCount: treeCount,
                  pineconeCoins: pineconeCoins,
                  message: `成功兑换 ${treeCount} 棵树，获得 ${pineconeCoins} 松果币！`
                });
              }
            );
          }
        );
      }
    );
  });
});

// 获取成长树记录接口
app.get('/api/bank/trees', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM growth_trees WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, trees) => {
      if (err) {
        return res.status(500).json({ message: '获取成长树记录失败' });
      }

      res.json(trees);
    }
  );
});

// 获取单词详情接口
app.get('/api/words/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT id, word, meaning FROM words WHERE id = ?',
    [id],
    (err, word) => {
      if (err) {
        return res.status(500).json({ message: '获取单词详情失败' });
      }

      if (!word) {
        return res.status(404).json({ message: '单词不存在' });
      }

      res.json(word);
    }
  );
});

// 邮箱配置
const EMAIL_CONFIG = {
  service: 'qq', // 可以替换为其他邮箱服务
  auth: {
    user: 'your_email@qq.com', // 替换为实际的邮箱
    pass: 'your_email_password' // 替换为实际的邮箱密码或授权码
  }
};

// 发送验证邮件
const sendVerificationEmail = async (email, code) => {
  try {
    // 创建邮件发送器
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    
    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: '松果盒子 - 邮箱验证',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">欢迎使用松果盒子！</h2>
          <p>请使用以下验证码完成邮箱验证：</p>
          <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
            ${code}
          </div>
          <p>验证码有效期为30分钟，请及时验证。</p>
          <p>如果您没有注册松果盒子账号，请忽略此邮件。</p>
        </div>
      `
    });
    console.log('邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
};

// 生成验证码
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// 注册接口 - 添加邮箱支持
app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  // 哈希密码
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: '密码哈希失败' });
    }

    // 生成验证码
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30分钟过期

    // 插入用户
    db.run(
      'INSERT INTO users (username, password_hash, email, verification_code, verification_expires) VALUES (?, ?, ?, ?, ?)',
      [username, hash, email, verificationCode, verificationExpires],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ message: '用户名或邮箱已存在' });
          }
          return res.status(500).json({ message: '注册失败' });
        }

        // 发送验证邮件
        if (email) {
          sendVerificationEmail(email, verificationCode);
        }

        // 生成令牌
        const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ 
          token, 
          user_id: this.lastID, 
          username,
          email,
          email_verified: false,
          message: email ? '注册成功，验证码已发送到您的邮箱' : '注册成功'
        });
      }
    );
  });
});

// 邮箱验证接口
app.post('/api/auth/verify-email', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: '邮箱和验证码不能为空' });
  }

  // 检查验证码
  db.get(
    'SELECT * FROM users WHERE email = ? AND verification_code = ? AND verification_expires > ?',
    [email, code, new Date().toISOString()],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: '验证失败' });
      }

      if (!user) {
        return res.status(400).json({ message: '验证码无效或已过期' });
      }

      // 更新用户状态
      db.run(
        'UPDATE users SET email_verified = true, verification_code = NULL, verification_expires = NULL WHERE id = ?',
        [user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: '验证失败' });
          }

          res.json({ message: '邮箱验证成功' });
        }
      );
    }
  );
});

// 邮箱登录接口
app.post('/api/auth/login/email', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '邮箱和密码不能为空' });
  }

  // 查询用户
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: '登录失败' });
    }

    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: '邮箱或密码错误' });
      }

      // 生成令牌
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });

      res.json({ 
        token, 
        user_id: user.id, 
        username: user.username, 
        email: user.email,
        email_verified: user.email_verified,
        pinecone_count: user.pinecone_count 
      });
    });
  });
});

// 重新发送验证码接口
app.post('/api/auth/resend-verification', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '邮箱不能为空' });
  }

  // 检查用户
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: '操作失败' });
    }

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: '邮箱已验证' });
    }

    // 生成新验证码
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30分钟过期

    // 更新验证码
    db.run(
      'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
      [verificationCode, verificationExpires, user.id],
      (err) => {
        if (err) {
          return res.status(500).json({ message: '操作失败' });
        }

        // 发送验证邮件
        sendVerificationEmail(email, verificationCode);

        res.json({ message: '验证码已重新发送' });
      }
    );
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});