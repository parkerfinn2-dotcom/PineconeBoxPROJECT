import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../services/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 实现淡入效果和登录状态检查
  useEffect(() => {
    setIsVisible(true)
    // 如果已经登录且有token，直接跳转到主页
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const token = localStorage.getItem('token')
    if (isLoggedIn && token) {
      window.location.href = '/home'
    }
  }, [])

  // 重置登录失败状态
  const resetLoginState = () => {
    setLoginFailed(false)
    setErrorMessage('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    resetLoginState()
    
    console.log('开始登录，用户名:', username)
    
    try {
      // 使用API服务登录
      console.log('发送登录请求到后端...')
      const response = await authApi.login(username, password)
      console.log('登录成功，响应:', response)
      
      // 登录成功，保存token和用户信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', response.username)
      localStorage.setItem('user_id', response.user_id)
      localStorage.setItem('pinecone_count', response.pinecone_count)
      console.log('保存用户信息到localStorage')
      
      // 跳转到主页
      console.log('跳转到主页...')
      window.location.href = '/home'
    } catch (error) {
      // 登录失败，显示具体的错误信息
      console.error('登录失败:', error)
      console.error('错误详情:', error.message, error.stack)
      setErrorMessage(error.message || '登录失败，请检查用户名和密码')
      setLoginFailed(true)
      
      // 3秒后重置状态
      setTimeout(() => {
        resetLoginState()
      }, 3000)
    }
  }

  return (
    <div 
      className="login-container" 
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
      <div 
        className="login-card" 
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
        {/* 动态logo效果 - 松果元素 */}
        <div 
          className="logo" 
          style={{
            fontSize: '4rem',
            marginBottom: '20px',
            transition: 'transform 1s ease-in-out',
            transform: loginFailed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transformOrigin: 'bottom center',
            display: 'inline-block',
            position: 'relative'
          }}
        >
          🌲
          {/* 松果装饰 */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem',
            zIndex: -1
          }}>
            🥧
          </div>
        </div>
        
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>松果盒子 PineconeBox</h1>
        <h2 style={{ color: 'var(--secondary-color)', marginBottom: '30px', fontSize: '1.5rem' }}>欢迎回来</h2>
        
        {/* 错误信息 - 使用治愈系配色 */}
        {errorMessage && (
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
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()}30`
                resetLoginState()
              }} 
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
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 3px ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()}30`
                resetLoginState()
              }} 
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <button 
            type="submit" 
            className="healing-btn"
            style={{ marginTop: '10px' }}
          >
            登录
          </button>
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-color)' }}>
          还没有账号？ <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>注册</Link>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#8d6e63' }}>
        © 2026 松果盒子 PineconeBox | 快乐单词打卡
      </div>
      
      {/* 动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Login