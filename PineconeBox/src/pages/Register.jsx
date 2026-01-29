import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 实现淡入效果和登录状态检查
  useEffect(() => {
    setIsVisible(true)
    // 如果已经登录且有token，直接跳转到主页
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const token = localStorage.getItem('token')
    if (isLoggedIn && token) {
      window.location.href = '/'
    }
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // 表单验证
    if (!username || !password || !confirmPassword) {
      setError('请填写所有字段')
      return
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    try {
      console.log('开始注册:', { username, password })
      // 使用API服务注册
      const response = await authApi.register(username, password)
      console.log('注册成功:', response)
      
      setError('')
      setIsRegistered(true)
      
      // 注册成功后，3秒后跳转到登录页面
      setTimeout(() => {
        // 使用window.location.href确保跳转生效
        window.location.href = '/login'
      }, 3000)
    } catch (error) {
      console.error('注册失败:', error)
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      setError('网络连接暂时不稳定，请稍后再试')
    }
  }

  return (
    <div 
      className="register-container" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--background-color), var(--light-color))',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out'
      }}
    >
      {!isRegistered ? (
        <div 
          className="register-card" 
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: 'var(--shadow)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.8s ease-in-out',
            transitionDelay: '0.2s'
          }}
        >
          <div className="logo" style={{ fontSize: '4rem', marginBottom: '20px' }}>🌲</div>
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>松果盒子 PineconeBox</h1>
          <h2 style={{ color: 'var(--secondary-color)', marginBottom: '30px', fontSize: '1.5rem' }}>创建账号</h2>
          
          {error && (
            <div style={{ 
              color: 'var(--text-color)', 
              marginBottom: '20px', 
              fontWeight: 'bold',
              animation: 'fadeIn 0.5s ease-in-out',
              backgroundColor: 'var(--light-color)',
              padding: '10px',
              borderRadius: '15px',
              border: '2px solid var(--accent-color)'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>用户名</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="请输入用户名" 
                required
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
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(168, 230, 207, 0.3)'} 
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>密码</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="请输入密码" 
                required
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
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(168, 230, 207, 0.3)'} 
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>确认密码</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="请再次输入密码" 
                required
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
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(168, 230, 207, 0.3)'} 
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <button 
              type="submit" 
              className="healing-btn"
              style={{ marginTop: '10px' }}
            >
              注册
            </button>
          </form>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-color)' }}>
            已有账号？ <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>登录</Link>
          </div>
        </div>
      ) : (
        <div 
          className="success-container" 
          style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow)',
            maxWidth: '500px',
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out'
          }}
        >
          <div 
            className="pine-tree" 
            style={{
              fontSize: '6rem',
              marginBottom: '20px',
              animation: 'shake 0.5s infinite',
              animationDelay: '0.5s',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            🌲
            {/* 松果动画 */}
            <div 
              className="pinecone" 
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2rem',
                animation: 'fall 2s infinite',
                animationDelay: '1s'
              }}
            >
              🥧
            </div>
            <div 
              className="pinecone" 
              style={{
                position: 'absolute',
                top: '0',
                left: '30%',
                transform: 'translateX(-50%)',
                fontSize: '1.5rem',
                animation: 'fall 2s infinite',
                animationDelay: '1.2s'
              }}
            >
              🥧
            </div>
            <div 
              className="pinecone" 
              style={{
                position: 'absolute',
                top: '0',
                left: '70%',
                transform: 'translateX(-50%)',
                fontSize: '1.8rem',
                animation: 'fall 2s infinite',
                animationDelay: '0.8s'
              }}
            >
              🥧
            </div>
          </div>
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>注册成功！</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-color)' }}>
            欢迎加入松果盒子大家庭！
          </p>
          <p style={{ fontSize: '1rem', color: '#8d6e63' }}>
            3秒后自动跳转到登录页面...
          </p>
          <Link to="/login" style={{ display: 'inline-block', marginTop: '20px' }}>
            <button className="healing-btn">立即登录</button>
          </Link>
          
          {/* 动画样式 */}
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }
            
            @keyframes fall {
              0% {
                top: 0;
                opacity: 1;
                transform: translateX(-50%) rotate(0deg);
              }
              100% {
                top: 200px;
                opacity: 0;
                transform: translateX(-50%) rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#8d6e63' }}>
        © 2026 松果盒子 PineconeBox | 快乐单词打卡
      </div>
    </div>
  )
}

export default Register