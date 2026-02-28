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
const BCRYPT_SALT_ROUNDS = 12;

// 速率限制中间件
const rateLimit = (windowMs, maxRequests) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    const timeWindowRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    
    if (timeWindowRequests.length >= maxRequests) {
      return res.status(429).json({ message: '请求过于频繁，请稍后再试' });
    }
    
    timeWindowRequests.push(now);
    requests.set(ip, timeWindowRequests);
    
    next();
  };
};

// 中间件
app.use(cors({
  origin: '*', // 在生产环境中应该设置为具体的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(rateLimit(15 * 60 * 1000, 100)); // 15分钟内最多100个请求

// 安全头部中间件
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ message: '服务器内部错误' });
});

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: '未授权' });

  // 允许测试token通过，方便前端测试
  if (token === 'test_token_123') {
    req.user = { id: 1, username: 'testuser' };
    console.log('测试令牌通过认证:', req.user);
    next();
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('令牌验证失败:', err);
      return res.status(403).json({ message: '无效的令牌' });
    }
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

// 获取单词接口 - 支持按级别和难度获取
app.get('/api/words', authenticateToken, (req, res) => {
  const { level, difficulty, count = 10 } = req.query;

  let query = 'SELECT id, word, meaning, phonetic, level, difficulty FROM words WHERE 1=1';
  const params = [];

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  query += ' ORDER BY id LIMIT ?';
  params.push(count);

  db.all(query, params, (err, words) => {
    if (err) {
      return res.status(500).json({ message: '获取单词失败' });
    }

    res.json(words);
  });
});

// 获取用户学习进度接口
app.get('/api/words/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { level, mastered } = req.query;

  let query = `
    SELECT w.id, w.word, w.meaning, w.phonetic, w.level, w.difficulty,
           uwp.mastered, uwp.review_count, uwp.last_reviewed_at, uwp.next_review_at
    FROM words w
    LEFT JOIN user_word_progress uwp ON w.id = uwp.word_id AND uwp.user_id = ?
    WHERE 1=1
  `;
  const params = [userId];

  if (level) {
    query += ' AND w.level = ?';
    params.push(level);
  }

  if (mastered !== undefined) {
    query += ' AND uwp.mastered = ?';
    params.push(mastered === 'true');
  }

  query += ' ORDER BY w.id LIMIT 50';

  db.all(query, params, (err, words) => {
    if (err) {
      return res.status(500).json({ message: '获取学习进度失败' });
    }

    res.json(words);
  });
});

// 更新单词学习进度接口
app.post('/api/words/:id/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { mastered, review_count = 1 } = req.body;

  // 检查单词是否存在
  db.get('SELECT * FROM words WHERE id = ?', [id], (err, word) => {
    if (err) {
      return res.status(500).json({ message: '获取单词失败' });
    }

    if (!word) {
      return res.status(404).json({ message: '单词不存在' });
    }

    // 计算下一次复习时间（简单的间隔算法）
    const now = new Date();
    const nextReviewAt = new Date(now.getTime() + (review_count * 24 * 60 * 60 * 1000));

    // 插入或更新学习进度
    db.run(
      `INSERT OR REPLACE INTO user_word_progress 
      (user_id, word_id, mastered, review_count, last_reviewed_at, next_review_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`,
      [userId, id, mastered, review_count, nextReviewAt.toISOString()],
      (err) => {
        if (err) {
          return res.status(500).json({ message: '更新学习进度失败' });
        }

        res.json({ message: '学习进度更新成功' });
      }
    );
  });
});

