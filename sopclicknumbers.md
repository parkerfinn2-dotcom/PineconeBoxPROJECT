# 测试题配置与前后端计数器实现方案

## 1. 系统架构

### 1.1 技术栈
- **前端**: React.js, LocalStorage, Web Speech API
- **后端**: Node.js, Express, SQLite
- **API**: RESTful API

### 1.2 数据流
```
前端 → API请求 → 后端处理 → 数据库更新 → 前端同步
```

## 2. 测试题配置

### 2.1 测试类型
- **选择题 (multiple_choice)**: 从多个选项中选择正确答案
- **填空题 (fill_blank)**: 填写空缺的单词
- **听力题 (listen_and_choose)**: 听单词发音并选择正确选项

### 2.2 前端实现

#### 2.2.1 随机测试类型选择
```javascript
const getRandomQuizType = () => {
  const quizTypes = ['multiple_choice', 'fill_blank', 'listen_and_choose']
  const randomType = quizTypes[Math.floor(Math.random() * quizTypes.length)]
  return randomType
}
```

#### 2.2.2 选择题选项生成
```javascript
const generateQuizOptions = (targetWord, allWords) => {
  const correctOption = targetWord.word
  const options = [correctOption]
  
  // 从其他单词中随机选择3个干扰选项
  const otherWords = allWords.filter(word => word.id !== targetWord.id)
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length)
    const randomWord = otherWords[randomIndex].word
    if (!options.includes(randomWord)) {
      options.push(randomWord)
    }
    otherWords.splice(randomIndex, 1)
  }
  
  // 打乱选项顺序
  return options.sort(() => 0.5 - Math.random())
}
```

#### 2.2.3 填空题生成
```javascript
const generateFillBlankQuestion = (targetWord) => {
  const templates = [
    `I eat an ${targetWord.word} every day.`,
    `The ${targetWord.word} is very ${targetWord.relatedWords[0] || 'nice'}.`,
    `Can you spell ${targetWord.word}?`,
    `I like ${targetWord.word} very much.`
  ]
  
  const template = templates[Math.floor(Math.random() * templates.length)]
  const blankedSentence = template.replace(targetWord.word, '_____')
  
  return {
    sentence: blankedSentence,
    answer: targetWord.word
  }
}
```

#### 2.2.4 听力题实现
```javascript
const playWordPronunciation = (word) => {
  // 使用美音发音
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  // 尝试找到美音语音
  const voices = speechSynthesis.getVoices()
  const usVoice = voices.find(voice => voice.lang === 'en-US')
  if (usVoice) {
    utterance.voice = usVoice
  }
  speechSynthesis.speak(utterance)
}
```

### 2.3 后端实现

#### 2.3.1 测试答案验证
```javascript
checkinWords.forEach(checkinWord => {
  const userAnswer = answers.find(a => a.word_id == checkinWord.word_id)
  if (userAnswer && userAnswer.answer.toLowerCase() === checkinWord.word.toLowerCase()) {
    score += 100 / totalQuestions
  }
})

const passed = score >= 60
const earnedPinecones = passed ? Math.ceil(totalQuestions / 5) : 0
```

## 3. 前后端计数器实现

### 3.1 前端计数器

#### 3.1.1 状态管理
```javascript
const [earnedPinecones, setEarnedPinecones] = useState(0)
const [userAnswers, setUserAnswers] = useState([])
const [pineconeCount, setPineconeCount] = useState(parseInt(localStorage.getItem('totalPinecones') || '0'))
```

#### 3.1.2 LocalStorage同步
```javascript
// 更新LocalStorage中的松果数量
const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
const newPinecones = currentPinecones + response.pinecone_earned
localStorage.setItem('totalPinecones', newPinecones.toString())
```

#### 3.1.3 定时检查机制
```javascript
const checkPineconeUpdate = () => {
  const count = parseInt(localStorage.getItem('totalPinecones') || '0')
  console.log('定时检查松果数量:', count)
  setPineconeCount(count)
}

// 每2秒检查一次
const intervalId = setInterval(checkPineconeUpdate, 2000)
```

### 3.2 后端计数器

#### 3.2.1 数据库结构
```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pinecone_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

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
```

#### 3.2.2 松果数量更新
```javascript
// 更新用户松果数量
db.run(
  'UPDATE users SET pinecone_count = pinecone_count + ? WHERE id = ?',
  [earnedPinecones, userId],
  (err) => {
    if (err) {
      return res.status(500).json({ message: '更新松果数量失败' })
    }
    
    // 记录松果日志
    // ...
  }
)
```

#### 3.2.3 松果日志记录
```javascript
// 构建包含打卡词语的原因
const correctWords = checkinWords.filter(checkinWord => {
  const userAnswer = answers.find(a => a.word_id == checkinWord.word_id)
  return userAnswer && userAnswer.answer.toLowerCase() === checkinWord.word.toLowerCase()
})
const wordList = correctWords.map(w => w.word).join(', ')
const reason = wordList ? `成功捡到松果: ${wordList}` : '成功捡到松果'

// 记录松果日志
db.run(
  'INSERT INTO pinecone_logs (user_id, amount, type, reason, reference_id) VALUES (?, ?, ?, ?, ?)',
  [userId, earnedPinecones, 'earned', reason, exerciseId],
  (err) => {
    // ...
  }
)
```

