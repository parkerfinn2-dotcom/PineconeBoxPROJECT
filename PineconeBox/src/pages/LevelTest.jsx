import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LevelTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [recommendedLevel, setRecommendedLevel] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // 测试题目 - 按照难度递增
  const testQuestions = [
    // Level 1 题目
    {
      id: 1,
      level: 1,
      question: '选择 "苹果" 的正确英文',
      options: ['apple', 'banana', 'cat', 'dog'],
      correctAnswer: 'apple',
      hint: '这是一种水果'
    },
    {
      id: 2,
      level: 1,
      question: '选择 "狗" 的正确英文',
      options: ['cat', 'dog', 'bird', 'fish'],
      correctAnswer: 'dog',
      hint: '它会汪汪叫'
    },
    // Level 2 题目
    {
      id: 3,
      level: 2,
      question: '选择 "完成" 的正确英文',
      options: ['accomplish', 'begin', 'stop', 'think'],
      correctAnswer: 'accomplish',
      hint: '表示完成一件事情'
    },
    {
      id: 4,
      level: 2,
      question: '选择 "环境" 的正确英文',
      options: ['environment', 'computer', 'book', 'table'],
      correctAnswer: 'environment',
      hint: '我们生活的周围'
    },
    // Level 3 题目
    {
      id: 5,
      level: 3,
      question: '选择 "分析" 的正确英文',
      options: ['analyze', 'speak', 'walk', 'run'],
      correctAnswer: 'analyze',
      hint: '仔细研究和检查'
    },
    {
      id: 6,
      level: 3,
      question: '选择 "有益的" 的正确英文',
      options: ['beneficial', 'harmful', 'difficult', 'easy'],
      correctAnswer: 'beneficial',
      hint: '对人有好处的'
    },
    // Level 4 题目
    {
      id: 7,
      level: 4,
      question: '选择 "模棱两可的" 的正确英文',
      options: ['ambiguous', 'clear', 'simple', 'direct'],
      correctAnswer: 'ambiguous',
      hint: '意思不明确的'
    },
    {
      id: 8,
      level: 4,
      question: '选择 "全面的" 的正确英文',
      options: ['comprehensive', 'partial', 'small', 'limited'],
      correctAnswer: 'comprehensive',
      hint: '包括所有方面的'
    }
  ]

  // 处理答案选择
  const handleAnswerSelect = (answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)

    // 检查答案是否正确
    if (answer === testQuestions[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1)
    }

    // 进入下一题或显示结果
    if (currentQuestion < testQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 1000)
    } else {
      setTimeout(() => {
        calculateLevel()
        setShowResult(true)
      }, 1000)
    }
  }

  // 计算推荐等级
  const calculateLevel = () => {
    // 简单的等级计算逻辑
    if (score >= 7) {
      setRecommendedLevel(4)
    } else if (score >= 5) {
      setRecommendedLevel(3)
    } else if (score >= 3) {
      setRecommendedLevel(2)
    } else {
      setRecommendedLevel(1)
    }
  }

  // 保存等级并进入打卡页面
  const handleSaveLevel = () => {
    setIsLoading(true)
    
    // 保存用户等级到localStorage
    localStorage.setItem('userLevel', recommendedLevel.toString())
    localStorage.setItem('hasCompletedLevelTest', 'true')
    
    setTimeout(() => {
      setIsLoading(false)
      navigate('/checkin')
    }, 1500)
  }

  // 获取等级对应的名称
  const getLevelName = (level) => {
    const levelNames = {
      1: '林间小径探索者',
      2: '幽深密林冒险家',
      3: '迷雾森林智者',
      4: '森之秘境大师'
    }
    return levelNames[level] || `等级 ${level}`
  }

  // 获取等级对应的描述
  const getLevelDescription = (level) => {
    const descriptions = {
      1: '你刚刚开始英语学习之旅，就像在林间小径上探索，充满好奇和期待！',
      2: '你已经掌握了基础英语，正在幽深密林中冒险，不断发现新的知识！',
      3: '你已经达到了中级水平，在迷雾森林中智慧前行，能够理解更复杂的内容！',
      4: '你是英语高手，在森之秘境中自由穿梭，掌握了丰富的词汇和表达！'
    }
    return descriptions[level] || ''
  }

  if (showResult) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(135deg, var(--background-color), var(--light-color))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '30px',
          padding: '40px',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '8rem', marginBottom: '30px' }}>🏆</div>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '20px' }}>测试完成！</h1>
          
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '10px' }}>
              你的得分：{score} / {testQuestions.length}
            </p>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: 'var(--light-color)', 
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <div style={{
                width: `${(score / testQuestions.length) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--primary-color)',
                borderRadius: '10px',
                transition: 'width 1s ease-out'
              }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--light-color)', borderRadius: '20px' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>🎉 你的英语等级</h2>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)', marginBottom: '10px' }}>
              {getLevelName(recommendedLevel)}
            </div>
            <p style={{ color: 'var(--text-color)', lineHeight: '1.6' }}>
              {getLevelDescription(recommendedLevel)}
            </p>
          </div>

          <button
            onClick={handleSaveLevel}
            disabled={isLoading}
            style={{
              padding: '15px 40px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.backgroundColor = 'var(--highlight-color)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)'
                e.target.style.backgroundColor = 'var(--primary-color)'
              }
            }}
          >
            {isLoading ? '正在保存...' : '开始学习之旅'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--background-color), var(--light-color))'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 导航栏 */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'var(--light-color)',
          borderRadius: '30px',
          boxShadow: 'var(--shadow)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', margin: 0 }}>松果盒子</h1>
          </div>
        </nav>

        {/* 测试标题 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '10px' }}>英语水平测试</h2>
          <p style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>让我们通过有趣的游戏来了解你的英语水平吧！</p>
        </div>

        {/* 进度条 */}
        <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '10px',
            fontSize: '1rem',
            color: 'var(--text-color)'
          }}>
            <span>问题 {currentQuestion + 1} / {testQuestions.length}</span>
            <span>得分：{score}</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '15px', 
            backgroundColor: 'var(--light-color)', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / testQuestions.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              borderRadius: '10px',
              transition: 'width 0.5s ease-out'
            }}></div>
          </div>
        </div>

        {/* 问题卡片 */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '30px',
          padding: '40px',
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '20px' }}>
              {testQuestions[currentQuestion].question}
            </h3>
            <p style={{ color: 'var(--text-color)', fontStyle: 'italic', marginBottom: '30px' }}>
              💡 提示：{testQuestions[currentQuestion].hint}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {testQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  border: '2px solid var(--light-color)',
                  backgroundColor: 'var(--light-color)',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)'
                  e.target.style.backgroundColor = 'var(--primary-color)'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--light-color)'
                  e.target.style.backgroundColor = 'var(--light-color)'
                  e.target.style.color = 'var(--text-color)'
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.9rem', color: '#8d6e63' }}>
            难度等级：{testQuestions[currentQuestion].level}
          </div>
        </div>

        {/* 鼓励信息 */}
        <div style={{ textAlign: 'center', color: 'var(--text-color)', fontStyle: 'italic' }}>
          🎯 加油！每答对一题都会让你更接近你的真实水平
        </div>
      </div>
    </div>
  )
}

export default LevelTest