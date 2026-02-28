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
      phonetic TEXT,
      level TEXT NOT NULL,
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

  // 创建用户学习进度表
  db.run(`
    CREATE TABLE IF NOT EXISTS user_word_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      word_id INTEGER NOT NULL,
      mastered BOOLEAN DEFAULT FALSE,
      review_count INTEGER DEFAULT 0,
      last_reviewed_at TIMESTAMP,
      next_review_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (word_id) REFERENCES words(id),
      UNIQUE (user_id, word_id)
    )
  `);

  // 创建用户学习统计表格
  db.run(`
    CREATE TABLE IF NOT EXISTS user_learning_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      total_words INTEGER DEFAULT 0,
      mastered_words INTEGER DEFAULT 0,
      study_time INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_study_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 插入一些示例单词
  const insertWord = db.prepare(`INSERT OR IGNORE INTO words (word, meaning, phonetic, level, difficulty) VALUES (?, ?, ?, ?, ?)`);
  
  // 等级1单词 (小学级别)
  insertWord.run('apple', '苹果', '[ˈæpl]', 'PRIMARY', 1);
  insertWord.run('banana', '香蕉', '[bəˈnɑːnə]', 'PRIMARY', 1);
  insertWord.run('cat', '猫', '[kæt]', 'PRIMARY', 1);
  insertWord.run('dog', '狗', '[dɒɡ]', 'PRIMARY', 1);
  insertWord.run('elephant', '大象', '[ˈelɪfənt]', 'PRIMARY', 1);
  insertWord.run('fish', '鱼', '[fɪʃ]', 'PRIMARY', 1);
  insertWord.run('goat', '山羊', '[ɡəʊt]', 'PRIMARY', 1);
  insertWord.run('horse', '马', '[hɔːs]', 'PRIMARY', 1);
  insertWord.run('ice cream', '冰淇淋', '[aɪs kriːm]', 'PRIMARY', 1);
  insertWord.run('juice', '果汁', '[dʒuːs]', 'PRIMARY', 1);
  insertWord.run('kite', '风筝', '[kaɪt]', 'PRIMARY', 1);
  insertWord.run('lion', '狮子', '[ˈlaɪən]', 'PRIMARY', 1);
  insertWord.run('monkey', '猴子', '[ˈmʌŋki]', 'PRIMARY', 1);
  insertWord.run('nest', '鸟巢', '[nest]', 'PRIMARY', 1);
  insertWord.run('orange', '橙子', '[ˈɒrɪndʒ]', 'PRIMARY', 1);
  insertWord.run('pencil', '铅笔', '[ˈpensl]', 'PRIMARY', 1);
  insertWord.run('queen', '女王', '[kwiːn]', 'PRIMARY', 1);
  insertWord.run('rabbit', '兔子', '[ˈræbɪt]', 'PRIMARY', 1);
  insertWord.run('sun', '太阳', '[sʌn]', 'PRIMARY', 1);
  insertWord.run('tree', '树', '[triː]', 'PRIMARY', 1);
  
  // 等级2单词 (初中级别)
  insertWord.run('knowledge', '知识', '[ˈnɒlɪdʒ]', 'MIDDLE', 2);
  insertWord.run('language', '语言', '[ˈlæŋɡwɪdʒ]', 'MIDDLE', 2);
  insertWord.run('mountain', '山', '[ˈmaʊntən]', 'MIDDLE', 2);
  insertWord.run('notebook', '笔记本', '[ˈnəʊtbʊk]', 'MIDDLE', 2);
  insertWord.run('ocean', '海洋', '[ˈəʊʃn]', 'MIDDLE', 2);
  insertWord.run('piano', '钢琴', '[piˈænəʊ]', 'MIDDLE', 2);
  insertWord.run('question', '问题', '[ˈkwestʃən]', 'MIDDLE', 2);
  insertWord.run('rainbow', '彩虹', '[ˈreɪnbəʊ]', 'MIDDLE', 2);
  insertWord.run('science', '科学', '[ˈsaɪəns]', 'MIDDLE', 2);
  insertWord.run('teacher', '老师', '[ˈtiːtʃə]', 'MIDDLE', 2);
  insertWord.run('bookstore', '书店', '[ˈbʊkstɔː]', 'MIDDLE', 2);
  insertWord.run('computer', '电脑', '[kəmˈpjuːtə]', 'MIDDLE', 2);
  insertWord.run('dictionary', '字典', '[ˈdɪkʃənri]', 'MIDDLE', 2);
  insertWord.run('encyclopedia', '百科全书', '[ɪnˌsaɪkləˈpiːdiə]', 'MIDDLE', 2);
  insertWord.run('friendship', '友谊', '[ˈfrendʃɪp]', 'MIDDLE', 2);
  insertWord.run('graduation', '毕业', '[ˌɡrædʒuˈeɪʃn]', 'MIDDLE', 2);
  insertWord.run('homework', '作业', '[ˈhəʊmwɜːk]', 'MIDDLE', 2);
  insertWord.run('library', '图书馆', '[ˈlaɪbrəri]', 'MIDDLE', 2);
  insertWord.run('mathematics', '数学', '[ˌmæθəˈmætɪks]', 'MIDDLE', 2);
  insertWord.run('newspaper', '报纸', '[ˈnjuːzpeɪpə]', 'MIDDLE', 2);
  
  // 等级3单词 (高中级别)
  insertWord.run('architecture', '建筑', '[ˈɑːkɪtektʃə]', 'HIGH', 3);
  insertWord.run('biodiversity', '生物多样性', '[ˌbaɪəʊdaɪˈvɜːsəti]', 'HIGH', 3);
  insertWord.run('cryptocurrency', '加密货币', '[ˈkrɪptəʊkʌrənsi]', 'HIGH', 3);
  insertWord.run('democracy', '民主', '[dɪˈmɒkrəsi]', 'HIGH', 3);
  insertWord.run('environment', '环境', '[ɪnˈvaɪrənmənt]', 'HIGH', 3);
  insertWord.run('fascinating', '迷人的', '[ˈfæsɪneɪtɪŋ]', 'HIGH', 3);
  insertWord.run('globalization', '全球化', '[ˌɡləʊbəlaɪˈzeɪʃn]', 'HIGH', 3);
  insertWord.run('hypothesis', '假设', '[haɪˈpɒθəsɪs]', 'HIGH', 3);
  insertWord.run('innovation', '创新', '[ˌɪnəˈveɪʃn]', 'HIGH', 3);
  insertWord.run('justice', '正义', '[ˈdʒʌstɪs]', 'HIGH', 3);
  insertWord.run('communication', '交流', '[kəˌmjuːnɪˈkeɪʃn]', 'HIGH', 3);
  insertWord.run('collaboration', '合作', '[kəˌlæbəˈreɪʃn]', 'HIGH', 3);
  insertWord.run('creativity', '创造力', '[ˌkriːeɪˈtɪvəti]', 'HIGH', 3);
  insertWord.run('critical thinking', '批判性思维', '[ˈkrɪtɪkl ˈθɪŋkɪŋ]', 'HIGH', 3);
  insertWord.run('cultural diversity', '文化多样性', '[ˈkʌltʃərəl daɪˈvɜːsəti]', 'HIGH', 3);
  insertWord.run('digital literacy', '数字素养', '[ˈdɪdʒɪtl ˈlɪtərəsi]', 'HIGH', 3);
  insertWord.run('ecosystem', '生态系统', '[ˈiːkəʊsɪstəm]', 'HIGH', 3);
  insertWord.run('entrepreneurship', '创业精神', '[ˌɒntrəprəˈnɜːʃɪp]', 'HIGH', 3);
  insertWord.run('ethical reasoning', '伦理推理', '[ˈeθɪkl ˈriːzənɪŋ]', 'HIGH', 3);
  insertWord.run('financial literacy', '金融素养', '[faɪˈnænʃl ˈlɪtərəsi]', 'HIGH', 3);
  
  // 等级4单词 (CET4级别)
  insertWord.run('ambiguous', '模棱两可的', '[æmˈbɪɡjuəs]', 'CET4', 4);
  insertWord.run('consequential', '重要的', '[ˌkɒnsɪˈkwenʃl]', 'CET4', 4);
  insertWord.run('discombobulated', '混乱的', '[ˌdɪskəmˈbɒbjuleɪtɪd]', 'CET4', 4);
  insertWord.run('ephemeral', '短暂的', '[ɪˈfemərəl]', 'CET4', 4);
  insertWord.run('flabbergasted', '大吃一惊的', '[ˈflæbəɡɑːstɪd]', 'CET4', 4);
  insertWord.run('gregarious', '社交的', '[ɡrɪˈɡeəriəs]', 'CET4', 4);
  insertWord.run('heterogeneous', '异质的', '[ˌhetərəˈdʒiːniəs]', 'CET4', 4);
  insertWord.run('idiosyncratic', '特立独行的', '[ˌɪdiəsɪŋˈkrætɪk]', 'CET4', 4);
  insertWord.run('juxtaposition', '并置', '[ˌdʒʌkstəpəˈzɪʃn]', 'CET4', 4);
  insertWord.run('kaleidoscope', '万花筒', '[kəˈlaɪdəskəʊp]', 'CET4', 4);
  insertWord.run('laconic', '简洁的', '[ləˈkɒnɪk]', 'CET4', 4);
  insertWord.run('mellifluous', '悦耳的', '[məˈlɪfluəs]', 'CET4', 4);
  insertWord.run('nonchalant', '漠不关心的', '[ˈnɒnʃələnt]', 'CET4', 4);
  insertWord.run('obfuscate', '使困惑', '[ˈɒbfʌskeɪt]', 'CET4', 4);
  insertWord.run('peripatetic', '漫游的', '[ˌperɪpəˈtetɪk]', 'CET4', 4);
  insertWord.run('quixotic', '堂吉诃德式的', '[kwɪkˈsɒtɪk]', 'CET4', 4);
  insertWord.run('recalcitrant', '反抗的', '[rɪˈkælsɪtrənt]', 'CET4', 4);
  insertWord.run('sagacious', '睿智的', '[səˈɡeɪʃəs]', 'CET4', 4);
  insertWord.run('taciturn', '沉默寡言的', '[ˈtæsɪtɜːn]', 'CET4', 4);
  insertWord.run('ubiquitous', '无处不在的', '[juːˈbɪkwɪtəs]', 'CET4', 4);
  
  insertWord.finalize();

  console.log('数据库初始化完成');
});

module.exports = db;