## 4. 完整工作流程

### 4.1 前端流程

1. **初始化**:
   - 重置答案数组: `setUserAnswers([])`
   - 重置松果计数: `setEarnedPinecones(0)`
   - 初始化LocalStorage: `localStorage.setItem('totalPinecones', '0')`

2. **测试生成**:
   - 随机选择测试类型
   - 生成相应的测试题
   - 显示测试界面

3. **答案提交**:
   - 验证答案正确性
   - 记录答案到数组: `setUserAnswers(prev => [...prev, { word_id: currentQuizWord.id, answer: userAnswer }])`
   - 显示结果和动画

4. **完成打卡**:
   - 一次性提交所有答案到后端
   - 根据后端返回更新LocalStorage
   - 显示完成页面

### 4.2 后端流程

1. **接收请求**:
   - 验证打卡记录
   - 获取打卡单词

2. **评分处理**:
   - 计算得分
   - 确定是否通过
   - 计算松果奖励

3. **数据更新**:
   - 创建练习记录
   - 更新用户松果数量
   - 记录松果日志
   - 更新打卡状态

4. **返回响应**:
   - 返回得分和松果奖励
   - 前端根据响应更新

## 5. 错误处理

### 5.1 前端错误处理
```javascript
try {
  const response = await exerciseApi.submitAnswers(checkinId, userAnswers)
  console.log('后端同步成功:', response)
  
  // 更新LocalStorage中的松果数量
  if (response.pinecone_earned) {
    const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
    const newPinecones = currentPinecones + response.pinecone_earned
    localStorage.setItem('totalPinecones', newPinecones.toString())
  }
} catch (error) {
  console.error('同步松果数据失败:', error)
  // 同步失败时，仍然更新前端松果数量
  const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
  const newPinecones = currentPinecones + earnedPinecones
  localStorage.setItem('totalPinecones', newPinecones.toString())
}
```

### 5.2 后端错误处理
```javascript
db.run(
  'UPDATE users SET pinecone_count = pinecone_count + ? WHERE id = ?',
  [earnedPinecones, userId],
  (err) => {
    if (err) {
      return res.status(500).json({ message: '更新松果数量失败' })
    }
    // 继续处理
  }
)
```

## 6. 性能优化

### 6.1 前端优化
- **批量提交**: 完成所有单词后一次性提交，减少API调用
- **LocalStorage缓存**: 减少重复计算
- **防抖处理**: 防止快速点击导致的重复提交

### 6.2 后端优化
- **事务处理**: 使用数据库事务确保数据一致性
- **索引优化**: 为常用查询添加索引
- **批量操作**: 减少数据库操作次数

## 7. 测试与验证

### 7.1 功能测试
- 测试不同类型的测试题是否正确生成
- 测试答案验证是否准确
- 测试松果数量是否正确计算
- 测试前后端数据是否同步

### 7.2 边界测试
- 测试空答案的处理
- 测试网络错误的处理
- 测试数据库错误的处理
- 测试大量单词的处理

## 8. 部署与维护

### 8.1 部署注意事项
- 确保数据库初始化脚本正确执行
- 确保API服务正常运行
- 确保前端静态资源正确部署

### 8.2 维护建议
- 定期备份数据库
- 监控API调用情况
- 监控错误日志
- 定期更新依赖

## 9. 代码优化建议

### 9.1 前端优化
- 使用useReducer管理复杂状态
- 使用React Query或SWR管理API调用
- 优化LocalStorage使用，减少频繁读写

### 9.2 后端优化
- 使用ORM框架简化数据库操作
- 实现缓存机制减少数据库查询
- 使用TypeScript提高代码可读性和安全性

## 10. 最佳实践

1. **数据一致性**: 始终确保前端和后端数据同步
2. **错误处理**: 全面处理各种异常情况
3. **用户体验**: 提供清晰的反馈和动画效果
4. **代码可读性**: 保持代码结构清晰，添加适当注释
5. **性能优化**: 关注系统性能，避免不必要的操作
6. **安全性**: 确保API调用安全，防止恶意请求

## 11. 常见问题与解决方案

### 11.1 问题: 松果数量不同步
**解决方案**:
- 检查LocalStorage更新逻辑
- 检查后端数据库更新
- 确保API调用成功

### 11.2 问题: 测试题不显示
**解决方案**:
- 检查测试类型生成逻辑
- 检查单词数据加载
- 检查前端状态管理

### 11.3 问题: 后端同步失败
**解决方案**:
- 检查API请求格式
- 检查数据库连接
- 检查错误处理逻辑

## 12. 总结

本方案提供了一套完整的测试题配置和前后端计数器实现方案，包括:

- 多种测试类型的生成和验证
- 前后端数据同步机制
- 松果奖励系统
- 错误处理和边界情况
- 性能优化建议

通过遵循本方案，可以构建一个稳定、可靠、用户友好的单词学习系统，确保测试题正确配置，前后端计数器准确同步。