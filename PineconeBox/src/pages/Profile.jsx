import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pineconeApi, bankApi } from '../services/api'

const Profile = () => {
  const [userData, setUserData] = useState({
    username: localStorage.getItem('username') || '游客',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    totalWords: 0,
    completedLevels: [1],
    streakDays: parseInt(localStorage.getItem('streakDays') || '0'), // 从localStorage读取
    achievements: [
      { id: 1, name: '初学者', description: '完成难度1的单词打卡', icon: '🥧' },
      { id: 2, name: '连续7天', description: '连续打卡7天', icon: '🔥' },
      { id: 3, name: '单词达人', description: '学习10个以上单词', icon: '📚' }
    ]
  })
  
  // 添加松果数量状态
  const [pineconeCount, setPineconeCount] = useState(parseInt(localStorage.getItem('totalPinecones') || '0'))
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [treeGrowth, setTreeGrowth] = useState('seed') // seed, sprout, sapling, tree, fruiting
  const [hasWateredToday, setHasWateredToday] = useState(localStorage.getItem('lastWateredDate') === new Date().toDateString())
  const [waterCount, setWaterCount] = useState(parseInt(localStorage.getItem('waterCount') || '0'))
  
  // 松果银行状态
  const [bankInfo, setBankInfo] = useState({ pinecone_coins: 0, total_trees: 0 })
  const [showBankModal, setShowBankModal] = useState(false)
  const [harvesting, setHarvesting] = useState(false)
  const [userLevel, setUserLevel] = useState({
    level: 10, // 临时设置为10级，以便解锁所有头像挂件
    experience: 1000, // 设置足够的经验值
    title: '钻石守林人'
  })
  const [unlockedItems, setUnlockedItems] = useState({
    wallpapers: JSON.parse(localStorage.getItem('unlockedWallpapers') || '[]'),
    avatars: JSON.parse(localStorage.getItem('unlockedAvatars') || '[]')
  })
  
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0)
  const [currentWallpaper, setCurrentWallpaper] = useState(null)
  const [currentAvatarBadge, setCurrentAvatarBadge] = useState(localStorage.getItem('currentAvatarBadge') || null)
  
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const audioRef = useRef(null)
  
  // 森林动物像素风格图标列表
  const pixelAnimals = ['🐿️', '🦉', '🦔', '🐇', '🐦', '🐸', '🐹', '🐰', '🦊', '🐻', '🐨', '🐼', '🐵', '🐮', '🐷', '🐸', '🐙', '🐢', '🐍', '🐠', '🐳', '🐬', '🐡', '🐊', '🐅', '🐆', '🐴', '🐏', '🐑', '🐐', '🐓', '🦃', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🐯', '🐨', '🐼', '🐵', '🐒', '🦍', '🦧', '🐘', '🦣', '🦏', '🦛', '🐪', '🐫', '🐃', '🐂', '🐄', '🐎', '🐖', '🐗', '🐷', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐓', '🐔', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂']
  
  // 主题元素列表
  const themeElements = ['🌰', '🥧', '🍄', '🌰', '🐿️', '🌸', '🌿', '🍃']
  
  // 切换头像函数
  const changeAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % pixelAnimals.length
      // 保存到localStorage
      localStorage.setItem('userAvatar', pixelAnimals[newIndex])
      return newIndex
    })
  }

  // 检查签到状态和获取松果数量
  useEffect(() => {
    const today = new Date().toDateString()
    const lastCheckedIn = localStorage.getItem('lastCheckedIn')
    if (lastCheckedIn !== today) {
      setShowCheckInModal(true)
    }
    // 初始化浇水次数（如果不存在）
    if (localStorage.getItem('waterCount') === null) {
      localStorage.setItem('waterCount', '0')
      console.log('浇水次数已初始化')
    }
    
    // 初始化连续签到天数（如果不存在）
    if (localStorage.getItem('streakDays') === null) {
      localStorage.setItem('streakDays', '0')
      console.log('连续签到天数已初始化')
    }
    
    // 更新成长树状态
    const currentWaterCount = parseInt(localStorage.getItem('waterCount') || '0')
    setWaterCount(currentWaterCount)
    updateTreeGrowth()
    
    // 更新连续签到天数
    const currentStreakDays = parseInt(localStorage.getItem('streakDays') || '0')
    setUserData(prev => ({
      ...prev,
      streakDays: currentStreakDays
    }))
    console.log('更新连续签到天数:', currentStreakDays)
    
    // 只在totalPinecones不存在时初始化
    if (localStorage.getItem('totalPinecones') === null) {
      localStorage.setItem('totalPinecones', '0')
      console.log('松果数量已初始化')
    }
    
    // 更新松果数量状态
    const updatePineconeCount = () => {
      const count = parseInt(localStorage.getItem('totalPinecones') || '0')
      setPineconeCount(count)
      console.log('更新松果数量状态:', count)
    }
    
    // 初始更新松果数量
    updatePineconeCount()
    
    // 获取用户松果数据
    const fetchPineconeData = async () => {
      try {
        // 获取松果总数
        const totalResponse = await pineconeApi.getTotal()
        localStorage.setItem('totalPinecones', totalResponse.pinecone_count.toString())
        // 更新松果数量状态
        setPineconeCount(totalResponse.pinecone_count)
        
        // 获取松果日志
        const logsResponse = await pineconeApi.getLogs()
        
        setUserData(prev => ({
          ...prev,
          totalWords: parseInt(localStorage.getItem('totalWords') || '0'),
          streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
          pineconeLogs: logsResponse
        }))
      } catch (error) {
        console.error('获取松果数据失败:', error)
        // 降级处理：使用localStorage中已有的值
        setUserData(prev => ({
          ...prev,
          totalWords: parseInt(localStorage.getItem('totalWords') || '0'),
          streakDays: parseInt(localStorage.getItem('streakDays') || '0')
        }))
      }
    }
    
    fetchPineconeData()
    
    // 获取松果银行信息
    const fetchBankInfo = async () => {
      try {
        if (userData.isLoggedIn) {
          const bankData = await bankApi.getBankInfo()
          setBankInfo(bankData)
          console.log('获取松果银行信息成功:', bankData)
        }
      } catch (error) {
        console.error('获取松果银行信息失败:', error)
      }
    }
    
    fetchBankInfo()
    
    // 监听localStorage变化，确保数据更新时能及时反映
    const handleStorageChange = (e) => {
      if (e.key === 'totalPinecones') {
        console.log('松果数量变化:', e.newValue)
        // 更新松果数量状态
        if (e.newValue) {
          setPineconeCount(parseInt(e.newValue))
        }
      } else if (e.key === 'waterCount') {
        console.log('浇水次数变化:', e.newValue)
        // 更新浇水次数状态
        if (e.newValue) {
          const newWaterCount = parseInt(e.newValue)
          setWaterCount(newWaterCount)
          // 更新成长树状态
          if (newWaterCount >= 20) {
            setTreeGrowth('fruiting')
          } else if (newWaterCount >= 15) {
            setTreeGrowth('tree')
          } else if (newWaterCount >= 10) {
            setTreeGrowth('sapling')
          } else if (newWaterCount >= 5) {
            setTreeGrowth('sprout')
          } else {
            setTreeGrowth('seed')
          }
        }
      } else if (e.key === 'streakDays') {
        console.log('连续签到天数变化:', e.newValue)
        // 更新连续签到天数状态
        if (e.newValue) {
          setUserData(prev => ({
            ...prev,
            streakDays: parseInt(e.newValue)
          }))
        }
      } else if (e.key === 'lastCheckedIn') {
        console.log('最后签到日期变化:', e.newValue)
        // 检查是否需要显示签到弹窗
        const today = new Date().toDateString()
        if (e.newValue !== today) {
          setShowCheckInModal(true)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 添加定时检查机制，确保在同一个窗口中也能及时更新数据
    const checkDataUpdate = () => {
      const count = parseInt(localStorage.getItem('totalPinecones') || '0')
      setPineconeCount(count)
      
      const waterCount = parseInt(localStorage.getItem('waterCount') || '0')
      setWaterCount(waterCount)
      
      const streakDays = parseInt(localStorage.getItem('streakDays') || '0')
      setUserData(prev => ({
        ...prev,
        streakDays: streakDays
      }))
      
      console.log('定时检查数据:', { pinecones: count, waterCount: waterCount, streakDays: streakDays })
    }
    
    // 每2秒检查一次
    const intervalId = setInterval(checkDataUpdate, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  // 更新成长树状态
  const updateTreeGrowth = () => {
    if (waterCount >= 20) {
      setTreeGrowth('fruiting')
    } else if (waterCount >= 15) {
      setTreeGrowth('tree')
    } else if (waterCount >= 10) {
      setTreeGrowth('sapling')
    } else if (waterCount >= 5) {
      setTreeGrowth('sprout')
    } else {
      setTreeGrowth('seed')
    }
  }

  // 处理签到
  const handleCheckIn = () => {
    const today = new Date().toDateString()
    const lastCheckedIn = localStorage.getItem('lastCheckedIn')
    const lastCheckedInDate = lastCheckedIn ? new Date(lastCheckedIn) : null
    const todayDate = new Date(today)
    
    // 计算连续签到天数
    let newStreakDays = userData.streakDays
    if (!lastCheckedIn || (todayDate - lastCheckedInDate) > 86400000) { // 超过24小时
      newStreakDays = 1
    } else {
      newStreakDays += 1
    }
    
    // 保存签到状态
    localStorage.setItem('lastCheckedIn', today)
    localStorage.setItem('streakDays', newStreakDays.toString())
    
    // 更新用户数据
    setUserData(prev => ({
      ...prev,
      streakDays: newStreakDays
    }))
    
    // 关闭签到弹窗
    setShowCheckInModal(false)
  }

  // 补签功能
  const handleMakeUpCheckIn = () => {
    // 这里可以实现补签逻辑，例如使用松果币兑换补签机会
    const userRewards = JSON.parse(localStorage.getItem('userRewards') || '{}')
    const pineconeCoins = userRewards['松果币'] || 0
    
    if (pineconeCoins >= 10) {
      // 扣除松果币
      userRewards['松果币'] -= 10
      localStorage.setItem('userRewards', JSON.stringify(userRewards))
      
      // 增加连续签到天数
      const newStreakDays = userData.streakDays + 1
      localStorage.setItem('streakDays', newStreakDays.toString())
      
      // 更新用户数据
      setUserData(prev => ({
        ...prev,
        streakDays: newStreakDays
      }))
      
      alert('补签成功！')
    } else {
      alert('松果币不足，需要10个松果币才能补签')
    }
  }

  // 获取成长树图标
  const getTreeIcon = () => {
    switch (treeGrowth) {
      case 'seed': return '🌰'
      case 'sprout': return '🌱'
      case 'sapling': return '🌿'
      case 'tree': return '🌳'
      case 'fruiting': return '🌲'
      default: return '🌰'
    }
  }

  // 浇水功能
  const waterTree = (e) => {
    // 增加浇水次数（使用函数式更新确保基于最新状态）
    setWaterCount(prevWaterCount => {
      const newWaterCount = prevWaterCount + 1
      localStorage.setItem('waterCount', newWaterCount.toString())
      
      // 立即更新成长树状态（基于新的浇水次数）
      if (newWaterCount >= 20) {
        setTreeGrowth('fruiting')
      } else if (newWaterCount >= 15) {
        setTreeGrowth('tree')
      } else if (newWaterCount >= 10) {
        setTreeGrowth('sapling')
      } else if (newWaterCount >= 5) {
        setTreeGrowth('sprout')
      } else {
        setTreeGrowth('seed')
      }
      
      return newWaterCount
    })
    
    // 创建水滴效果的动态反馈
    createWaterDropEffect(e)
    
    // 播放音效
    playSound()
  }
  
  // 收获树并兑换松果币
  const harvestTree = async () => {
    if (waterCount < 20) {
      alert('浇水次数不足20次，无法兑换松果币！')
      return
    }
    
    setHarvesting(true)
    
    try {
      const response = await bankApi.harvestTree(waterCount)
      console.log('收获树并兑换松果币成功:', response)
      
      // 更新松果银行信息
      setBankInfo(prev => ({
        ...prev,
        pinecone_coins: prev.pinecone_coins + response.pineconeCoins,
        total_trees: prev.total_trees + response.treeCount
      }))
      
      // 重置浇水次数
      setWaterCount(0)
      localStorage.setItem('waterCount', '0')
      updateTreeGrowth()
      
      // 显示成功消息
      alert(response.message)
    } catch (error) {
      console.error('收获树并兑换松果币失败:', error)
      alert('兑换失败，请稍后重试！')
    } finally {
      setHarvesting(false)
    }
  }

  // 创建水滴效果
  const createWaterDropEffect = (e) => {
    if (!containerRef.current) return
    
    // 创建多个水滴元素
    for (let i = 0; i < 5; i++) {
      const drop = document.createElement('div')
      drop.textContent = '💧'
      drop.style.position = 'fixed'
      drop.style.left = `${e.clientX + (Math.random() - 0.5) * 100}px`
      drop.style.top = `${e.clientY}px`
      drop.style.fontSize = `${Math.random() * 1 + 0.5}rem`
      drop.style.pointerEvents = 'none'
      drop.style.zIndex = '1000'
      drop.style.opacity = '0'
      drop.style.transition = `all ${Math.random() * 1 + 1}s ease-out`
      
      // 添加到容器
      containerRef.current.appendChild(drop)
      
      // 触发动画
      requestAnimationFrame(() => {
        drop.style.opacity = '1'
        drop.style.transform = `translateY(-${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`
      })
      
      // 移除元素
      setTimeout(() => {
        drop.remove()
      }, 2000)
    }
  }

  // 计算用户等级
  useEffect(() => {
    calculateUserLevel()
  }, [userData.streakDays, userData.totalWords])

  // 计算用户等级
  const calculateUserLevel = () => {
    // 计算总经验值
    const baseExperience = userData.streakDays * 10 + userData.totalWords * 5
    const newExperience = baseExperience
    
    // 计算等级
    const newLevel = Math.floor(newExperience / 100) + 1
    
    // 确定头衔
    let newTitle = '青铜拾果人'
    if (newLevel >= 10) {
      newTitle = '钻石守林人'
    } else if (newLevel >= 7) {
      newTitle = '黄金守林人'
    } else if (newLevel >= 4) {
      newTitle = '白银育林者'
    }
    
    setUserLevel({
      level: newLevel,
      experience: newExperience,
      title: newTitle
    })
    
    // 保存到localStorage
    localStorage.setItem('userLevel', newLevel.toString())
    localStorage.setItem('userExperience', newExperience.toString())
    localStorage.setItem('userTitle', newTitle)
  }

  // 获取等级图标
  const getLevelIcon = () => {
    if (userLevel.level >= 10) {
      return '💎'
    } else if (userLevel.level >= 7) {
      return '🏆'
    } else if (userLevel.level >= 4) {
      return '🥈'
    } else {
      return '🥉'
    }
  }

  // 获取等级特权
  const getLevelPrivileges = () => {
    const privileges = []
    if (userLevel.level >= 2) {
      privileges.push('解锁基础头像框')
    }
    if (userLevel.level >= 4) {
      privileges.push('高级题目解析权限')
    }
    if (userLevel.level >= 7) {
      privileges.push('名师公开课试看权')
    }
    if (userLevel.level >= 10) {
      privileges.push('专属客服服务')
    }
    return privileges
  }

  // 检查并解锁壁纸/头像
  useEffect(() => {
    checkAndUnlockItems()
  }, [userData.streakDays, userLevel.level])

  // 检查并解锁壁纸/头像
  const checkAndUnlockItems = () => {
    // 解锁所有壁纸和头像挂件
    const newWallpapers = ['forest', 'snow', 'starry']
    const newAvatars = ['silver', 'gold', 'diamond']
    const hasChanges = true

    if (hasChanges) {
      setUnlockedItems({
        wallpapers: newWallpapers,
        avatars: newAvatars
      })
      localStorage.setItem('unlockedWallpapers', JSON.stringify(newWallpapers))
      localStorage.setItem('unlockedAvatars', JSON.stringify(newAvatars))
    }
  }

  // 获取壁纸信息
  const getWallpaperInfo = () => {
    return [
      { id: 'forest', name: '森林小径', unlocked: unlockedItems.wallpapers.includes('forest'), days: 7 },
      { id: 'snow', name: '雪地松针', unlocked: unlockedItems.wallpapers.includes('snow'), days: 14 },
      { id: 'starry', name: '星空松果', unlocked: unlockedItems.wallpapers.includes('starry'), days: 30 }
    ]
  }

  // 获取头像信息
  const getAvatarInfo = () => {
    return [
      { id: 'silver', name: '白银松果', unlocked: unlockedItems.avatars.includes('silver'), level: 4 },
      { id: 'gold', name: '黄金松果', unlocked: unlockedItems.avatars.includes('gold'), level: 7 },
      { id: 'diamond', name: '钻石松果', unlocked: unlockedItems.avatars.includes('diamond'), level: 10 }
    ]
  }

  // 下载壁纸
  const downloadWallpaper = (wallpaperId) => {
    // 这里可以实现壁纸下载功能
    alert(`正在下载 ${wallpaperId} 壁纸...`)
    // 实际项目中可以生成并下载壁纸图片
  }

  // 应用头像挂件
  const applyAvatarBadge = (badgeId) => {
    // 保存头像挂件到localStorage
    localStorage.setItem('currentAvatarBadge', badgeId)
    // 更新状态
    setCurrentAvatarBadge(badgeId)
    // 显示成功提示
    alert(`已应用 ${badgeId === 'silver' ? '白银松果' : badgeId === 'gold' ? '黄金松果' : '钻石松果'} 头像挂件！`)
    // 实际项目中可以将挂件应用到用户头像上
  }
  
  // 显示壁纸预览
  const showWallpaperPreview = (wallpaperId) => {
    // 创建预览模态框
    const modal = document.createElement('div')
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.right = '0'
    modal.style.bottom = '0'
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)'
    modal.style.display = 'flex'
    modal.style.alignItems = 'center'
    modal.style.justifyContent = 'center'
    modal.style.zIndex = '1000'
    modal.style.padding = '20px'
    
    // 创建预览内容
    const previewContent = document.createElement('div')
    previewContent.style.maxWidth = '90%'
    previewContent.style.maxHeight = '90%'
    previewContent.style.position = 'relative'
    
    // 创建壁纸图片
    const wallpaperImg = document.createElement('img')
    wallpaperImg.style.maxWidth = '100%'
    wallpaperImg.style.maxHeight = '80vh'
    wallpaperImg.style.borderRadius = '10px'
    wallpaperImg.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)'
    
    // 设置壁纸图片源
    if (wallpaperId === 'forest') {
      wallpaperImg.src = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20forest%20path%20with%20pine%20trees%2C%20peaceful%20nature%20scene%2C%20soft%20lighting%2C%20high%20quality%20landscape%20photography&image_size=landscape_4_3'
    } else if (wallpaperId === 'snow') {
      wallpaperImg.src = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snowy%20winter%20landscape%20with%20pine%20trees%2C%20peaceful%20snow%20scene%2C%20soft%20lighting%2C%20high%20quality%20winter%20photography&image_size=landscape_4_3'
    } else if (wallpaperId === 'starry') {
      wallpaperImg.src = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=starry%20night%20sky%20with%20pine%20trees%2C%20magical%20night%20scene%2C%20twinkling%20stars%2C%20high%20quality%20night%20photography&image_size=landscape_4_3'
    }
    
    // 创建关闭按钮
    const closeButton = document.createElement('button')
    closeButton.textContent = '✕'
    closeButton.style.position = 'absolute'
    closeButton.style.top = '-40px'
    closeButton.style.right = '0'
    closeButton.style.backgroundColor = 'var(--primary-color)'
    closeButton.style.color = 'white'
    closeButton.style.border = 'none'
    closeButton.style.width = '40px'
    closeButton.style.height = '40px'
    closeButton.style.borderRadius = '50%'
    closeButton.style.fontSize = '20px'
    closeButton.style.cursor = 'pointer'
    closeButton.style.display = 'flex'
    closeButton.style.alignItems = 'center'
    closeButton.style.justifyContent = 'center'
    
    // 关闭按钮点击事件
    closeButton.addEventListener('click', () => {
      modal.remove()
    })
    
    // 点击模态框背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
    
    // 组装预览内容
    previewContent.appendChild(wallpaperImg)
    previewContent.appendChild(closeButton)
    modal.appendChild(previewContent)
    
    // 添加到页面
    document.body.appendChild(modal)
  }
  
  // 播放音效函数
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('音频播放失败:', e))
    }
  }
  
  // 创建掉落元素
  const createFallingElement = (e) => {
    if (!containerRef.current) return
    
    // 随机选择主题元素
    const element = themeElements[Math.floor(Math.random() * themeElements.length)]
    
    // 创建元素
    const fallingEl = document.createElement('div')
    fallingEl.textContent = element
    fallingEl.style.position = 'fixed'
    fallingEl.style.left = `${e.clientX}px`
    fallingEl.style.top = `${e.clientY}px`
    fallingEl.style.fontSize = `${Math.random() * 1.5 + 0.5}rem`
    fallingEl.style.pointerEvents = 'none'
    fallingEl.style.zIndex = '1000'
    fallingEl.style.opacity = '0'
    fallingEl.style.transition = 'all 2s ease-out'
    
    // 添加到容器
    containerRef.current.appendChild(fallingEl)
    
    // 触发动画
    requestAnimationFrame(() => {
      fallingEl.style.opacity = '0.6'
      fallingEl.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`
    })
    
    // 播放音效
    playSound()
    
    // 移除元素
    setTimeout(() => {
      fallingEl.remove()
    }, 2000)
  }
  
  // 页面点击事件
  const handlePageClick = (e) => {
    // 防止在输入框和按钮上触发
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
      return
    }
    createFallingElement(e)
  }
  
  // 登出功能
  const handleLogout = () => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    // 刷新页面或跳转到登录页
    navigate('/login')
  }

  return (
    <div className="profile-container" ref={containerRef} onClick={handlePageClick} style={{
      minHeight: '100vh',
      padding: '20px',
      background: currentWallpaper 
        ? `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${currentWallpaper})` 
        : 'linear-gradient(135deg, var(--background-color), var(--light-color))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 1s ease-in-out'
    }}>
      {/* 动画样式 */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .growth-stage {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      {/* 音频元素 */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" type="audio/wav" />
       </audio>
      
      {/* 签到弹窗 */}
      {showCheckInModal && userData.isLoggedIn && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: 'var(--shadow)',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>🌰 每日签到</h2>
            <div style={{ fontSize: '6rem', marginBottom: '20px' }}>
              🥧
            </div>
            <p style={{ marginBottom: '30px', color: 'var(--text-color)' }}>今天也要坚持学习哦！签到获得松果成长值～</p>
            <button 
              onClick={handleCheckIn}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              今日签到
            </button>
          </div>
        </div>
      )}
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
          <Link to="/checkin" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🥧 松果打卡</Link>
          <Link to="/square" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🏪 松果市集</Link>
          {/* 根据登录状态显示登出或登录按钮 */}
          {userData.isLoggedIn ? (
            <button
              onClick={(e) => {
                createFallingElement(e);
                handleLogout();
              }}
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
                onClick={createFallingElement}
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
        {/* 个人信息卡片 */}
        <div className="card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow)', marginBottom: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '8rem', marginBottom: '20px', position: 'relative' }}>
                {/* 头像切换区域 */}
            {userData.isLoggedIn && (
              <div 
                style={{ 
                  position: 'relative', 
                  display: 'inline-block', 
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease'
                }}
                onClick={(e) => {
                  createFallingElement(e);
                  changeAvatar();
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '8rem', marginBottom: '20px', position: 'relative' }}>
                  {localStorage.getItem('userAvatar') || pixelAnimals[currentAvatarIndex]}
                  {/* 显示头像挂件 */}
                  {currentAvatarBadge && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      right: '-20px', 
                      backgroundColor: 'var(--primary-color)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      <span style={{ fontSize: '2rem', color: 'white' }}>
                        {currentAvatarBadge === 'silver' ? '🥈' : currentAvatarBadge === 'gold' ? '🥇' : '💎'}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  right: '20px', 
                  backgroundColor: 'var(--primary-color)', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow)'
                }}>
                  点击切换
                </div>
              </div>
            )}
            {!userData.isLoggedIn && <div style={{ fontSize: '8rem', marginBottom: '20px' }}>👤</div>}
          </div>
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{userData.username}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '30px' }}>
            {userData.isLoggedIn ? '欢迎回到松果盒子！' : '请先登录查看松果库存'}
          </p>
          
          {/* 松果成长树 */}
          {userData.isLoggedIn && (
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--light-color)', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px', textAlign: 'center', fontSize: '1.5rem' }}>🌱 松果成长树</h3>
              
              {/* 成长树主体 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', position: 'relative' }}>
                {/* 背景效果 */}
                <div style={{ 
                  position: 'absolute', 
                  width: treeGrowth === 'seed' ? '120px' : treeGrowth === 'sprout' ? '150px' : treeGrowth === 'sapling' ? '180px' : treeGrowth === 'tree' ? '210px' : '240px', 
                  height: treeGrowth === 'seed' ? '120px' : treeGrowth === 'sprout' ? '150px' : treeGrowth === 'sapling' ? '180px' : treeGrowth === 'tree' ? '210px' : '240px', 
                  borderRadius: '50%', 
                  backgroundColor: treeGrowth === 'seed' ? '#FFF9C4' : treeGrowth === 'sprout' ? '#E8F5E8' : treeGrowth === 'sapling' ? '#C8E6C9' : treeGrowth === 'tree' ? '#A5D6A7' : '#81C784', 
                  opacity: 0.6, 
                  animation: 'pulse 2s infinite'
                }}></div>
                
                {/* 树图标 */}
                <div style={{ 
                  fontSize: treeGrowth === 'seed' ? '4rem' : treeGrowth === 'sprout' ? '5rem' : treeGrowth === 'sapling' ? '6rem' : treeGrowth === 'tree' ? '7rem' : '8rem', 
                  position: 'relative', 
                  zIndex: 1 
                }}>
                  {getTreeIcon()}
                </div>
              </div>
              
              {/* 浇水能量球 */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '20px', 
                position: 'relative', 
                overflow: 'hidden' 
              }}>
                {/* 能量球背景 */}
                <div style={{ 
                  position: 'absolute', 
                  top: '-50%', 
                  left: '-50%', 
                  width: '200%', 
                  height: '200%', 
                  background: 'linear-gradient(45deg, #FFD54F, #FFA726, #FFD54F)', 
                  opacity: 0.1, 
                  animation: 'spin 10s linear infinite' 
                }}></div>
                
                {/* 能量球内容 */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💧</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '5px' }}>
                    浇水能量
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>
                    {waterCount} / 20
                  </div>
                  <div style={{ 
                    width: '80%', 
                    height: '10px', 
                    backgroundColor: '#E0E0E0', 
                    borderRadius: '5px', 
                    margin: '20px auto', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      width: `${Math.min((waterCount / 20) * 100, 100)}%`, 
                      height: '100%', 
                      backgroundColor: '#FF9800', 
                      borderRadius: '5px', 
                      transition: 'width 0.5s ease' 
                    }}></div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-color)' }}>
                    {waterCount >= 20 ? '🎉 能量已满！' : `还需要 ${20 - waterCount} 次浇水`}
                  </div>
                </div>
              </div>
              
              {/* 成长阶段 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: '10px', 
                marginBottom: '20px' 
              }}>
                {[
                  { stage: 'seed', icon: '🌰', name: '种子', range: '0-4次', isActive: waterCount >= 0 },
                  { stage: 'sprout', icon: '🌱', name: '发芽', range: '5-9次', isActive: waterCount >= 5 },
                  { stage: 'sapling', icon: '🌿', name: '幼苗', range: '10-14次', isActive: waterCount >= 10 },
                  { stage: 'tree', icon: '🌳', name: '小树', range: '15-19次', isActive: waterCount >= 15 },
                  { stage: 'fruiting', icon: '🌲', name: '结果', range: '20+次', isActive: waterCount >= 20 }
                ].map((stage, index) => (
                  <div key={stage.stage} style={{ 
                    flex: '1 1 calc(20% - 10px)', 
                    textAlign: 'center', 
                    padding: '15px', 
                    backgroundColor: stage.isActive ? '#E8F5E8' : 'var(--card-bg)', 
                    borderRadius: '15px', 
                    border: stage.isActive ? '2px solid #4CAF50' : '2px solid transparent', 
                    transition: 'all 0.3s ease' 
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{stage.icon}</div>
                    <div style={{ fontWeight: 'bold', color: stage.isActive ? '#4CAF50' : 'var(--text-color)' }}>{stage.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-color)' }}>{stage.range}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={handleMakeUpCheckIn}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}
                >
                  🪄 松果补签卡
                </button>
                <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)', marginBottom: '20px' }}>
                  花费10个松果币，补签一天（连续签到不中断）
                </p>
                
                {/* 浇水按钮 */}
                <button 
                  onClick={waterTree}
                  disabled={waterCount >= 20}
                  style={{
                    backgroundColor: waterCount >= 20 ? '#ccc' : 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: waterCount >= 20 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}
                >
                  {waterCount >= 20 ? '🎉 能量已满！' : '💧 浇水'}
                </button>
                
                {/* 收获树并兑换松果币按钮 */}
                <button 
                  onClick={harvestTree}
                  disabled={waterCount < 20 || harvesting}
                  style={{
                    backgroundColor: waterCount < 20 ? '#ccc' : '#FF9800',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    cursor: waterCount < 20 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                >
                  {harvesting ? '🌱 兑换中...' : '🌲 收获并兑换松果币'}
                </button>
                <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)' }}>
                  每20次浇水可兑换10个松果币！
                </p>
              </div>
            </div>
          )}
          
          {/* 学习统计 */}
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
            <div style={{ backgroundColor: 'var(--light-color)', padding: '20px', borderRadius: '15px', minWidth: '150px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{parseInt(localStorage.getItem('totalWords') || '0')}</div>
              <div style={{ color: 'var(--text-color)' }}>累计单词</div>
            </div>
            <div style={{ backgroundColor: 'var(--light-color)', padding: '20px', borderRadius: '15px', minWidth: '150px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔥</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{parseInt(localStorage.getItem('streakDays') || '0')}</div>
              <div style={{ color: 'var(--text-color)' }}>连续天数</div>
            </div>
            <div style={{ backgroundColor: 'var(--light-color)', padding: '20px', borderRadius: '15px', minWidth: '150px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{bankInfo.pinecone_coins}</div>
              <div style={{ color: 'var(--text-color)' }}>松果币</div>
            </div>
            <div style={{ backgroundColor: 'var(--light-color)', padding: '20px', borderRadius: '15px', minWidth: '150px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌲</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{bankInfo.total_trees}</div>
              <div style={{ color: 'var(--text-color)' }}>成长树</div>
            </div>
          </div>
          
          {/* 松果银行 */}
          {userData.isLoggedIn && (
            <div style={{ marginTop: '40px', padding: '30px', backgroundColor: 'var(--light-color)', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px', textAlign: 'center' }}>🏦 松果银行</h3>
              
              {/* 银行信息 */}
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '15px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{bankInfo.pinecone_coins}</div>
                  <div style={{ color: 'var(--text-color)' }}>松果币余额</div>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '15px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌲</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{bankInfo.total_trees}</div>
                  <div style={{ color: 'var(--text-color)' }}>已收获成长树</div>
                </div>
              </div>
              
              {/* 兑换规则 */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>📋 兑换规则</h4>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🌱</span>
                    <span>每浇水20次，可收获1棵成长树</span>
                  </li>
                  <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>💰</span>
                    <span>每棵成长树可兑换10个松果币</span>
                  </li>
                  <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>🎁</span>
                    <span>松果币可用于购买补签卡等道具</span>
                  </li>
                </ul>
              </div>
              
              {/* 当前进度 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>📈 当前浇水进度</h4>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#E0E0E0', 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{ 
                    width: `${Math.min((waterCount / 20) * 100, 100)}%`, 
                    height: '100%', 
                    backgroundColor: '#4CAF50', 
                    borderRadius: '10px', 
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-color)' }}>
                  已浇水 {waterCount} 次，还需 {Math.max(0, 20 - waterCount)} 次可收获成长树
                </div>
              </div>
            </div>
          )}
          
          {/* 松果储存记录器 */}
          {userData.isLoggedIn && (
            <div style={{ marginTop: '40px', padding: '30px', backgroundColor: 'var(--light-color)', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px', textAlign: 'center' }}>🌰 松果储存记录器</h3>
              
              {/* 松果数量显示 */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🌰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{pineconeCount}</div>
                <div style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>松果种子库</div>
              </div>
              

              
              {/* 松果获取历史 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>📋 松果获取历史</h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: 'var(--card-bg)', borderRadius: '15px', padding: '20px' }}>
                  {userData.pineconeLogs ? (
                    userData.pineconeLogs.map((log, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        borderBottom: '1px solid var(--light-color)',
                        marginBottom: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontSize: '1.5rem' }}>🌰</div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{log.reason}</div>
                            <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>
                              {new Date(log.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontWeight: 'bold'
                        }}>
                          +{log.amount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-color)' }}>
                      <p>暂无松果获取记录</p>
                      <p style={{ fontSize: '14px', marginTop: '10px' }}>完成单词打卡测试获得松果</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 松果使用建议 */}
              <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '15px' }}>
                <h4 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>💡 松果使用建议</h4>
                <ul style={{ color: 'var(--text-color)', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '8px' }}>完成单词打卡测试获得松果</li>
                  <li style={{ marginBottom: '8px' }}>连续打卡天数越多，获得的松果越多</li>
                  <li style={{ marginBottom: '8px' }}>松果可以用于补签打卡</li>
                  <li style={{ marginBottom: '8px' }}>未来将开放松果兑换更多功能</li>
                </ul>
              </div>
            </div>
          )}

          {/* 森林物语 */}
          {userData.isLoggedIn && (
            <div className="card" style={{ marginTop: '40px' }}>
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>森林物语</h2>
              
              {/* 等级勋章系统 */}
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'var(--light-color)', borderRadius: '15px' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>🎖️ 等级勋章系统</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '4rem', marginRight: '20px' }}>
                    {getLevelIcon()}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{userLevel.title}</h4>
                    <p style={{ color: 'var(--text-color)', marginBottom: '5px' }}>等级: {userLevel.level}</p>
                    <p style={{ color: 'var(--text-color)' }}>经验值: {userLevel.experience}</p>
                  </div>
                </div>
                
                {/* 等级特权 */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>🌟 等级特权</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {getLevelPrivileges().map((privilege, index) => (
                      <div key={index} style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        ✨ {privilege}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 等级进度 */}
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>📈 升级进度</h4>
                  <div style={{ 
                    width: '100%', 
                    height: '10px', 
                    backgroundColor: 'var(--light-color)', 
                    borderRadius: '5px',
                    overflow: 'hidden',
                    border: '2px solid var(--primary-color)'
                  }}>
                    <div style={{ 
                      width: `${((userLevel.experience % 100) / 100) * 100}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--primary-color)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '5px', 
                    fontSize: '14px', 
                    color: 'var(--text-color)'
                  }}>
                    {userLevel.experience % 100}/100 经验值
                  </p>
                </div>
              </div>
              
              {/* 主题颜色选择 */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>🌳 主题颜色</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {[
                    { name: '森林绿', colors: { primary: '#4CAF50', secondary: '#81C784', accent: '#2E7D32' } },
                    { name: '薄荷绿', colors: { primary: '#b2d8d8', secondary: '#d4e6a5', accent: '#ffc898' } },
                    { name: '暖橙色', colors: { primary: '#ffc898', secondary: '#d4e6a5', accent: '#b2d8d8' } },
                    { name: '淡紫色', colors: { primary: '#d8b4fe', secondary: '#e9d5ff', accent: '#c4b5fd' } }
                  ].map((theme, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        createFallingElement(e);
                        document.documentElement.style.setProperty('--primary-color', theme.colors.primary);
                        document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
                        document.documentElement.style.setProperty('--accent-color', theme.colors.accent);
                      }}
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold'
                      }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 森林伙伴 */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>🐿️ 森林伙伴</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {['🐿️', '🌰', '🦉', '🦔', '🐦', '🌲', '🐇', '🍄', '🐝', '🌸'].map((avatar, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        createFallingElement(e);
                        // 这里可以保存头像选择到localStorage
                        localStorage.setItem('userAvatar', avatar);
                        alert(`已选择森林伙伴: ${avatar}`);
                      }}
                      style={{
                        fontSize: '2rem',
                        backgroundColor: 'var(--light-color)',
                        border: '2px solid var(--primary-color)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>



              {/* 解锁专属内容 */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>🎁 解锁专属内容</h3>
                <div style={{ padding: '20px', backgroundColor: 'var(--light-color)', borderRadius: '15px' }}>
                  {/* 壁纸解锁 */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>🖼️ 专属壁纸</h4>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {getWallpaperInfo().map((wallpaper) => (
                        <div key={wallpaper.id} style={{ textAlign: 'center' }}>
                          <div 
                            style={{
                              width: '150px',
                              height: '100px',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '10px',
                              cursor: wallpaper.unlocked ? 'pointer' : 'not-allowed',
                              opacity: 1,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                              overflow: 'hidden',
                              backgroundImage: wallpaper.id === 'forest' 
                                ? 'url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20forest%20path%20with%20pine%20trees%2C%20peaceful%20nature%20scene%2C%20soft%20lighting%2C%20high%20quality%20landscape%20photography&image_size=landscape_4_3")' 
                                : wallpaper.id === 'snow' 
                                  ? 'url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snowy%20winter%20landscape%20with%20pine%20trees%2C%20peaceful%20snow%20scene%2C%20soft%20lighting%2C%20high%20quality%20winter%20photography&image_size=landscape_4_3")' 
                                  : 'url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=starry%20night%20sky%20with%20pine%20trees%2C%20magical%20night%20scene%2C%20twinkling%20stars%2C%20high%20quality%20night%20photography&image_size=landscape_4_3")'
                            }}
                            onClick={() => {
                              if (wallpaper.unlocked) {
                                // 设置当前壁纸作为页面背景
                                const wallpaperUrl = wallpaper.id === 'forest' 
                                  ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20forest%20path%20with%20pine%20trees%2C%20peaceful%20nature%20scene%2C%20soft%20lighting%2C%20high%20quality%20landscape%20photography&image_size=landscape_4_3'
                                  : wallpaper.id === 'snow'
                                    ? 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snowy%20winter%20landscape%20with%20pine%20trees%2C%20peaceful%20snow%20scene%2C%20soft%20lighting%2C%20high%20quality%20winter%20photography&image_size=landscape_4_3'
                                    : 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=starry%20night%20sky%20with%20pine%20trees%2C%20magical%20night%20scene%2C%20twinkling%20stars%2C%20high%20quality%20night%20photography&image_size=landscape_4_3'
                                setCurrentWallpaper(wallpaperUrl)
                                // 显示壁纸预览
                                showWallpaperPreview(wallpaper.id)
                              }
                            }}
                          >
                            <div style={{ 
                              position: 'absolute', 
                              top: 0, 
                              left: 0, 
                              right: 0, 
                              bottom: 0, 
                              backgroundColor: wallpaper.unlocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {wallpaper.unlocked ? (
                                <span style={{ fontSize: '2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                  {wallpaper.id === 'forest' ? '🌲' : wallpaper.id === 'snow' ? '❄️' : '✨'}
                                </span>
                              ) : (
                                <div style={{ textAlign: 'center' }}>
                                  <span style={{ fontSize: '2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🔒</span>
                                  <div style={{ fontSize: '0.9rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginTop: '5px' }}>
                                    {wallpaper.days}天解锁
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-color)', marginBottom: '10px' }}>
                            {wallpaper.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 头像解锁 */}
                  <div>
                    <h4 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>🎭 专属头像挂件</h4>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {getAvatarInfo().map((avatar) => (
                        <div key={avatar.id} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: avatar.unlocked ? 'var(--primary-color)' : '#ccc',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px',
                            cursor: avatar.unlocked ? 'pointer' : 'not-allowed',
                            opacity: avatar.unlocked ? 1 : 0.5,
                            position: 'relative'
                          }}>
                            {avatar.unlocked ? (
                              <div style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0, 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <span style={{ fontSize: '2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                  {avatar.id === 'silver' ? '🥈' : avatar.id === 'gold' ? '🥇' : '💎'}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-color)' }}>
                                等级{avatar.level}解锁
                              </span>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-color)', marginBottom: '10px' }}>
                            {avatar.name}
                          </p>
                          {avatar.unlocked && (
                            <button
                              onClick={() => applyAvatarBadge(avatar.id)}
                              style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 'bold',
                                fontSize: '12px'
                              }}
                            >
                              应用挂件
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 林间絮语 */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>😊 林间絮语</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {['😊', '😄', '🥰', '😎', '🤔', '😴', '😤', '😭', '🤩', '🙏'].map((mood, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        createFallingElement(e);
                        // 这里可以保存心情选择到localStorage
                        localStorage.setItem('userMood', mood);
                        alert(`已选择林间絮语: ${mood}`);
                      }}
                      style={{
                        fontSize: '2rem',
                        backgroundColor: 'var(--light-color)',
                        border: '2px solid var(--primary-color)',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 成就展示 */}
        <div className="card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow)', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '30px' }}>松果成就</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {userData.achievements.map(achievement => (
              <div 
                key={achievement.id} 
                style={{
                  backgroundColor: 'var(--light-color)',
                  padding: '20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{achievement.icon}</div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{achievement.name}</h3>
                <p style={{ color: 'var(--text-color)', fontSize: '14px' }}>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 学习记录 */}
        <div className="card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '30px' }}>松果记录</h2>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: 'var(--light-color)', borderRadius: '15px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--primary-color)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '1.5rem' }}>📅</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>2026-01-26</div>
                  <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>完成难度1的单词打卡</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                已完成
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--primary-color)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '1.5rem' }}>📅</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>2026-01-25</div>
                  <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>学习了5个新单词</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                已完成
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--primary-color)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '1.5rem' }}>📅</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>2026-01-24</div>
                  <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>连续打卡7天</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-color)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                成就解锁
              </div>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/checkin">
            <button className="healing-btn" onClick={createFallingElement}>继续打卡</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile