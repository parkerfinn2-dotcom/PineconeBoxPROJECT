import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Home = () => {
  const [showBlindBox, setShowBlindBox] = useState(false)
  const [blindBoxRewards, setBlindBoxRewards] = useState([
    { name: '松果币', icon: '🌰', value: 10, rarity: 'common' },
    { name: '松果币', icon: '🌰', value: 20, rarity: 'common' },
    { name: '松果币', icon: '🌰', value: 50, rarity: 'rare' },
    { name: '魔法水壶', icon: '🪄', value: 1, rarity: 'rare' },
    { name: '金色松果', icon: '🏆', value: 1, rarity: 'epic' },
    { name: '新皮肤', icon: '🎨', value: 1, rarity: 'epic' }
  ])
  const [selectedReward, setSelectedReward] = useState(null)
  const [isOpening, setIsOpening] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showWechatModal, setShowWechatModal] = useState(false)
  const [wechat, setWechat] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // 检查是否今天已经开过小盲盒
  useEffect(() => {
    const today = new Date().toDateString()
    const lastOpened = localStorage.getItem('lastBlindBoxOpened')
    if (lastOpened !== today) {
      setShowBlindBox(true)
    }
  }, [])

  // 计算倒计时
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow - now
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft({ hours, minutes, seconds })
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // 绑定微信
  const handleWechatSubmit = (e) => {
    e.preventDefault()
    if (wechat) {
      localStorage.setItem('userWechat', wechat)
      localStorage.setItem('wechatBound', 'true')
      alert('微信绑定成功！学习数据会同步发送给监护人或用户本人哦～')
      setShowWechatModal(false)
      setWechat('')
    }
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

  // 发送打卡信息到微信的功能已移至CheckIn.jsx，在用户完成打卡后发送

  // 登录表单提交处理
  const handleLoginSubmit = async () => {
    if (!loginUsername || !loginPassword) {
      setLoginError('请输入用户名和密码');
      setTimeout(() => setLoginError(''), 3000);
      return;
    }

    setIsLoginLoading(true);
    setLoginError('');

    try {
      // 导入authApi
      const { authApi } = await import('../services/api');
      const response = await authApi.login(loginUsername, loginPassword);

      // 登录成功，保存token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', response.username);
      localStorage.setItem('user_id', response.user_id);
      localStorage.setItem('pinecone_count', response.pinecone_count);
      if (response.email) {
        localStorage.setItem('email', response.email);
        localStorage.setItem('email_verified', response.email_verified);
      }

      // 关闭登录弹窗
      setShowLoginModal(false);
      // 重置表单
      setLoginUsername('');
      setLoginPassword('');
      // 刷新页面或跳转到主页
      window.location.reload();
    } catch (error) {
      console.error('登录失败:', error);
      setLoginError(error.message || '登录失败，请检查用户名和密码');
      setTimeout(() => setLoginError(''), 3000);
    } finally {
      setIsLoginLoading(false);
    }
  }

  // 打开盲盒
  const openBlindBox = () => {
    setIsOpening(true)
    // 模拟打开动画
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * blindBoxRewards.length)
      const reward = blindBoxRewards[randomIndex]
      setSelectedReward(reward)
      // 保存奖励到localStorage
      const userRewards = JSON.parse(localStorage.getItem('userRewards') || '{}')
      userRewards[reward.name] = (userRewards[reward.name] || 0) + reward.value
      localStorage.setItem('userRewards', JSON.stringify(userRewards))
      // 记录今天已经开过小盲盒
      localStorage.setItem('lastBlindBoxOpened', new Date().toDateString())
      setIsOpening(false)
    }, 2000)
  }

  // 关闭盲盒
  const closeBlindBox = () => {
    setShowBlindBox(false)
    setSelectedReward(null)
  }
  return (
    <div className="home-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--background-color), var(--light-color))',
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* 倒计时计时器 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        padding: '10px 20px',
        boxShadow: 'var(--shadow)',
        zIndex: '999'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '14px' }}>
            ⏰ 今日任务剩余时间
          </div>
          <div style={{ color: 'var(--text-color)', fontSize: '14px' }}>
            {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <button
            onClick={() => setShowWechatModal(true)}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            💬 绑定微信
          </button>
        </div>
      </div>

      {/* Logo和标题 */}
      <div className="logo" style={{ fontSize: '8rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>🌲</div>
      <h1 style={{ color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '10px' }}>松果盒子 PineconeBox</h1>
      <h2 style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginBottom: '30px' }}>集果时刻 盒你一起</h2>
      <p style={{ fontSize: '1.2rem', margin: '20px 0', color: 'var(--text-color)', maxWidth: '600px' }}>
        松果盒子
      </p>

      {/* 主要功能入口 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/checkin" style={{ textDecoration: 'none' }}>
          <div 
            className="feature-card" 
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            {/* 松果+铅笔图标，结合单词打卡功能 */}
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', fontSize: '2rem', color: 'var(--primary-color)' }}>🥧</span>
              <span style={{ position: 'absolute', fontSize: '1.5rem', transform: 'rotate(45deg)', color: 'var(--accent-color)' }}>✏️</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>松果打卡</div>
            <div style={{ color: 'var(--text-color)', textAlign: 'center' }}>来捡今天的松果吧～</div>
          </div>
        </Link>

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div 
            className="feature-card" 
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            {/* 松果+个人图标，结合个人主页功能 */}
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', fontSize: '2rem', color: 'var(--primary-color)' }}>🥧</span>
              <span style={{ position: 'absolute', fontSize: '1.5rem', color: 'var(--secondary-color)' }}>👤</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>松果盒子</div>
            <div style={{ color: 'var(--text-color)', textAlign: 'center' }}>松果库存</div>
          </div>
        </Link>

        <Link to="/square" style={{ textDecoration: 'none' }}>
          <div 
            className="feature-card" 
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease',
              minWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            {/* 松果+人群图标，结合学习广场功能 */}
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', fontSize: '2rem', color: 'var(--primary-color)' }}>🥧</span>
              <span style={{ position: 'absolute', fontSize: '1.5rem', color: 'var(--accent-color)' }}>👥</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>松果市集</div>
            <div style={{ color: 'var(--text-color)', textAlign: 'center' }}>松果日报今日新事</div>
          </div>
        </Link>
      </div>

      {/* 登录/注册入口 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className="healing-btn"
          onClick={() => setShowLoginModal(true)}
        >
          登录
        </button>
        <button 
          className="healing-btn"
          onClick={() => setShowRegisterModal(true)}
        >
          注册
        </button>
      </div>

      {/* 登录弹窗 */}
      {showLoginModal && (
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
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            {/* 关闭按钮 */}
            <button 
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text-color)'
              }}
            >
              ×
            </button>
            
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>松果盒子 PineconeBox</h2>
            <h3 style={{ color: 'var(--secondary-color)', marginBottom: '30px', fontSize: '1.5rem' }}>欢迎回来</h3>
            
            {/* 错误信息 */}
            {loginError && (
              <div style={{
                color: 'var(--accent-color)',
                marginBottom: '20px',
                fontWeight: 'bold',
                backgroundColor: 'var(--light-color)',
                padding: '10px',
                borderRadius: '15px',
                border: '2px solid var(--accent-color)'
              }}>
                {loginError}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>用户名</label>
                <input 
                  type="text" 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '15px',
                    border: '2px solid var(--primary-color)',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    transition: 'all 0.3s ease'
                  }}
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={isLoginLoading}
                />
              </div>
              
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>密码</label>
                <input 
                  type="password" 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '15px',
                    border: '2px solid var(--primary-color)',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    transition: 'all 0.3s ease'
                  }}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoginLoading}
                />
              </div>
              
              <button 
                type="button" 
                className="healing-btn"
                style={{ marginTop: '10px' }}
                onClick={handleLoginSubmit}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '10px'
                    }}></div>
                    登录中...
                  </div>
                ) : '登录'}
              </button>
              
              {/* 测试用户登录 - 仅在开发环境显示 */}
              {import.meta.env.DEV && (
                <>
                  <button 
                    onClick={() => {
                      setLoginUsername('testuser');
                      setLoginPassword('password123');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      color: 'var(--primary-color)',
                      border: '2px solid var(--primary-color)',
                      borderRadius: '15px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    disabled={isLoginLoading}
                  >
                    🧪 测试用户登录
                  </button>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)', textAlign: 'center' }}>
                    自动填充测试账号：testuser / password123
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div style={{ marginTop: '50px', fontSize: '14px', color: '#8d6e63' }}>
        © 2026 松果盒子 PineconeBox | 集果时刻 盒你一起
      </div>

      {/* 每日盲盒弹窗 */}
      {showBlindBox && (
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
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>🌰 今日松果盲盒</h2>
            {!selectedReward ? (
              <>
                <p style={{ marginBottom: '30px', color: 'var(--text-color)' }}>点击打开，看看今天的好运是什么！</p>
                <div style={{ fontSize: '8rem', marginBottom: '30px' }}>
                  🥧
                </div>
                <button 
                  onClick={openBlindBox}
                  disabled={isOpening}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isOpening ? 'not-allowed' : 'pointer',
                    opacity: isOpening ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isOpening ? '正在打开...' : '打开盲盒'}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '8rem', marginBottom: '20px' }}>
                  {selectedReward.icon}
                </div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>恭喜你获得！</h3>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-color)' }}>
                  {selectedReward.icon} {selectedReward.name} x{selectedReward.value}
                </p>
                <button 
                  onClick={closeBlindBox}
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
                  关闭
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 微信绑定弹窗 */}
      {showWechatModal && (
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
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>💬 绑定微信</h2>
            <p style={{ marginBottom: '30px', color: 'var(--text-color)' }}>绑定微信后，学习数据会同步发送给监护人或用户本人，方便查看学习进度和成果！</p>
            
            {/* 二维码扫描区域 */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                border: '2px solid var(--primary-color)',
                overflow: 'hidden'
              }}>
                {/* 使用二维码生成API生成模拟的微信绑定二维码 */}
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://github.com" 
                  alt="微信绑定二维码" 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p style={{ color: 'var(--text-color)', marginBottom: '10px' }}>请使用微信扫描二维码</p>
              <p style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>扫描后将自动绑定微信，每日学习数据会同步发送</p>
            </div>
            
            {/* 模拟二维码绑定按钮 */}
            <div style={{ marginBottom: '30px' }}>
              <button 
                onClick={() => {
                  // 模拟二维码扫描成功
                  localStorage.setItem('userWechat', 'wechat_user_' + Math.random().toString(36).substr(2, 9));
                  localStorage.setItem('wechatBound', 'true');
                  alert('微信绑定成功！学习数据会在每日打卡后同步发送给你哦～');
                  setShowWechatModal(false);
                }}
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
                绑定微信
              </button>
            </div>
            
            <button 
              onClick={() => setShowWechatModal(false)}
              style={{
                backgroundColor: 'var(--light-color)',
                color: 'var(--text-color)',
                border: '2px solid var(--primary-color)',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home