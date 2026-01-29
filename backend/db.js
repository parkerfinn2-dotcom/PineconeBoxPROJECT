const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pinecone.db');

// 初始化数据库
db.serialize(() => {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      email_verified BOOLEAN DEFAULT FALSE,
      verification_code TEXT,
      verification_expires TIMESTAMP,
      pinecone_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建单词表
  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT UNIQUE NOT NULL,
      meaning TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建打卡记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      checkin_date DATE NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (user_id, checkin_date)
    )
  `);

  // 创建打卡单词表
  db.run(`
    CREATE TABLE IF NOT EXISTS checkin_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checkin_id INTEGER NOT NULL,
      word_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (checkin_id) REFERENCES checkins(id),
      FOREIGN KEY (word_id) REFERENCES words(id)
    )
  `);

  // 创建练习记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      checkin_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      passed BOOLEAN NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (checkin_id) REFERENCES checkins(id)
    )
  `);

  // 创建松果记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS pinecone_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      reason TEXT NOT NULL,
      reference_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 创建松果币银行表
  db.run(`CREATE TABLE IF NOT EXISTS pinecone_bank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    pinecone_coins INTEGER DEFAULT 0,
    total_trees INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('创建松果币银行表失败:', err.message);
    } else {
      console.log('松果币银行表创建成功');
    }
  });

  // 创建成长树记录表
  db.run(`CREATE TABLE IF NOT EXISTS growth_trees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    water_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('创建成长树记录表失败:', err.message);
    } else {
      console.log('成长树记录表创建成功');
    }
  });

  // 插入一些示例单词
  const insertWord = db.prepare(`INSERT OR IGNORE INTO words (word, meaning, difficulty) VALUES (?, ?, ?)`);
  
  // 等级1单词
  insertWord.run('apple', '苹果', 1);
  insertWord.run('banana', '香蕉', 1);
  insertWord.run('cat', '猫', 1);
  insertWord.run('dog', '狗', 1);
  insertWord.run('elephant', '大象', 1);
  insertWord.run('fish', '鱼', 1);
  insertWord.run('goat', '山羊', 1);
  insertWord.run('horse', '马', 1);
  insertWord.run('ice cream', '冰淇淋', 1);
  insertWord.run('juice', '果汁', 1);
  insertWord.run('kite', '风筝', 1);
  insertWord.run('lion', '狮子', 1);
  insertWord.run('monkey', '猴子', 1);
  insertWord.run('nest', '鸟巢', 1);
  insertWord.run('orange', '橙子', 1);
  insertWord.run('pencil', '铅笔', 1);
  insertWord.run('queen', '女王', 1);
  insertWord.run('rabbit', '兔子', 1);
  insertWord.run('sun', '太阳', 1);
  insertWord.run('tree', '树', 1);
  
  // 等级2单词
  insertWord.run('knowledge', '知识', 2);
  insertWord.run('language', '语言', 2);
  insertWord.run('mountain', '山', 2);
  insertWord.run('notebook', '笔记本', 2);
  insertWord.run('ocean', '海洋', 2);
  insertWord.run('piano', '钢琴', 2);
  insertWord.run('question', '问题', 2);
  insertWord.run('rainbow', '彩虹', 2);
  insertWord.run('science', '科学', 2);
  insertWord.run('teacher', '老师', 2);
  insertWord.run('bookstore', '书店', 2);
  insertWord.run('computer', '电脑', 2);
  insertWord.run('dictionary', '字典', 2);
  insertWord.run('encyclopedia', '百科全书', 2);
  insertWord.run('friendship', '友谊', 2);
  insertWord.run('graduation', '毕业', 2);
  insertWord.run('homework', '作业', 2);
  insertWord.run('library', '图书馆', 2);
  insertWord.run('mathematics', '数学', 2);
  insertWord.run('newspaper', '报纸', 2);
  
  // 等级3单词
  insertWord.run('architecture', '建筑', 3);
  insertWord.run('biodiversity', '生物多样性', 3);
  insertWord.run('cryptocurrency', '加密货币', 3);
  insertWord.run('democracy', '民主', 3);
  insertWord.run('environment', '环境', 3);
  insertWord.run('fascinating', '迷人的', 3);
  insertWord.run('globalization', '全球化', 3);
  insertWord.run('hypothesis', '假设', 3);
  insertWord.run('innovation', '创新', 3);
  insertWord.run('justice', '正义', 3);
  insertWord.run('communication', '交流', 3);
  insertWord.run('collaboration', '合作', 3);
  insertWord.run('creativity', '创造力', 3);
  insertWord.run('critical thinking', '批判性思维', 3);
  insertWord.run('cultural diversity', '文化多样性', 3);
  insertWord.run('digital literacy', '数字素养', 3);
  insertWord.run('ecosystem', '生态系统', 3);
  insertWord.run('entrepreneurship', '创业精神', 3);
  insertWord.run('ethical reasoning', '伦理推理', 3);
  insertWord.run('financial literacy', '金融素养', 3);
  
  // 等级4单词
  insertWord.run('ambiguous', '模棱两可的', 4);
  insertWord.run('consequential', '重要的', 4);
  insertWord.run('discombobulated', '混乱的', 4);
  insertWord.run('ephemeral', '短暂的', 4);
  insertWord.run('flabbergasted', '大吃一惊的', 4);
  insertWord.run('gregarious', '社交的', 4);
  insertWord.run('heterogeneous', '异质的', 4);
  insertWord.run('idiosyncratic', '特立独行的', 4);
  insertWord.run('juxtaposition', '并置', 4);
  insertWord.run('kaleidoscope', '万花筒', 4);
  insertWord.run('laconic', '简洁的', 4);
  insertWord.run('mellifluous', '悦耳的', 4);
  insertWord.run('nonchalant', '漠不关心的', 4);
  insertWord.run('obfuscate', '使困惑', 4);
  insertWord.run('peripatetic', '漫游的', 4);
  insertWord.run('quixotic', '堂吉诃德式的', 4);
  insertWord.run('recalcitrant', '反抗的', 4);
  insertWord.run('sagacious', '睿智的', 4);
  insertWord.run('taciturn', '沉默寡言的', 4);
  insertWord.run('ubiquitous', '无处不在的', 4);
  
  insertWord.finalize();

  console.log('数据库初始化完成');
});

module.exports = db;