// 获取学习统计信息接口
app.get('/api/learning/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 获取用户学习统计
  db.get(
    `SELECT * FROM user_learning_stats WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ message: '获取学习统计失败' });
      }

      if (!stats) {
        // 如果没有统计记录，创建一个新的
        db.run(
          `INSERT INTO user_learning_stats (user_id) VALUES (?)`,
          [userId],
          (err) => {
            if (err) {
              return res.status(500).json({ message: '创建学习统计失败' });
            }

            res.json({ 
              total_words: 0, 
              mastered_words: 0, 
              study_time: 0, 
              streak_days: 0 
            });
          }
        );
      } else {
        res.json(stats);
      }
    }
  );
});

// 获取词汇级别列表接口
app.get('/api/word/levels', (req, res) => {
  db.all(
    'SELECT DISTINCT level FROM words ORDER BY level',
    [],
    (err, levels) => {
      if (err) {
        return res.status(500).json({ message: '获取级别列表失败' });
      }

      res.json(levels.map(item => item.level));
    }
  );
});

// 同步学习进度接口
app.post('/api/progress/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { progress } = req.body;

  if (!Array.isArray(progress)) {
    return res.status(400).json({ message: '进度数据格式错误' });
  }

  // 开始事务
  db.serialize(() => {
    let successCount = 0;
    let errorCount = 0;

    progress.forEach(item => {
      const { word_id, mastered, review_count = 1 } = item;

      if (!word_id) {
        errorCount++;
        return;
      }

      // 计算下一次复习时间
      const now = new Date();
      const nextReviewAt = new Date(now.getTime() + (review_count * 24 * 60 * 60 * 1000));

      try {
        // 插入或更新学习进度
        db.run(
          `INSERT OR REPLACE INTO user_word_progress 
          (user_id, word_id, mastered, review_count, last_reviewed_at, next_review_at, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`,
          [userId, word_id, mastered, review_count, nextReviewAt.toISOString()],
          (err) => {
            if (err) {
              errorCount++;
            } else {
              successCount++;
            }
          }
        );
      } catch (err) {
        errorCount++;
      }
    });

    // 提交事务后返回结果
    setTimeout(() => {
      res.json({
        message: '学习进度同步完成',
        success_count: successCount,
        error_count: errorCount
      });
    }, 100);
  });
});

// 获取个性化推荐单词接口
app.get('/api/words/recommended', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { count = 10 } = req.query;

  // 推荐策略：
  // 1. 优先推荐需要复习的单词（next_review_at <= now）
  // 2. 其次推荐未掌握的单词
  // 3. 最后推荐新单词
  const now = new Date().toISOString();

  const query = `
    SELECT w.id, w.word, w.meaning, w.phonetic, w.level, w.difficulty,
           uwp.mastered, uwp.review_count, uwp.last_reviewed_at, uwp.next_review_at
    FROM words w
    LEFT JOIN user_word_progress uwp ON w.id = uwp.word_id AND uwp.user_id = ?
    ORDER BY
      CASE
        WHEN uwp.next_review_at IS NOT NULL AND uwp.next_review_at <= ? THEN 0
        WHEN uwp.mastered IS NOT NULL AND uwp.mastered = 0 THEN 1
        WHEN uwp.mastered IS NULL THEN 2
        ELSE 3
      END,
      RANDOM()
    LIMIT ?
  `;

  db.all(query, [userId, now, count], (err, words) => {
    if (err) {
      return res.status(500).json({ message: '获取推荐单词失败' });
    }

    res.json(words);
  });
});

// 获取学习统计摘要接口
app.get('/api/learning/summary', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 获取用户学习统计
  db.get(
    `SELECT * FROM user_learning_stats WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ message: '获取学习统计失败' });
      }

      // 获取各能级别的学习进度
      db.all(
        `
          SELECT w.level, 
                 COUNT(*) as total_words,
                 SUM(CASE WHEN uwp.mastered = 1 THEN 1 ELSE 0 END) as mastered_words
          FROM words w
          LEFT JOIN user_word_progress uwp ON w.id = uwp.word_id AND uwp.user_id = ?
          GROUP BY w.level
        `,
        [userId],
        (err, levelStats) => {
          if (err) {
            return res.status(500).json({ message: '获取级别统计失败' });
          }

          // 计算总体进度
          const overall = {
            total_words: levelStats.reduce((sum, item) => sum + item.total_words, 0),
            mastered_words: levelStats.reduce((sum, item) => sum + (item.mastered_words || 0), 0)
          };

          res.json({
            overall,
            level_stats: levelStats,
            user_stats: stats || {
              total_words: 0,
              mastered_words: 0,
              study_time: 0,
              streak_days: 0
            }
          });
        }
      );
    }
  );
});

