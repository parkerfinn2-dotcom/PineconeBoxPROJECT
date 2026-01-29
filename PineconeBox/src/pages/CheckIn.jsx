import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WordCard from '../components/WordCard'
import { checkinApi, exerciseApi, pineconeApi } from '../services/api'
import { getWordsByLevel } from '../data/wordLibraryIntegrated'

const CheckIn = () => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [words, setWords] = useState([])
  const [checkinId, setCheckinId] = useState(null)
  const [nextBtnShaking, setNextBtnShaking] = useState(false)
  const [wordCount, setWordCount] = useState(localStorage.getItem('wordCount') || '5')
  const [checkinStatus, setCheckinStatus] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuizWord, setCurrentQuizWord] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizResult, setQuizResult] = useState(null)
  const [quizOptions, setQuizOptions] = useState([])
  const [earnedPinecones, setEarnedPinecones] = useState(0)
  const [quizType, setQuizType] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [userAnswers, setUserAnswers] = useState([])
  const navigate = useNavigate()
  const indexRef = useRef(currentIndex)
  const userAnswersRef = useRef(userAnswers)
  
  // 同步currentIndex到ref
  useEffect(() => {
    indexRef.current = currentIndex
  }, [currentIndex])
  
  // 同步userAnswers到ref
  useEffect(() => {
    userAnswersRef.current = userAnswers
  }, [userAnswers])
  
  // 登出功能
  const handleLogout = () => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    // 跳转到登录页
    navigate('/login')
  }

  // 初始化单词列表
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    
    // 只在totalPinecones不存在时初始化
    if (localStorage.getItem('totalPinecones') === null) {
      localStorage.setItem('totalPinecones', '0')
      console.log('松果数量已初始化')
    }
    
    const fetchWords = async () => {
      setIsLoading(true)
      try {
        console.log('开始获取单词:', { currentLevel, wordCount })
        // 检查登录状态
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        const token = localStorage.getItem('token')
        console.log('登录状态:', { isLoggedIn, token: token ? '存在' : '不存在' })
        
        if (!isLoggedIn || !token) {
          console.log('未登录，使用本地词库')
          // 降级到本地数据，使用词库文件
          const localWords = getWordsByLevel(currentLevel, parseInt(wordCount))
          console.log('Using local words:', localWords.length)
          console.log('本地单词ID:', localWords.map(w => w.id))
          if (isMounted) {
            setWords(localWords)
            // 初始化打卡状态数组，全部为false（未打卡）
            setCheckinStatus(new Array(localWords.length).fill(false))
            setCurrentIndex(0)
            setIsCompleted(false)
            // 重置答案数组
            setUserAnswers([])
            setEarnedPinecones(0)
            setIsLoading(false)
          }
          return
        }
        
        // 使用API获取单词列表
        console.log('发送创建打卡请求到后端...')
        const response = await checkinApi.createCheckin(currentLevel, parseInt(wordCount))
        console.log('创建打卡成功:', response)
        
        if (isMounted) {
          console.log('Words received:', response.words ? response.words.length : 0)
          if (response.words && response.words.length > 0) {
            // 保持单词的随机顺序
            setWords(response.words)
            setCheckinId(response.checkin_id)
            // 初始化打卡状态数组，全部为false（未打卡）
            setCheckinStatus(new Array(response.words.length).fill(false))
          } else {
            console.log('后端未返回单词，使用本地词库')
            // 降级到本地数据，使用词库文件
            const localWords = getWordsByLevel(currentLevel, parseInt(wordCount))
            console.log('Using local words:', localWords.length)
            console.log('本地单词ID:', localWords.map(w => w.id))
            setWords(localWords)
            // 初始化打卡状态数组，全部为false（未打卡）
            setCheckinStatus(new Array(localWords.length).fill(false))
          }
          setCurrentIndex(0)
          setIsCompleted(false)
          // 重置答案数组
          setUserAnswers([])
          setEarnedPinecones(0)
        }
      } catch (error) {
        console.error('获取单词失败，使用本地词库:', error)
        console.error('错误详情:', error.message, error.stack)
        if (isMounted) {
          // 降级到本地数据，使用词库文件
          const localWords = getWordsByLevel(currentLevel, parseInt(wordCount))
          // 保持本地单词的随机顺序
          console.log('Using local words:', localWords.length)
          console.log('本地单词ID:', localWords.map(w => w.id))
          setWords(localWords)
          // 初始化打卡状态数组，全部为false（未打卡）
          setCheckinStatus(new Array(localWords.length).fill(false))
          setCurrentIndex(0)
          setIsCompleted(false)
          // 重置答案数组
          setUserAnswers([])
          setEarnedPinecones(0)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchWords()
    
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [currentLevel, wordCount])

  // 更新进度
  useEffect(() => {
    if (words.length > 0) {
      setProgress(((currentIndex + 1) / words.length) * 100)
    }
  }, [currentIndex, words])

  // 创建掉落松树元素
  const createFallingPine = (e) => {
    if (!document.querySelector('.checkin-container')) return
    
    // 创建松树元素
    const pineEl = document.createElement('div')
    pineEl.textContent = '🌲'
    pineEl.style.position = 'fixed'
    pineEl.style.left = `${e.clientX}px`
    pineEl.style.top = `${e.clientY}px`
    pineEl.style.fontSize = `${Math.random() * 1 + 0.5}rem`
    pineEl.style.pointerEvents = 'none'
    pineEl.style.zIndex = '1000'
    pineEl.style.opacity = '0'
    pineEl.style.transition = 'all 2s ease-out'
    
    // 添加到页面
    document.body.appendChild(pineEl)
    
    // 触发动画
    requestAnimationFrame(() => {
      pineEl.style.opacity = '0.6'
      pineEl.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`
    })
    
    // 移除元素
    setTimeout(() => {
      pineEl.remove()
    }, 2000)
  }

  // 发送打卡信息到微信
  const sendCheckInToWechat = () => {
    const isWechatBound = localStorage.getItem('wechatBound') === 'true'
    const userWechat = localStorage.getItem('userWechat')
    
    if (isWechatBound && userWechat) {
      // 模拟发送打卡信息到微信
      const today = new Date().toDateString()
      const streakDays = parseInt(localStorage.getItem('streakDays') || '0')
      const totalWords = parseInt(localStorage.getItem('totalWords') || '0')
      
      const message = `【松果盒子】每日学习报告\n日期：${today}\n连续打卡：${streakDays}天\n学习单词：${totalWords}个\n继续加油！💪`
      
      console.log('发送到微信的消息：', message)
      console.log('发送到微信ID：', userWechat)
      
      // 记录发送时间
      localStorage.setItem('lastWechatMessageSent', new Date().toISOString())
      
      return true
    }
    return false
  }

  // 随机选择测试类型
  const getRandomQuizType = () => {
    const quizTypes = ['multiple_choice', 'fill_blank', 'listen_and_choose']
    const randomType = quizTypes[Math.floor(Math.random() * quizTypes.length)]
    console.log('随机测试类型:', randomType)
    return randomType
  }

  // 生成测试选项
  const generateQuizOptions = (targetWord, allWords) => {
    // 确保选项中包含正确答案
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

  // 生成填空题
  const generateFillBlankQuestion = (targetWord) => {
    // 简单的句子模板
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

  // 处理测试答案提交
  const handleQuizSubmit = async () => {
    if (!currentQuizWord) return
    
    setIsProcessing(true)
    
    // 根据测试类型验证答案
    let isCorrect = false
    if (quizType === 'multiple_choice' || quizType === 'listen_and_choose') {
      isCorrect = userAnswer === correctAnswer
    } else if (quizType === 'fill_blank') {
      // 填空题不区分大小写
      isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase()
    }
    
    setQuizResult(isCorrect)
    
    // 保存答案到数组
    setUserAnswers(prev => [...prev, {
      word_id: currentQuizWord.id,
      answer: userAnswer
    }])
    
    // 每打卡一个单词，获得一个松果（不管回答是否正确）
    const newEarnedPinecones = earnedPinecones + 1
    setEarnedPinecones(newEarnedPinecones)
    
    // 显示松果奖励动画
    createPineconeReward()
    
    // 2秒后继续
    setTimeout(() => {
      setQuizResult(null)
      setShowQuiz(false)
      setUserAnswer('')
      
      // 获取当前最新索引
      const currentRefIndex = indexRef.current
      
      if (currentRefIndex < words.length - 1) {
        // 跳转到下一个单词
        const nextIndex = currentRefIndex + 1
        setCurrentIndex(nextIndex)
        setIsProcessing(false)
      } else {
        // 完成所有单词
        console.log('已完成所有单词和测试')
        setIsCompleted(true)
        
        // 定义异步函数处理后端同步
        const processSync = async () => {
          console.log('开始处理打卡同步...')
          
          // 计算并更新连续打卡天数
          const today = new Date().toDateString()
          const lastCheckedIn = localStorage.getItem('lastCheckedIn')
          const lastCheckedInDate = lastCheckedIn ? new Date(lastCheckedIn) : null
          const todayDate = new Date(today)
          
          // 计算连续签到天数
          let newStreakDays = parseInt(localStorage.getItem('streakDays') || '0')
          if (!lastCheckedIn || (todayDate - lastCheckedInDate) > 86400000) { // 超过24小时
            newStreakDays = 1
          } else {
            newStreakDays += 1
          }
          
          // 保存签到状态
          localStorage.setItem('lastCheckedIn', today)
          localStorage.setItem('streakDays', newStreakDays.toString())
          console.log('更新连续打卡天数:', { old: parseInt(localStorage.getItem('streakDays') || '0'), new: newStreakDays })
          
          // 检查登录状态
          const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
          const token = localStorage.getItem('token')
          console.log('登录状态:', { isLoggedIn, token: token ? '存在' : '不存在' })
          
          // 一次性提交所有答案到后端
          try {
            console.log('提交答案到后端:', {
              checkinId: checkinId,
              userAnswers: userAnswersRef.current,
              answerCount: userAnswersRef.current.length,
              isLoggedIn: isLoggedIn
            })
            
            // 无论是否登录，先更新本地松果数量
            if (earnedPinecones > 0) {
              const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
              const newPinecones = currentPinecones + earnedPinecones
              localStorage.setItem('totalPinecones', newPinecones.toString())
              console.log('本地更新松果数量:', { current: currentPinecones, earned: earnedPinecones, new: newPinecones })
            }
            
            // 尝试同步到后端
            if (isLoggedIn && token && checkinId && userAnswersRef.current.length > 0) {
              try {
                const response = await exerciseApi.submitAnswers(checkinId, userAnswersRef.current)
                console.log('后端同步成功:', response)
                
                // 如果后端返回了不同的松果数量，使用后端的数据
                if (response.pinecone_earned) {
                  const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
                  const backendPinecones = currentPinecones - earnedPinecones + response.pinecone_earned
                  localStorage.setItem('totalPinecones', backendPinecones.toString())
                  console.log('后端数据优先更新松果数量:', { current: currentPinecones, backend: response.pinecone_earned, new: backendPinecones })
                }
              } catch (apiError) {
                console.error('后端API调用失败:', apiError)
                // API调用失败时，保持本地数据不变
                console.log('使用本地松果数量数据')
              }
            } else {
              console.log('跳过后端提交:', {
                isLoggedIn: isLoggedIn,
                hasToken: !!token,
                hasCheckinId: !!checkinId,
                hasAnswers: userAnswersRef.current.length > 0
              })
            }
          } catch (error) {
            console.error('同步松果数据失败:', error)
            // 同步失败时，确保本地松果数量已更新
            if (earnedPinecones > 0) {
              const currentPinecones = parseInt(localStorage.getItem('totalPinecones') || '0')
              const newPinecones = currentPinecones + earnedPinecones
              localStorage.setItem('totalPinecones', newPinecones.toString())
              console.log('同步失败，使用本地数据更新松果数量:', { current: currentPinecones, earned: earnedPinecones, new: newPinecones })
            }
          }
          
          // 尝试从后端同步最新的松果数量
          try {
            if (isLoggedIn && token) {
              const pineconeResponse = await pineconeApi.getTotal()
              console.log('最新松果数量:', pineconeResponse)
              if (pineconeResponse.pinecone_count) {
                localStorage.setItem('totalPinecones', pineconeResponse.pinecone_count.toString())
              }
            }
          } catch (error) {
            console.error('获取最新松果数量失败:', error)
          }
          
          // 完成打卡后发送微信消息
          sendCheckInToWechat()
          
          console.log('打卡同步处理完成')
          setIsProcessing(false)
        }
        
        // 执行异步处理
        processSync()
      }
    }, 2000)
  }

  // 松果奖励动画
  const createPineconeReward = () => {
    // 创建主松果
    const pinecone = document.createElement('div')
    pinecone.textContent = '🌰'
    pinecone.style.position = 'fixed'
    pinecone.style.left = '50%'
    pinecone.style.top = '50%'
    pinecone.style.transform = 'translate(-50%, -50%)'
    pinecone.style.fontSize = '4rem'
    pinecone.style.pointerEvents = 'none'
    pinecone.style.zIndex = '1000'
    pinecone.style.opacity = '0'
    pinecone.style.transition = 'all 1s ease-out'
    
    document.body.appendChild(pinecone)
    
    requestAnimationFrame(() => {
      pinecone.style.opacity = '1'
      pinecone.style.transform = 'translate(-50%, -50%) scale(1.5)'
    })
    
    // 创建多个小的松果碎片
    for (let i = 0; i < 5; i++) {
      const fragment = document.createElement('div')
      fragment.textContent = '🌰'
      fragment.style.position = 'fixed'
      fragment.style.left = '50%'
      fragment.style.top = '50%'
      fragment.style.transform = 'translate(-50%, -50%)'
      fragment.style.fontSize = `${Math.random() * 1.5 + 0.5}rem`
      fragment.style.pointerEvents = 'none'
      fragment.style.zIndex = '999'
      fragment.style.opacity = '0'
      fragment.style.transition = `all ${Math.random() * 0.5 + 0.8}s ease-out`
      
      document.body.appendChild(fragment)
      
      // 计算碎片的位置
      const angle = (i / 5) * Math.PI * 2
      const distance = Math.random() * 100 + 50
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      
      requestAnimationFrame(() => {
        fragment.style.opacity = '0.8'
        fragment.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
      })
      
      setTimeout(() => {
        fragment.style.opacity = '0'
        fragment.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`
        setTimeout(() => fragment.remove(), 500)
      }, 800)
    }
    
    setTimeout(() => {
      pinecone.style.opacity = '0'
      pinecone.style.transform = 'translate(-50%, -50%) scale(0.5)'
      setTimeout(() => pinecone.remove(), 1000)
    }, 1000)
  }

  const handleNext = async (e) => {
    console.log('=== 开始处理下一个单词 ===');
    // 防止重复处理
    if (isProcessing) {
      console.log('正在处理中，请勿重复点击')
      return
    }
    
    // 触发按钮抖动效果
    setNextBtnShaking(true)
    setTimeout(() => setNextBtnShaking(false), 300)
    
    // 创建掉落松树
    createFallingPine(e)
    
    // 确保words数组不为空
    if (words.length === 0) {
      console.log('No words loaded yet')
      return
    }
    
    // 获取当前最新索引
    const currentRefIndex = indexRef.current
    console.log('当前索引:', currentRefIndex, '单词总数:', words.length)
    
    // 标记当前单词为已打卡
    const newCheckinStatus = [...checkinStatus]
    newCheckinStatus[currentRefIndex] = true
    setCheckinStatus(newCheckinStatus)
    
    // 获取当前单词
    const currentWord = words[currentRefIndex]
    if (!currentWord) {
      console.error('当前单词不存在:', currentRefIndex)
      return
    }
    console.log('当前学习单词:', currentWord.word, '意思:', currentWord.meaning)
    setCurrentQuizWord(currentWord)
    
    // 随机选择测试类型
    const type = getRandomQuizType()
    setQuizType(type)
    console.log('测试类型:', type)
    
    if (type === 'multiple_choice') {
      // 生成选择题选项
      const options = generateQuizOptions(currentWord, words)
      console.log('选择题选项:', options)
      setQuizOptions(options)
      setCorrectAnswer(currentWord.word)
      console.log('正确答案:', currentWord.word)
    } else if (type === 'fill_blank') {
      // 生成填空题
      const blankQuestion = generateFillBlankQuestion(currentWord)
      console.log('填空题答案:', blankQuestion.answer)
      setCorrectAnswer(blankQuestion.answer)
      // 清空选项，因为填空题不需要选项
      setQuizOptions([])
    } else if (type === 'listen_and_choose') {
      // 生成听力选择题（模拟）
      const options = generateQuizOptions(currentWord, words)
      console.log('听力题选项:', options)
      setQuizOptions(options)
      setCorrectAnswer(currentWord.word)
      console.log('正确答案:', currentWord.word)
    }
    
    // 重置用户答案和测试结果
    setUserAnswer('')
    setQuizResult(null)
    
    // 显示测试
    console.log('显示测试:', type)
    console.log('设置showQuiz为true');
    setShowQuiz(true)
    console.log('=== 处理完成 ===');
  }

  const handlePrev = () => {
    // 防止重复处理
    if (isProcessing) {
      console.log('正在处理中，请勿重复点击')
      return
    }
    
    // 获取当前最新索引
    const currentRefIndex = indexRef.current
    if (currentRefIndex > 0) {
      setIsProcessing(true)
      const prevIndex = currentRefIndex - 1
      console.log('跳转到上一个索引:', prevIndex)
      setCurrentIndex(prevIndex)
      
      // 短暂禁用，防止快速点击
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  const handleLevelChange = (level) => {
    setCurrentLevel(level)
  }

  const handleRestart = () => {
    // 重置打卡状态数组，全部为false（未打卡）
    setCheckinStatus(new Array(words.length).fill(false))
    setCurrentIndex(0)
    setIsCompleted(false)
    setProgress(0)
  }

  // 获取寻宝旅程名称
  const getJourneyName = (level) => {
    const journeys = {
      1: '林间小径',
      2: '幽深密林',
      3: '迷雾森林',
      4: '森之秘境'
    }
    return journeys[level] || `旅程 ${level}`
  }

  // 处理单词个数选择
  const handleWordCountSelect = (count, e) => {
    const countStr = count.toString()
    setWordCount(countStr)
    localStorage.setItem('wordCount', countStr)
    
    // 创建松果落入盒子的动态效果
    createPineconeDrop(e)
  }

  // 松果落入盒子的动态效果
  const createPineconeDrop = (e) => {
    // 创建松果元素
    const pinecone = document.createElement('div')
    pinecone.textContent = '🌰'
    pinecone.style.position = 'fixed'
    pinecone.style.left = `${e.clientX}px`
    pinecone.style.top = `${e.clientY}px`
    pinecone.style.fontSize = '2rem'
    pinecone.style.pointerEvents = 'none'
    pinecone.style.zIndex = '1000'
    pinecone.style.opacity = '1'
    pinecone.style.transition = 'all 3s ease-out'
    
    // 添加到页面
    document.body.appendChild(pinecone)
    
    // 计算目标位置（页面中心下方）
    const targetX = window.innerWidth / 2
    const targetY = window.innerHeight - 100
    
    // 触发动画
    requestAnimationFrame(() => {
      pinecone.style.left = `${targetX}px`
      pinecone.style.top = `${targetY}px`
      pinecone.style.opacity = '0'
      pinecone.style.transform = 'scale(0.5)'
    })
    
    // 移除元素
    setTimeout(() => {
      pinecone.remove()
    }, 3000)
  }

  return (
    <>
      {/* 抖动动画样式 */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
      <div className="checkin-container" style={{
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(135deg, var(--background-color), var(--light-color))'
      }}>
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
          <Link to="/home" style={{ textDecoration: 'none', color: 'var(--text-color)' }}>🏠</Link>
          <h1 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', margin: 0 }}>松果盒子</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/profile" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🥧 松果盒子</Link>
          <Link to="/square" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🏪 松果市集</Link>
          {/* 根据登录状态显示登出或登录按钮 */}
          {localStorage.getItem('isLoggedIn') === 'true' ? (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = 'var(--highlight-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              }}
            >
              🚪 登出
            </button>
          ) : (
            <Link to="/login">
              <button
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--text-color)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                🔑 登录
              </button>
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 寻宝旅程选择 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="secondary-title">寻宝旅程</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {
              [
                { level: 1, name: '林间小径' },
                { level: 2, name: '幽深密林' },
                { level: 3, name: '迷雾森林' },
                { level: 4, name: '森之秘境' }
              ].map(item => (
                <button
                  key={item.level}
                  onClick={() => handleLevelChange(item.level)}
                  className={`level-btn ${currentLevel === item.level ? 'selected' : ''}`}
                >
                  {item.name}
                </button>
              ))
            }
          </div>
        </div>

        {/* 单词个数选择 */}
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', backgroundColor: 'var(--light-color)', borderRadius: '15px', maxWidth: '600px', margin: '0 auto 30px' }}>
          <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>🌰 今天你想捡几个松果？</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[5, 8, 12, 15].map(count => (
              <button
                key={count}
                onClick={(e) => handleWordCountSelect(count, e)}
                style={{
                  backgroundColor: wordCount === count.toString() ? 'var(--primary-color)' : 'var(--light-color)',
                  color: wordCount === count.toString() ? 'white' : 'var(--text-color)',
                  border: '2px solid var(--primary-color)',
                  padding: '15px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🌰 {count}个
              </button>
            ))}
          </div>
          <div style={{ marginTop: '15px', color: 'var(--text-color)', fontSize: '1rem' }}>
            当前选择：{wordCount}个松果
          </div>
        </div>

        {/* 打卡标题 */}
        <h2 className="core-title">松果打卡</h2>

        {/* 进度条 */}
        <div style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
          <div className="progress-bar"></div>
          <div className="progress" style={{ width: `${progress}%` }}></div>
          <div className="progress-text">
            {words.length > 0 ? `已完成 ${currentIndex + 1} / ${words.length} 个单词` : '准备中...'}
          </div>
        </div>

        {!isCompleted ? (
          <div>
            {showQuiz ? (
              /* 测试界面 */
              <div style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '20px', 
                padding: '40px', 
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>松果测试</h3>
                
                {currentQuizWord ? (
                  <>
                    {quizType === 'multiple_choice' && (
                      <>
                        <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-color)' }}>
                          请选择单词 "{currentQuizWord.meaning}" 对应的英文：
                        </p>
                        <div style={{ marginBottom: '30px' }}>
                          {quizOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                console.log('选择选项:', option)
                                setUserAnswer(option)
                              }}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '10px',
                                border: userAnswer === option ? '2px solid var(--primary-color)' : '2px solid var(--light-color)',
                                backgroundColor: userAnswer === option ? 'var(--primary-color)' : 'var(--light-color)',
                                color: userAnswer === option ? 'white' : 'var(--text-color)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                zIndex: 10
                              }}
                              onMouseEnter={(e) => {
                                if (userAnswer !== option) {
                                  e.currentTarget.style.backgroundColor = 'var(--highlight-color)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (userAnswer !== option) {
                                  e.currentTarget.style.backgroundColor = 'var(--light-color)'
                                }
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {quizType === 'fill_blank' && (
                      <>
                        <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-color)' }}>
                          请填写空缺的单词：
                        </p>
                        <p style={{ 
                          fontSize: '1.1rem', 
                          marginBottom: '30px', 
                          padding: '20px',
                          backgroundColor: 'var(--light-color)',
                          borderRadius: '10px',
                          color: 'var(--text-color)'
                        }}>
                          {(() => {
                            // 生成填空题句子
                            const templates = [
                              `I eat an ${currentQuizWord.word} every day.`,
                              `The ${currentQuizWord.word} is very ${currentQuizWord.relatedWords[0] || 'nice'}.`,
                              `Can you spell ${currentQuizWord.word}?`,
                              `I like ${currentQuizWord.word} very much.`
                            ]
                            const template = templates[Math.floor(Math.random() * templates.length)]
                            return template.replace(currentQuizWord.word, '_____')
                          })()}
                        </p>
                        <div style={{ marginBottom: '30px' }}>
                          <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => {
                              console.log('填写答案:', e.target.value)
                              setUserAnswer(e.target.value)
                            }}
                            placeholder="请输入英文单词"
                            style={{
                              width: '100%',
                              padding: '15px',
                              borderRadius: '10px',
                              border: '2px solid var(--primary-color)',
                              fontSize: '1rem',
                              backgroundColor: 'white',
                              color: 'var(--text-color)',
                              zIndex: 10,
                              position: 'relative'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--highlight-color)'
                              e.target.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)'
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'var(--primary-color)'
                              e.target.style.boxShadow = 'none'
                            }}
                            autoFocus
                          />
                        </div>
                      </>
                    )}
                    
                    {quizType === 'listen_and_choose' && (
                      <>
                        <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-color)' }}>
                          请听单词发音并选择正确的选项：
                        </p>
                        <button
                          onClick={() => {
                            // 使用美音发音
                            const utterance = new SpeechSynthesisUtterance(currentQuizWord.word)
                            // 设置为美国英语
                            utterance.lang = 'en-US'
                            // 尝试找到美音语音
                            const voices = speechSynthesis.getVoices()
                            const usVoice = voices.find(voice => voice.lang === 'en-US')
                            if (usVoice) {
                              utterance.voice = usVoice
                            }
                            speechSynthesis.speak(utterance)
                          }}
                          style={{
                            marginBottom: '30px',
                            padding: '15px 30px',
                            borderRadius: '10px',
                            border: '2px solid var(--primary-color)',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          🔊 播放发音
                        </button>
                        <div style={{ marginBottom: '30px' }}>
                          {quizOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                console.log('选择选项:', option)
                                setUserAnswer(option)
                              }}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '10px',
                                border: userAnswer === option ? '2px solid var(--primary-color)' : '2px solid var(--light-color)',
                                backgroundColor: userAnswer === option ? 'var(--primary-color)' : 'var(--light-color)',
                                color: userAnswer === option ? 'white' : 'var(--text-color)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                zIndex: 10
                              }}
                              onMouseEnter={(e) => {
                                if (userAnswer !== option) {
                                  e.currentTarget.style.backgroundColor = 'var(--highlight-color)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (userAnswer !== option) {
                                  e.currentTarget.style.backgroundColor = 'var(--light-color)'
                                }
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {quizResult !== null && (
                      <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        borderRadius: '10px',
                        backgroundColor: quizResult ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: quizResult ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold'
                      }}>
                        {quizResult ? '🎉 回答正确！获得一个松果！' : '❌ 回答错误，再试一次！'}
                      </div>
                    )}
                    <button
                      onClick={handleQuizSubmit}
                      disabled={!userAnswer || quizResult !== null}
                      className="healing-btn"
                      style={{
                        opacity: !userAnswer || quizResult !== null ? 0.5 : 1,
                        cursor: !userAnswer || quizResult !== null ? 'not-allowed' : 'pointer'
                      }}
                    >
                      提交答案
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-color)' }}>加载测试中...</p>
                  </div>
                )}
              </div>
            ) : (
              /* 单词卡片 */
              <div>
                {words.length > 0 && currentIndex >= 0 && currentIndex < words.length && (
                  <div style={{ position: 'relative' }}>
                    {/* 词卡编号 */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      boxShadow: 'var(--shadow)',
                      zIndex: '10'
                    }}>
                      {currentIndex + 1}
                    </div>
                    <WordCard 
                      wordData={{
                        ...words[currentIndex],
                        phonetic: words[currentIndex].phonetic || '',
                        relatedWords: words[currentIndex].relatedWords || [],
                        sentence: words[currentIndex].sentence || '',
                        level: words[currentIndex].level || currentLevel
                      }} 
                    />
                  </div>
                )}

                {/* 控制按钮 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="healing-btn"
                    style={{
                      opacity: currentIndex === 0 ? 0.5 : 1,
                      cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← 上一个
                  </button>
                  <button 
                    onClick={(e) => handleNext(e)} 
                    className={`healing-btn ${nextBtnShaking ? 'shaking' : ''}`}
                    style={{
                      animation: nextBtnShaking ? 'shake 0.3s ease-in-out' : 'none'
                    }}
                  >
                    下一个 →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--card-bg)', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', maxWidth: '550px', margin: '0 auto', animation: 'slideUp 0.7s ease-out', position: 'relative', overflow: 'hidden', border: '3px solid var(--primary-color)', background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--light-color) 100%)' }}>
            {/* 装饰元素 */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '180px',
              height: '180px',
              backgroundColor: 'rgba(255, 152, 0, 0.15)',
              borderRadius: '50%',
              zIndex: 0,
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '180px',
              height: '180px',
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              borderRadius: '50%',
              zIndex: 0,
              animation: 'pulse 3s ease-in-out infinite 1s'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '7rem', marginBottom: '25px', animation: 'bounce 2s infinite' }}>🎉</div>
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '25px', fontSize: '2.3rem', textShadow: '0 3px 6px rgba(0, 0, 0, 0.15)' }}>太棒了！</h2>
              <p style={{ fontSize: '1.3rem', marginBottom: '35px', color: 'var(--text-color)', lineHeight: '1.8', padding: '0 20px' }}>
                你已经完成了 {getJourneyName(currentLevel)} 的所有单词打卡任务！
              </p>
              
              {/* 奖励信息 */}
              <div style={{ marginBottom: '35px', padding: '25px', backgroundColor: 'var(--light-color)', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px', fontSize: '1.5rem' }}>🏆 今日奖励</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', gap: '15px' }}>
                  <div style={{ textAlign: 'center', flex: 1, padding: '15px', backgroundColor: 'rgba(255, 152, 0, 0.1)', borderRadius: '15px', transition: 'all 0.3s ease', animation: 'fadeIn 1s ease-out' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px', animation: 'bounce 2.5s infinite' }}>🌰</div>
                    <div style={{ color: 'var(--text-color)', marginBottom: '5px', fontSize: '1.1rem' }}>获得松果</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{earnedPinecones}个</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, padding: '15px', backgroundColor: 'rgba(255, 193, 7, 0.1)', borderRadius: '15px', transition: 'all 0.3s ease', animation: 'fadeIn 1.2s ease-out' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px', animation: 'bounce 2.5s infinite 0.3s' }}>🔥</div>
                    <div style={{ color: 'var(--text-color)', marginBottom: '5px', fontSize: '1.1rem' }}>连续打卡</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{parseInt(localStorage.getItem('streakDays') || '0')}天</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, padding: '15px', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '15px', transition: 'all 0.3s ease', animation: 'fadeIn 1.4s ease-out' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px', animation: 'bounce 2.5s infinite 0.6s' }}>📚</div>
                    <div style={{ color: 'var(--text-color)', marginBottom: '5px', fontSize: '1.1rem' }}>累计单词</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{parseInt(localStorage.getItem('totalWords') || '0')}个</div>
                  </div>
                </div>
                {/* 松果总数 */}
                <div style={{ marginTop: '25px', padding: '20px', backgroundColor: 'rgba(76, 175, 80, 0.15)', borderRadius: '15px', border: '2px solid rgba(76, 175, 80, 0.3)', animation: 'fadeIn 1.6s ease-out' }}>
                  <div style={{ fontSize: '1.1rem', color: 'var(--text-color)', marginBottom: '8px', fontWeight: 'bold' }}>🏠 主页松果总数</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {parseInt(localStorage.getItem('totalPinecones') || '0')}个
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button onClick={handleRestart} className="healing-btn" style={{ padding: '15px 30px', fontSize: '1.1rem', animation: 'fadeIn 1.8s ease-out' }}>
                  重新开始
                </button>
                {currentLevel < 4 && (
                  <button onClick={() => handleLevelChange(currentLevel + 1)} className="healing-btn" style={{ padding: '15px 30px', fontSize: '1.1rem', animation: 'fadeIn 2s ease-out' }}>
                    挑战 {getJourneyName(currentLevel + 1)}
                  </button>
                )}
                <Link to="/profile">
                  <button className="healing-btn" style={{ padding: '15px 30px', fontSize: '1.1rem', animation: 'fadeIn 2.2s ease-out' }}>查看成就</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default CheckIn