import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Square = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('square') // square、shop 或 leaderboard
  
  // 登出功能
  const handleLogout = () => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    // 跳转到登录页
    navigate('/login')
  }
  
  // 模拟广场动态数据
  const [activities, setActivities] = useState([
    {
      id: 1,
      username: '小明',
      avatar: '👦',
      content: '今天完成了难度2的单词打卡！继续加油！',
      time: '10分钟前',
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      username: '小红',
      avatar: '👧',
      content: '连续打卡14天，获得了"坚持达人"成就！',
      time: '1小时前',
      likes: 25,
      isLiked: true
    },
    {
      id: 3,
      username: '小华',
      avatar: '👦',
      content: '学习了5个新单词，感觉收获满满！',
      time: '2小时前',
      likes: 8,
      isLiked: false
    },
    {
      id: 4,
      username: '小丽',
      avatar: '👧',
      content: '难度3的单词有点挑战，但是我做到了！',
      time: '3小时前',
      likes: 18,
      isLiked: false
    },
    {
      id: 5,
      username: '小强',
      avatar: '👦',
      content: '今天学会了"butterfly"这个单词，好有趣！',
      time: '5小时前',
      likes: 15,
      isLiked: true
    }
  ])

  // 商店商品数据
  const [shopItems, setShopItems] = useState([
    // 消耗品
    {
      id: 1,
      name: '松果补签卡',
      description: '使用后可补签一天，保持连续签到记录',
      price: 10,
      type: 'consumable',
      icon: '🪄',
      stock: 999,
      category: 'consumables',
      rarity: 'common'
    },
    {
      id: 2,
      name: '经验翻倍卡',
      description: '使用后24小时内获得的经验值翻倍',
      price: 30,
      type: 'consumable',
      icon: '✨',
      stock: 100,
      category: 'consumables',
      rarity: 'uncommon'
    },
    {
      id: 3,
      name: '松果雨卡',
      description: '使用后下次打卡获得额外3个松果',
      price: 25,
      type: 'consumable',
      icon: '🌰',
      stock: 150,
      category: 'consumables',
      rarity: 'uncommon'
    },
    // 装饰品
    {
      id: 4,
      name: '白银松果挂件',
      description: '个人页面头像装饰，彰显你的松果成就',
      price: 50,
      type: 'decoration',
      icon: '🥈',
      stock: 50,
      category: 'decorations',
      rarity: 'uncommon'
    },
    {
      id: 5,
      name: '黄金松果挂件',
      description: '高级头像装饰，只有松果大师才能拥有',
      price: 100,
      type: 'decoration',
      icon: '🥇',
      stock: 20,
      category: 'decorations',
      rarity: 'rare'
    },
    {
      id: 6,
      name: '钻石松果挂件',
      description: '顶级头像装饰，象征松果王者的荣耀',
      price: 200,
      type: 'decoration',
      icon: '💎',
      stock: 10,
      category: 'decorations',
      rarity: 'epic'
    },
    {
      id: 7,
      name: '传奇松果挂件',
      description: '传说级头像装饰，只有最顶尖的松果收集者才能拥有',
      price: 350,
      type: 'decoration',
      icon: '🦸‍♂️',
      stock: 5,
      category: 'decorations',
      rarity: 'legendary'
    },
    {
      id: 8,
      name: '神话松果挂件',
      description: '神话级头像装饰，象征着松果世界的最高荣耀',
      price: 500,
      type: 'decoration',
      icon: '🌟',
      stock: 3,
      category: 'decorations',
      rarity: 'mythic'
    },
    // 礼物
    {
      id: 9,
      name: '友谊之花',
      description: '送给好友的礼物，表达你的友谊',
      price: 15,
      type: 'gift',
      icon: '🌸',
      stock: 999,
      category: 'gifts',
      rarity: 'common'
    },
    {
      id: 10,
      name: '幸运星',
      description: '送给好友的礼物，带来好运和祝福',
      price: 25,
      type: 'gift',
      icon: '⭐',
      stock: 500,
      category: 'gifts',
      rarity: 'uncommon'
    },
    {
      id: 11,
      name: '彩虹气球',
      description: '送给好友的礼物，带来快乐和惊喜',
      price: 30,
      type: 'gift',
      icon: '🌈',
      stock: 300,
      category: 'gifts',
      rarity: 'uncommon'
    },
    // 特殊商品
    {
      id: 12,
      name: '成长加速剂',
      description: '使用后成长树立即获得5次浇水效果',
      price: 40,
      type: 'special',
      icon: '🚀',
      stock: 80,
      category: 'specials',
      rarity: 'rare'
    },
    {
      id: 13,
      name: '幸运宝箱',
      description: '打开后随机获得珍贵物品',
      price: 60,
      type: 'special',
      icon: '📦',
      stock: 50,
      category: 'specials',
      rarity: 'epic'
    }
  ])

  // 用户余额
  const [userBalance, setUserBalance] = useState({
    pinecones: parseInt(localStorage.getItem('totalPinecones') || '0'),
    pineconeCoins: parseInt(localStorage.getItem('pineconeCoins') || '0')
  })

  // 模拟好友列表
  const [friends, setFriends] = useState([
    { id: 1, name: '小明', avatar: '👦' },
    { id: 2, name: '小红', avatar: '👧' },
    { id: 3, name: '小华', avatar: '👦' },
    { id: 4, name: '小丽', avatar: '👧' },
    { id: 5, name: '小强', avatar: '👦' }
  ])

  // 选中的好友
  const [selectedFriend, setSelectedFriend] = useState(null)

  // 排行榜数据
  const [leaderboards, setLeaderboards] = useState({
    pinecones: [
      { rank: 1, name: '松果王者', avatar: '👑', score: 1200, badge: '💎' },
      { rank: 2, name: '松果大师', avatar: '🧙‍♂️', score: 950, badge: '🥇' },
      { rank: 3, name: '松果达人', avatar: '🌟', score: 780, badge: '🥈' },
      { rank: 4, name: '松果爱好者', avatar: '🥧', score: 520, badge: '🥉' },
      { rank: 5, name: '小明', avatar: '👦', score: 380, badge: '✨' },
      { rank: 6, name: '小红', avatar: '👧', score: 320, badge: '✨' },
      { rank: 7, name: '小华', avatar: '👦', score: 280, badge: '✨' },
      { rank: 8, name: '小丽', avatar: '👧', score: 250, badge: '✨' },
      { rank: 9, name: '小强', avatar: '👦', score: 220, badge: '✨' },
      { rank: 10, name: '松果新手', avatar: '🌱', score: 150, badge: '✨' }
    ],
    streak: [
      { rank: 1, name: '坚持王者', avatar: '🏆', score: 365, badge: '💎' },
      { rank: 2, name: '坚持大师', avatar: '🔥', score: 180, badge: '🥇' },
      { rank: 3, name: '坚持达人', avatar: '🌟', score: 90, badge: '🥈' },
      { rank: 4, name: '坚持爱好者', avatar: '💪', score: 60, badge: '🥉' },
      { rank: 5, name: '小红', avatar: '👧', score: 14, badge: '✨' },
      { rank: 6, name: '小明', avatar: '👦', score: 7, badge: '✨' },
      { rank: 7, name: '小华', avatar: '👦', score: 5, badge: '✨' },
      { rank: 8, name: '小丽', avatar: '👧', score: 3, badge: '✨' },
      { rank: 9, name: '小强', avatar: '👦', score: 2, badge: '✨' },
      { rank: 10, name: '坚持新手', avatar: '🌱', score: 1, badge: '✨' }
    ],
    words: [
      { rank: 1, name: '词汇王者', avatar: '📚', score: 500, badge: '💎' },
      { rank: 2, name: '词汇大师', avatar: '🧠', score: 400, badge: '🥇' },
      { rank: 3, name: '词汇达人', avatar: '💡', score: 300, badge: '🥈' },
      { rank: 4, name: '词汇爱好者', avatar: '📝', score: 200, badge: '🥉' },
      { rank: 5, name: '小明', avatar: '👦', score: 120, badge: '✨' },
      { rank: 6, name: '小红', avatar: '👧', score: 100, badge: '✨' },
      { rank: 7, name: '小华', avatar: '👦', score: 80, badge: '✨' },
      { rank: 8, name: '小丽', avatar: '👧', score: 60, badge: '✨' },
      { rank: 9, name: '小强', avatar: '👦', score: 50, badge: '✨' },
      { rank: 10, name: '词汇新手', avatar: '🌱', score: 20, badge: '✨' }
    ]
  })

  // 当前选中的排行榜类型
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('pinecones')
  
  // 当前选中的商品类别
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 更新用户余额
  useEffect(() => {
    setUserBalance({
      pinecones: parseInt(localStorage.getItem('totalPinecones') || '0'),
      pineconeCoins: parseInt(localStorage.getItem('pineconeCoins') || '0')
    })
  }, [])

  const handleLike = (id) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        return {
          ...activity,
          isLiked: !activity.isLiked,
          likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
        }
      }
      return activity
    }))
  }

  // 购买商品
  const handlePurchase = (item) => {
    if (userBalance.pinecones < item.price) {
      // 显示松果不足的动画
      showPineconeInsufficientAnimation()
      return
    }

    // 显示购买中动画
    showPurchaseAnimation(item)

    // 扣除松果
    const newBalance = userBalance.pinecones - item.price
    localStorage.setItem('totalPinecones', newBalance.toString())
    setUserBalance(prev => ({
      ...prev,
      pinecones: newBalance
    }))

    // 处理购买逻辑
    if (item.type === 'consumable') {
      // 消耗品购买成功
      setTimeout(() => {
        showPurchaseSuccessAnimation(item, `使用后可补签一天，保持连续签到记录`)
      }, 1000)
    } else if (item.type === 'decoration') {
      // 解锁对应的头像挂件
      const currentAvatars = JSON.parse(localStorage.getItem('unlockedAvatars') || '[]')
      if (!currentAvatars.includes(item.id)) {
        currentAvatars.push(item.id)
        localStorage.setItem('unlockedAvatars', JSON.stringify(currentAvatars))
      }
      setTimeout(() => {
        showPurchaseSuccessAnimation(item, `${item.name}已解锁，可在个人页面设置`)
      }, 1000)
    } else if (item.type === 'gift') {
      // 显示好友选择界面
      setTimeout(() => {
        const friendName = prompt('请输入好友名字：')
        if (friendName) {
          showPurchaseSuccessAnimation(item, `礼物已发送给 ${friendName}！`)
        }
      }, 1000)
    } else if (item.type === 'special') {
      // 特殊商品购买成功
      setTimeout(() => {
        if (item.name === '幸运宝箱') {
          // 打开宝箱的特殊动画
          openLuckyBox(item)
        } else {
          showPurchaseSuccessAnimation(item, item.description)
        }
      }, 1000)
    }

    // 减少库存
    setShopItems(shopItems.map(shopItem => {
      if (shopItem.id === item.id && shopItem.stock > 0) {
        return {
          ...shopItem,
          stock: shopItem.stock - 1
        }
      }
      return shopItem
    }))
  }
  
  // 显示松果不足的动画
  const showPineconeInsufficientAnimation = () => {
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #F44336, #FF5722);
        color: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(244, 67, 54, 0.4);
        text-align: center;
        z-index: 1000;
        animation: bounceIn 0.5s ease-out forwards;
        font-family: Arial, sans-serif;
      ">
        <div style="font-size: 3rem; margin-bottom: 20px;">🌰</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">松果数量不足！</h3>
        <p style="font-size: 1rem;">请先去打卡获得更多松果哦！</p>
      </div>
      <style>
        @keyframes bounceIn {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
      </style>
    `
    document.body.appendChild(notification)
    
    // 3秒后移除
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease-out forwards'
      setTimeout(() => notification.remove(), 500)
    }, 3000)
  }
  
  // 显示购买中动画
  const showPurchaseAnimation = (item) => {
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(76, 175, 80, 0.4);
        text-align: center;
        z-index: 1000;
        animation: bounceIn 0.5s ease-out forwards;
        font-family: Arial, sans-serif;
      ">
        <div style="font-size: 3rem; margin-bottom: 20px; animation: spin 2s linear infinite;">${item.icon}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">购买中...</h3>
        <p style="font-size: 1rem;">正在为你准备 ${item.name}...</p>
      </div>
      <style>
        @keyframes bounceIn {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
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
      </style>
    `
    document.body.appendChild(notification)
    
    // 1秒后移除
    setTimeout(() => {
      notification.remove()
    }, 1000)
  }
  
  // 显示购买成功动画
  const showPurchaseSuccessAnimation = (item, message) => {
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(76, 175, 80, 0.4);
        text-align: center;
        z-index: 1000;
        animation: bounceIn 0.5s ease-out forwards;
        font-family: Arial, sans-serif;
      ">
        <div style="font-size: 4rem; margin-bottom: 20px; animation: bounce 2s infinite;">🎉</div>
        <h3 style="font-size: 1.8rem; margin-bottom: 15px;">购买成功！</h3>
        <div style="font-size: 1.5rem; margin-bottom: 15px;">${item.icon} ${item.name}</div>
        <p style="font-size: 1.1rem; margin-bottom: 20px; line-height: 1.4;">${message}</p>
      </div>
      <style>
        @keyframes bounceIn {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
      </style>
    `
    document.body.appendChild(notification)
    
    // 4秒后移除
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease-out forwards'
      setTimeout(() => notification.remove(), 500)
    }, 4000)
  }
  
  // 打开幸运宝箱
  const openLuckyBox = (item) => {
    // 随机获得物品
    const possibleRewards = [
      { name: '松果补签卡', icon: '🪄', description: '使用后可补签一天' },
      { name: '经验翻倍卡', icon: '✨', description: '24小时内经验值翻倍' },
      { name: '松果雨卡', icon: '🌰', description: '额外获得3个松果' },
      { name: '成长加速剂', icon: '🚀', description: '成长树获得5次浇水效果' }
    ]
    const randomReward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)]
    
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFEB3B, #FFC107);
        color: #2F2F2F;
        padding: 40px;
        border-radius: 25px;
        box-shadow: 0 15px 50px rgba(255, 235, 59, 0.6);
        text-align: center;
        z-index: 1000;
        animation: bounceIn 0.5s ease-out forwards;
        font-family: Arial, sans-serif;
      ">
        <div style="font-size: 5rem; margin-bottom: 20px; animation: spin 2s linear infinite;">📦</div>
        <h3 style="font-size: 2rem; margin-bottom: 20px; color: #2F2F2F;">恭喜你！</h3>
        <p style="font-size: 1.2rem; margin-bottom: 25px; color: #2F2F2F;">打开幸运宝箱获得：</p>
        <div style="font-size: 2rem; margin-bottom: 15px;">${randomReward.icon} ${randomReward.name}</div>
        <p style="font-size: 1.1rem; margin-bottom: 25px; line-height: 1.4; color: #2F2F2F;">${randomReward.description}</p>
      </div>
      <style>
        @keyframes bounceIn {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
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
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
      </style>
    `
    document.body.appendChild(notification)
    
    // 5秒后移除
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease-out forwards'
      setTimeout(() => notification.remove(), 500)
    }, 5000)
  }

  return (
    <div className="square-container" style={{
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
          <Link to="/checkin" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🥧 松果打卡</Link>
          <Link to="/profile" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold' }}>🥧 松果盒子</Link>
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
        {/* 页面标题 */}
        <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '30px' }}>松果市集</h2>

        {/* 标签页切换 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          marginBottom: '30px',
          padding: '10px',
          backgroundColor: 'var(--light-color)',
          borderRadius: '25px',
          boxShadow: 'var(--shadow)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('square')}
            style={{
              padding: '15px 25px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'square' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'square' ? 'white' : 'var(--text-color)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem'
            }}
          >
            🌟 松果广场
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            style={{
              padding: '15px 25px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'shop' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'shop' ? 'white' : 'var(--text-color)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem'
            }}
          >
            🛒 松果商店
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '15px 25px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'leaderboard' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'leaderboard' ? 'white' : 'var(--text-color)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem'
            }}
          >
            🏆 松果排行榜
          </button>
        </div>

        {/* 余额显示（仅在商店标签页显示） */}
        {activeTab === 'shop' && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '5px' }}>松果余额</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>🌰 {userBalance.pinecones}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '5px' }}>松果币余额</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>💰 {userBalance.pineconeCoins}</div>
            </div>
          </div>
        )}

        {/* 广场内容 */}
        {activeTab === 'square' && (
          <div>
            {/* 广场动态列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activities.map(activity => (
                <div 
                  key={activity.id} 
                  className="activity-card" 
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: 'var(--shadow)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* 用户信息 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ fontSize: '2.5rem' }}>{activity.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '18px' }}>{activity.username}</div>
                      <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>{activity.time}</div>
                    </div>
                  </div>

                  {/* 动态内容 */}
                  <div style={{ marginBottom: '15px', color: 'var(--text-color)', fontSize: '16px', lineHeight: '1.6' }}>
                    {activity.content}
                  </div>

                  {/* 互动按钮 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                      onClick={() => handleLike(activity.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: activity.isLiked ? 'var(--accent-color)' : 'var(--light-color)',
                        color: activity.isLiked ? 'var(--text-color)' : 'var(--text-color)',
                        border: `2px solid ${activity.isLiked ? 'var(--primary-color)' : 'var(--primary-color)'}`,
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{activity.isLiked ? '❤️' : '🤍'}</span>
                      <span>{activity.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 空状态 */}
            {activities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--card-bg)', borderRadius: '20px', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '8rem', marginBottom: '20px' }}>🥧</div>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>暂无松果动态</h2>
                <p style={{ color: 'var(--text-color)', marginBottom: '30px' }}>快来分享你的松果故事吧！</p>
                <Link to="/checkin">
                  <button className="healing-btn">去捡松果</button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 商店内容 */}
        {activeTab === 'shop' && (
          <div>
            {/* 商品类别筛选 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '15px', 
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: 'var(--light-color)',
              borderRadius: '25px',
              boxShadow: 'var(--shadow)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedCategory === 'all' ? 'var(--primary-color)' : 'transparent',
                  color: selectedCategory === 'all' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                全部商品
              </button>
              <button
                onClick={() => setSelectedCategory('consumables')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedCategory === 'consumables' ? 'var(--primary-color)' : 'transparent',
                  color: selectedCategory === 'consumables' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                🪄 消耗品
              </button>
              <button
                onClick={() => setSelectedCategory('decorations')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedCategory === 'decorations' ? 'var(--primary-color)' : 'transparent',
                  color: selectedCategory === 'decorations' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                🎨 装饰品
              </button>
              <button
                onClick={() => setSelectedCategory('gifts')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedCategory === 'gifts' ? 'var(--primary-color)' : 'transparent',
                  color: selectedCategory === 'gifts' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                🎁 礼物
              </button>
              <button
                onClick={() => setSelectedCategory('specials')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedCategory === 'specials' ? 'var(--primary-color)' : 'transparent',
                  color: selectedCategory === 'specials' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                🌟 特殊
              </button>
            </div>
            
            {/* 商店商品列表 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
              {shopItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory).map(item => {
                // 根据稀有度设置边框颜色
                let borderColor = 'var(--light-color)'
                let glowEffect = 'none'
                switch (item.rarity) {
                  case 'common':
                    borderColor = '#9E9E9E' // 灰色
                    break
                  case 'uncommon':
                    borderColor = '#4CAF50' // 绿色
                    break
                  case 'rare':
                    borderColor = '#2196F3' // 蓝色
                    glowEffect = '0 0 20px rgba(33, 150, 243, 0.5)'
                    break
                  case 'epic':
                    borderColor = '#9C27B0' // 紫色
                    glowEffect = '0 0 25px rgba(156, 39, 176, 0.6)'
                    break
                  case 'legendary':
                    borderColor = '#FF9800' // 橙色
                    glowEffect = '0 0 30px rgba(255, 152, 0, 0.7)'
                    break
                  case 'mythic':
                    borderColor = '#FFEB3B' // 金色
                    glowEffect = '0 0 35px rgba(255, 235, 59, 0.8)'
                    break
                }
                
                return (
                  <div 
                    key={item.id} 
                    className="shop-item-card" 
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderRadius: '25px',
                      padding: '25px',
                      boxShadow: 'var(--shadow)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      border: `3px solid ${borderColor}`,
                      boxShadow: `var(--shadow), ${glowEffect}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.2), ${glowEffect}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `var(--shadow), ${glowEffect}`;
                    }}
                  >
                    {/* 稀有度标签 */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      backgroundColor: borderColor,
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}>
                      {item.rarity === 'common' ? '普通' : 
                       item.rarity === 'uncommon' ? '优秀' : 
                       item.rarity === 'rare' ? '稀有' : 
                       item.rarity === 'epic' ? '史诗' : 
                       item.rarity === 'legendary' ? '传说' : '神话'}
                    </div>
                    
                    {/* 商品图标 */}
                    <div style={{ fontSize: '5rem', marginBottom: '20px', position: 'relative', zIndex: 1, animation: 'bounce 3s ease-in-out infinite' }}>{item.icon}</div>
                    
                    {/* 商品名称 */}
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '1.3rem', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>{item.name}</h3>
                    
                    {/* 商品描述 */}
                    <p style={{ color: 'var(--text-color)', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.4', position: 'relative', zIndex: 1 }}>{item.description}</p>
                    
                    {/* 商品价格 */}
                    <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FF9800' }}>🌰 {item.price}</span>
                    </div>
                    
                    {/* 商品库存 */}
                    <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-color)', position: 'relative', zIndex: 1 }}>
                      库存: {item.stock}
                    </div>
                    
                    {/* 购买按钮 */}
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={item.stock <= 0}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: item.stock > 0 ? 'var(--primary-color)' : '#CCCCCC',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: item.stock > 0 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (item.stock > 0) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (item.stock > 0) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {item.stock > 0 ? '立即购买' : '已售罄'}
                    </button>
                  </div>
                )
              })}
            </div>
            
            {/* 空状态 */}
            {shopItems.filter(item => selectedCategory === 'all' || item.category === selectedCategory).length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--card-bg)', borderRadius: '25px', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '8rem', marginBottom: '20px' }}>🛍️</div>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>暂无商品</h2>
                <p style={{ color: 'var(--text-color)', marginBottom: '30px' }}>该类别下暂无商品，敬请期待！</p>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="healing-btn"
                >
                  查看全部商品
                </button>
              </div>
            )}
          </div>
        )}

        {/* 排行榜内容 */}
        {activeTab === 'leaderboard' && (
          <div>
            {/* 排行榜类型切换 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '15px', 
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setSelectedLeaderboard('pinecones')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedLeaderboard === 'pinecones' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLeaderboard === 'pinecones' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🌰 松果数量</span>
              </button>
              <button
                onClick={() => setSelectedLeaderboard('streak')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedLeaderboard === 'streak' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLeaderboard === 'streak' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔥 连续签到</span>
              </button>
              <button
                onClick={() => setSelectedLeaderboard('words')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: selectedLeaderboard === 'words' ? 'var(--primary-color)' : 'transparent',
                  color: selectedLeaderboard === 'words' ? 'white' : 'var(--text-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>📚 单词数量</span>
              </button>
            </div>

            {/* 排行榜标题 */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              padding: '20px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow)',
              border: '2px solid var(--primary-color)'
            }}>
              <h3 style={{ 
                color: 'var(--primary-color)', 
                marginBottom: '10px', 
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <span>🏆 {selectedLeaderboard === 'pinecones' ? '松果数量排行榜' : selectedLeaderboard === 'streak' ? '连续签到排行榜' : '单词数量排行榜'}</span>
              </h3>
              <p style={{ color: 'var(--text-color)', fontSize: '1rem' }}>
                {selectedLeaderboard === 'pinecones' ? '谁是松果收集大师？' : 
                 selectedLeaderboard === 'streak' ? '谁是坚持学习的小能手？' : 
                 '谁的词汇量最丰富？'}
              </p>
            </div>

            {/* 排行榜列表 */}
            <div style={{ 
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: 'var(--shadow)',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {leaderboards[selectedLeaderboard].map((item, index) => (
                  <div 
                    key={item.rank} 
                    className="leaderboard-item" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px',
                      borderRadius: '15px',
                      backgroundColor: index < 3 ? 
                        index === 0 ? 'rgba(255, 215, 0, 0.2)' : 
                        index === 1 ? 'rgba(192, 192, 192, 0.2)' : 
                        'rgba(205, 127, 50, 0.2)' : 
                        'rgba(255, 255, 255, 0.1)',
                      border: index < 3 ? 
                        index === 0 ? '2px solid #FFD700' : 
                        index === 1 ? '2px solid #C0C0C0' : 
                        '2px solid #CD7F32' : 
                        '2px solid var(--light-color)',
                      transition: 'all 0.3s ease',
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* 排名 */}
                    <div style={{ 
                      width: '40px', 
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: index < 3 ? 
                        index === 0 ? '#FFD700' : 
                        index === 1 ? '#C0C0C0' : 
                        '#CD7F32' : 
                        'var(--text-color)'
                    }}>
                      {item.rank}
                    </div>
                    
                    {/* 头像 */}
                    <div style={{ marginRight: '15px', fontSize: '2.5rem' }}>{item.avatar}</div>
                    
                    {/* 名称和徽章 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '5px'
                      }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-color)' }}>{item.name}</span>
                        <span style={{ fontSize: '1rem' }}>{item.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                        {selectedLeaderboard === 'pinecones' ? `松果数量: ${item.score}` : 
                         selectedLeaderboard === 'streak' ? `连续签到: ${item.score}天` : 
                         `单词数量: ${item.score}个`}
                      </div>
                    </div>
                    
                    {/* 分数 */}
                    <div style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: 'bold',
                      color: index < 3 ? 
                        index === 0 ? '#FFD700' : 
                        index === 1 ? '#C0C0C0' : 
                        '#CD7F32' : 
                        'var(--primary-color)'
                    }}>
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 我的排名 */}
            <div style={{ 
              marginTop: '20px',
              textAlign: 'center',
              padding: '20px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow)',
              border: '2px solid var(--light-color)'
            }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px', fontSize: '1.2rem' }}>我的排名</h4>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥧</div>
              <p style={{ color: 'var(--text-color)', fontSize: '1rem', marginBottom: '15px' }}>
                {localStorage.getItem('username') || '游客'}
              </p>
              <p style={{ color: 'var(--text-color)', fontSize: '1rem' }}>
                {selectedLeaderboard === 'pinecones' ? `松果数量: ${userBalance.pinecones}` : 
                 selectedLeaderboard === 'streak' ? `连续签到: ${parseInt(localStorage.getItem('streakDays') || '0')}天` : 
                 `单词数量: ${parseInt(localStorage.getItem('totalWords') || '0')}个`}
              </p>
              <button 
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: '2px solid var(--primary-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-color)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
                onClick={() => navigate('/checkin')}
              >
                去提升排名
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Square