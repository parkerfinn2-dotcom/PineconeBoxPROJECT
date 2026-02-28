import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserInfo from '../components/profile/UserInfo'
import GrowthTree from '../components/profile/GrowthTree'
import WateringSystem from '../components/profile/WateringSystem'

/**
 * 个人资料页面组件
 * 显示用户信息、松果库存、成长树等内容
 * 包含邮箱验证状态显示和重新发送验证邮件功能
 */
const Profile = () => {
  /**
   * 用户数据状态
   * 包含用户名、登录状态、邮箱信息、学习统计等
   */
  const [userData, setUserData] = useState({
    username: localStorage.getItem('username') || '游客',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    email: localStorage.getItem('userEmail') || '',
    email_verified: localStorage.getItem('userEmailVerified') === 'true',
    totalWords: 0,
    completedLevels: [1],
    streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
    achievements: [
      { id: 1, name: '初学者', description: '完成难度1的单词打卡', icon: '🥧' },
      { id: 2, name: '连续7天', description: '连续打卡7天', icon: '🔥' },
      { id: 3, name: '单词达人', description: '学习10个以上单词', icon: '📚' }
    ]
  })
  
  /**
   * 松果数量和成长树相关状态
   */
  const [treeGrowth, setTreeGrowth] = useState('seed')
  const [hasWateredToday, setHasWateredToday] = useState(localStorage.getItem('lastWateredDate') === new Date().toDateString())
  const [waterCount, setWaterCount] = useState(parseInt(localStorage.getItem('waterCount') || '0'))
  
  /**
   * 松果银行相关状态
   */
  const [bankInfo, setBankInfo] = useState({ pinecone_coins: 0, total_trees: 0 })
  const [harvesting, setHarvesting] = useState(false)
  
  /**
   * 其他引用和导航
   */
  const navigate = useNavigate()
  const containerRef = useRef(null)
  
  // 森林动物像素风格图标列表
  const pixelAnimals = ['🐿️', '🦉', '🦔', '🐇', '🐦', '🐸', '🐹', '🐰', '🦊', '🐻']
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0)

  // 检查签到状态和获取松果数量
  useEffect(() => {
    const today = new Date().toDateString()
    
    // 初始化浇水次数（如果不存在）
    if (localStorage.getItem('waterCount') === null) {
      localStorage.setItem('waterCount', '0')
    }
    
    // 初始化最后浇水日期（如果不存在）
    if (localStorage.getItem('lastWateredDate') === null) {
      localStorage.setItem('lastWateredDate', '1970-01-01')
    }
    
    // 初始化连续签到天数（如果不存在）
    if (localStorage.getItem('streakDays') === null) {
      localStorage.setItem('streakDays', '0')
    }
    
    // 更新今天是否浇水的状态
    const hasWatered = localStorage.getItem('lastWateredDate') === today
    setHasWateredToday(hasWatered)
    
    // 更新成长树状态
    const currentWaterCount = parseInt(localStorage.getItem('waterCount') || '0')
    setWaterCount(currentWaterCount)
    updateTreeGrowth(currentWaterCount)
    
    // 更新连续签到天数
    const currentStreakDays = parseInt(localStorage.getItem('streakDays') || '0')
    setUserData(prev => ({
      ...prev,
      streakDays: currentStreakDays
    }))
    
    // 只在totalPinecones不存在时初始化
    if (localStorage.getItem('totalPinecones') === null) {
      localStorage.setItem('totalPinecones', '0')
    }
  }, [])

  // 更新成长树状态
  const updateTreeGrowth = useCallback((count = waterCount) => {
    if (count >= 20) {
      setTreeGrowth('fruiting')
    } else if (count >= 15) {
      setTreeGrowth('tree')
    } else if (count >= 10) {
      setTreeGrowth('sapling')
    } else if (count >= 5) {
      setTreeGrowth('sprout')
    } else {
      setTreeGrowth('seed')
    }
  }, [waterCount])

  // 收获树并兑换松果币
  const harvestTree = useCallback(async () => {
    if (waterCount < 20) {
      alert('浇水次数不足20次，无法兑换松果币！')
      return
    }
    
    setHarvesting(true)
    
    try {
      // 计算可以兑换的树的数量和松果币
      const treeCount = Math.floor(waterCount / 20)
      const pineconeCoins = treeCount * 10
      
      // 调用后端API
      if (userData.isLoggedIn) {
        const { bankApi } = await import('../services/api')
        const response = await bankApi.harvestTree(waterCount)
        console.log('后端API响应:', response)
      }
      
      // 更新本地状态
      setBankInfo(prev => ({
        ...prev,
        pinecone_coins: prev.pinecone_coins + pineconeCoins,
        total_trees: prev.total_trees + treeCount
      }))
      
      // 重置浇水次数
      setWaterCount(0)
      localStorage.setItem('waterCount', '0')
      updateTreeGrowth(0)
      
      // 显示成功消息
      alert(`兑换成功！成功兑换 ${treeCount} 棵树，获得 ${pineconeCoins} 松果币！`)
    } catch (error) {
      console.error('收获树并兑换松果币失败:', error)
      // 显示详细的错误信息
      alert('兑换失败，请稍后重试！')
    } finally {
      setHarvesting(false)
    }
  }, [waterCount, updateTreeGrowth, userData.isLoggedIn])

  // 登出功能
  const handleLogout = useCallback(() => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userEmailVerified')
    // 刷新页面或跳转到登录页
    navigate('/login')
  }, [navigate])

  return (
    <div className="profile-container" ref={containerRef} style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--background-color), var(--light-color))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 1s ease-in-out'
    }}>
      {/* 导航栏 */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: 'var(--light-color)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow)',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        animation: 'breathing 3s ease-in-out infinite'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: 'var(--text-color)', transition: 'all 0.3s ease' }}>
            <span style={{ fontSize: '1.5rem' }}>🏠</span>
          </Link>
          <h1 style={{ 
            color: 'var(--primary-color)', 
            fontSize: '1.5rem', 
            margin: 0,
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{ 
              position: 'relative', 
              display: 'inline-block',
              padding: '0 10px',
              borderRadius: '10px',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A)',
              backgroundSize: '400% 400%',
              animation: 'rainbowRotate 3s ease infinite',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              松果盒子
            </span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/checkin" className="nav-link" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-color)', 
            fontWeight: 'bold', 
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '15px',
            backgroundColor: 'var(--card-bg)',
            boxShadow: 'var(--shadow)',
            '&:hover': {
              transform: 'translateY(-2px)',
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }
          }}>
            🥧 松果打卡
          </Link>
          <Link to="/square" className="nav-link" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-color)', 
            fontWeight: 'bold', 
            transition: 'all 0.3s ease',
            padding: '8px 16px',
            borderRadius: '15px',
            backgroundColor: 'var(--card-bg)',
            boxShadow: 'var(--shadow)',
            '&:hover': {
              transform: 'translateY(-2px)',
              backgroundColor: 'var(--primary-color)',
              color: 'white'
            }
          }}>
            🏪 松果市集
          </Link>
          {/* 根据登录状态显示登出或登录按钮 */}
          {userData.isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '15px',
                fontSize: '14px',
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
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '14px',
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
        <UserInfo 
          userData={userData} 
          setUserData={setUserData} 
          pixelAnimals={pixelAnimals} 
          currentAvatarIndex={currentAvatarIndex} 
          setCurrentAvatarIndex={setCurrentAvatarIndex} 
        />

        {/* 松果成长树 */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '30px', 
          backgroundColor: 'var(--light-color)', 
          borderRadius: '20px', 
          boxShadow: 'var(--shadow)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 彩虹边框效果 */}
          <div style={{ 
            position: 'absolute', 
            top: '-2px', 
            left: '-2px', 
            right: '-2px', 
            bottom: '-2px', 
            borderRadius: '20px', 
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #FF6B6B)', 
            backgroundSize: '400% 400%', 
            animation: 'rainbowRotate 3s ease infinite', 
            zIndex: 0 
          }} />
          <div style={{ 
            position: 'relative', 
            zIndex: 1, 
            padding: '20px',
            backgroundColor: 'var(--light-color)',
            borderRadius: '18px'
          }}>
            <h3 style={{ 
              color: 'var(--secondary-color)', 
              marginBottom: '20px', 
              textAlign: 'center', 
              fontSize: '1.5rem',
              animation: 'breathing 3s ease-in-out infinite'
            }}>🌱 松果成长树</h3>
            
            {/* 成长树主体 */}
            <GrowthTree treeGrowth={treeGrowth} waterCount={waterCount} />
            
            {/* 浇水系统 */}
            <WateringSystem 
              waterCount={waterCount} 
              setWaterCount={setWaterCount} 
              hasWateredToday={hasWateredToday} 
              setHasWateredToday={setHasWateredToday} 
              updateTreeGrowth={updateTreeGrowth} 
            />
            
            {/* 收获树并兑换松果币按钮 */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={harvestTree}
                disabled={waterCount < 20 || harvesting}
                style={{
                  backgroundColor: waterCount < 20 ? '#ccc' : '#FF9800',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  cursor: waterCount < 20 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow)',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => !harvesting && waterCount >= 20 && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !harvesting && waterCount >= 20 && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {harvesting ? '🌱 兑换中...' : '🌲 收获并兑换松果币'}
              </button>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)' }}>
                每20次浇水可兑换10个松果币！
              </p>
            </div>
          </div>
        </div>
        
        {/* 学习统计 */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '20px', 
          padding: '30px', 
          boxShadow: 'var(--shadow)', 
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 彩虹边框效果 */}
          <div style={{ 
            position: 'absolute', 
            top: '-2px', 
            left: '-2px', 
            right: '-2px', 
            bottom: '-2px', 
            borderRadius: '20px', 
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #FF6B6B)', 
            backgroundSize: '400% 400%', 
            animation: 'rainbowRotate 3s ease infinite', 
            zIndex: 0 
          }} />
          <div style={{ 
            position: 'relative', 
            zIndex: 1,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: 'var(--secondary-color)', 
              marginBottom: '20px', 
              fontSize: '1.5rem',
              animation: 'breathing 3s ease-in-out infinite'
            }}>📊 学习统计</h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              flexWrap: 'wrap', 
              gap: '20px', 
              marginTop: '20px'
            }}>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '15px', 
                minWidth: '130px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
                animation: 'breathing 4s ease-in-out infinite'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {parseInt(localStorage.getItem('totalWords') || '0')}
                </div>
                <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>累计单词</div>
              </div>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '15px', 
                minWidth: '130px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
                animation: 'breathing 4s ease-in-out infinite 0.5s'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔥</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {parseInt(localStorage.getItem('streakDays') || '0')}
                </div>
                <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>连续天数</div>
              </div>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '15px', 
                minWidth: '130px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
                animation: 'breathing 4s ease-in-out infinite 1s'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🥧</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {parseInt(localStorage.getItem('totalPinecones') || '0')}
                </div>
                <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>松果数量</div>
              </div>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '15px', 
                minWidth: '130px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
                animation: 'breathing 4s ease-in-out infinite 1.5s'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {bankInfo.pinecone_coins}
                </div>
                <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>松果币</div>
              </div>
              <div style={{ 
                backgroundColor: 'var(--light-color)', 
                padding: '20px', 
                borderRadius: '15px', 
                minWidth: '130px', 
                textAlign: 'center', 
                boxShadow: 'var(--shadow)',
                transition: 'all 0.3s ease',
                animation: 'breathing 4s ease-in-out infinite 2s'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌲</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {bankInfo.total_trees}
                </div>
                <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>成长树</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 成就展示 */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderRadius: '20px', 
          padding: '30px', 
          boxShadow: 'var(--shadow)', 
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 彩虹边框效果 */}
          <div style={{ 
            position: 'absolute', 
            top: '-2px', 
            left: '-2px', 
            right: '-2px', 
            bottom: '-2px', 
            borderRadius: '20px', 
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #FF6B6B)', 
            backgroundSize: '400% 400%', 
            animation: 'rainbowRotate 3s ease infinite', 
            zIndex: 0 
          }} />
          <div style={{ 
            position: 'relative', 
            zIndex: 1
          }}>
            <h3 style={{ 
              color: 'var(--secondary-color)', 
              marginBottom: '20px', 
              textAlign: 'center', 
              fontSize: '1.5rem',
              animation: 'breathing 3s ease-in-out infinite'
            }}>🏆 松果成就</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '20px'
            }}>
              {userData.achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  style={{
                    backgroundColor: 'var(--light-color)',
                    padding: '20px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow)',
                    animation: 'breathing 4s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{achievement.icon}</div>
                  <h4 style={{ 
                    color: 'var(--primary-color)', 
                    marginBottom: '8px', 
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}>{achievement.name}</h4>
                  <p style={{ color: 'var(--text-color)', fontSize: '12px' }}>{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes breathing {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes rainbowRotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}

export default Profile