// 级别映射：将数字级别映射到字符串级别
const levelMap = {
  '1': 'PRIMARY',
  '2': 'MIDDLE',
  '3': 'HIGH',
  '4': 'CET4'
};

// 创建打卡记录接口 - 支持按词汇级别打卡
app.post('/api/checkins', authenticateToken, (req, res) => {
  const userId = req.user.id;
  let { level, difficulty, word_count = 10 } = req.body;
  const today = new Date().toISOString().split('T')[0];
  
  // 转换数字级别为字符串级别
  if (level && typeof level === 'number') {
    level = levelMap[level.toString()] || level;
  } else if (level && typeof level === 'string' && !isNaN(level)) {
    level = levelMap[level] || level;
  }
  
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

      // 构建获取单词的查询
      let wordQuery = 'SELECT id, word, meaning, phonetic, level, difficulty FROM words WHERE 1=1';
      const wordParams = [];

      if (level) {
        wordQuery += ' AND level = ?';
        wordParams.push(level);
      }

      if (difficulty) {
        wordQuery += ' AND difficulty = ?';
        wordParams.push(difficulty);
      }

      wordQuery += ' ORDER BY id LIMIT ?';
      wordParams.push(word_count);

      // 获取单词
      db.all(wordQuery, wordParams, (err, words) => {
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
      });
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

// 获取用户打卡和松果状态接口 - 解决前后端计数不匹配问题
app.get('/api/user/status', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  // 开始事务
  db.serialize(() => {
    // 获取用户信息
    db.get(
      'SELECT pinecone_count FROM users WHERE id = ?',
      [userId],
      (err, user) => {
        if (err) {
          return res.status(500).json({ message: '获取用户信息失败' });
        }

        // 获取今日打卡状态
        db.get(
          'SELECT id, status FROM checkins WHERE user_id = ? AND checkin_date = ?',
          [userId, today],
          (err, checkin) => {
            if (err) {
              return res.status(500).json({ message: '获取打卡状态失败' });
            }

            // 获取今日获得的松果数量
            db.get(
              'SELECT SUM(amount) as today_earned FROM pinecone_logs WHERE user_id = ? AND type = "earned" AND DATE(created_at) = ?',
              [userId, today],
              (err, todayEarned) => {
                if (err) {
                  return res.status(500).json({ message: '获取今日松果失败' });
                }

                // 获取累计获得的松果数量
                db.get(
                  'SELECT SUM(amount) as total_earned FROM pinecone_logs WHERE user_id = ? AND type = "earned"',
                  [userId],
                  (err, totalEarned) => {
                    if (err) {
                      return res.status(500).json({ message: '获取累计松果失败' });
                    }

                    res.json({
                      pinecone_count: user.pinecone_count,
                      today_checked_in: !!checkin,
                      checkin_status: checkin ? checkin.status : 'none',
                      today_earned: todayEarned ? todayEarned.today_earned || 0 : 0,
                      total_earned: totalEarned ? totalEarned.total_earned || 0 : 0,
                      last_updated: new Date().toISOString()
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
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
    'SELECT id, word, meaning, phonetic, level, difficulty FROM words WHERE id = ?',
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
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
    if (err) {
      console.error('密码哈希失败:', err);
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
          console.error('注册失败:', err);
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ message: '用户名或邮箱已存在' });
          }
          return res.status(500).json({ message: '注册失败' });
        }

        const userId = this.lastID;

        // 创建用户学习统计记录
        db.run(
          'INSERT INTO user_learning_stats (user_id) VALUES (?)',
          [userId],
          (err) => {
            if (err) {
              console.error('创建学习统计记录失败:', err);
            }
          }
        );

        // 创建松果币银行记录
        db.run(
          'INSERT INTO pinecone_bank (user_id) VALUES (?)',
          [userId],
          (err) => {
            if (err) {
              console.error('创建松果币银行记录失败:', err);
            }
          }
        );

        // 发送验证邮件
        if (email) {
          sendVerificationEmail(email, verificationCode);
        }

        // 生成令牌
        const token = jwt.sign({ id: userId, username }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ 
          token, 
          user_id: userId, 
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