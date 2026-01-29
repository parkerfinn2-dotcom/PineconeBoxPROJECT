import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 模拟单词数据
const words = [
  { id: 1, word: 'apple', meaning: '苹果' },
  { id: 2, word: 'banana', meaning: '香蕉' },
  { id: 3, word: 'cat', meaning: '猫' },
  { id: 4, word: 'dog', meaning: '狗' },
  { id: 5, word: 'elephant', meaning: '大象' },
  { id: 6, word: 'fish', meaning: '鱼' },
  { id: 7, word: 'grape', meaning: '葡萄' },
  { id: 8, word: 'house', meaning: '房子' },
  { id: 9, word: 'ice cream', meaning: '冰淇淋' },
  { id: 10, word: 'juice', meaning: '果汁' }
]

const WordCheckIn = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)

  useEffect(() => {
    setProgress(((currentIndex + 1) / words.length) * 100)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowMeaning(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowMeaning(false)
    }
  }

  const handleShowMeaning = () => {
    setShowMeaning(true)
  }

  return (
    <div className="checkin-container">
      <nav>
        <Link to="/" className="nav-link">🏠 首页</Link>
        <Link to="/checkin" className="nav-link">📝 单词打卡</Link>
      </nav>
      
      <h1>单词打卡</h1>
      
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>
          已完成 {currentIndex + 1} / {words.length} 个单词
        </div>
      </div>

      {!isCompleted ? (
        <div>
          <div className="word-card">
            <div className="word">{words[currentIndex].word}</div>
            {showMeaning ? (
              <div className="meaning">{words[currentIndex].meaning}</div>
            ) : (
              <button 
                className="healing-btn" 
                onClick={handleShowMeaning}
                style={{ marginBottom: '20px' }}
              >
                查看释义
              </button>
            )}
          </div>
          
          <div className="controls">
            <button 
              className="healing-btn" 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              ← 上一个
            </button>
            <button 
              className="healing-btn" 
              onClick={handleNext}
            >
              下一个 →
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#a8e6cf', marginBottom: '20px' }}>太棒了！</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>你已经完成了今天的单词打卡任务！</p>
          <div>
            <Link to="/">
              <button className="healing-btn">返回首页</button>
            </Link>
            <button 
              className="healing-btn" 
              onClick={() => {
                setCurrentIndex(0)
                setIsCompleted(false)
                setProgress(0)
                setShowMeaning(false)
              }}
            >
              重新开始
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WordCheckIn