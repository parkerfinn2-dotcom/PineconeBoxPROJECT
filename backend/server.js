const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// 注册接口
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  // 哈希密码
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: '密码哈希失败' });
    }

    // 插入用户
    db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ message: '用户名已存在' });
          }
          return res.status(500).json({ message: '注册失败' });
        }

        // 生成令牌
        const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ token, user_id: this.lastID, username });
      }
    );
  });
});

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
          const earnedPinecones = passed ? Math.ceil(totalQuestions / 5) : 0;

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

                if (passed) {
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
                } else {
                  res.json({ passed, score: Math.round(score), pinecone_earned: 0 });
                }
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});