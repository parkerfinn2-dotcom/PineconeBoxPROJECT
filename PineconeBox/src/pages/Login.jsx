import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loginMethod, setLoginMethod] = useState('username') // username 或 email
  const [isVisible, setIsVisible] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // 实现淡入效果和登录状态检查
  useEffect(() => {
    setIsVisible(true)
    // 如果已经登录且有token，直接跳转到主页
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const token = localStorage.getItem('token')
    if (isLoggedIn && token) {
      navigate('/home')
    }
  }, [navigate])

  // 重置登录失败状态
  const resetLoginState = () => {
    setLoginFailed(false)
    setErrorMessage('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    resetLoginState()
    
    // 表单验证
    if (loginMethod === 'username' && !username) {
      setErrorMessage('请输入用户名')
      setLoginFailed(true)
      setTimeout(resetLoginState, 3000)
      return
    }
    
    if (loginMethod === 'email' && !email) {
      setErrorMessage('请输入邮箱')
      setLoginFailed(true)
      setTimeout(resetLoginState, 3000)
      return
    }
    
    if (!password) {
      setErrorMessage('请输入密码')
      setLoginFailed(true)
      setTimeout(resetLoginState, 3000)
      return
    }
    
    // 邮箱格式验证
    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('请输入有效的邮箱地址')
        setLoginFailed(true)
        setTimeout(resetLoginState, 3000)
        return
      }
    }
    
    setIsLoading(true)
    
    try {
      let response
      
      if (loginMethod === 'username') {
        console.log('开始用户名登录，用户名:', username)
        // 使用API服务进行用户名登录
        console.log('发送用户名登录请求到后端...')
        response = await authApi.login(username, password)
      } else {
        console.log('开始邮箱登录，邮箱:', email)
        // 使用API服务进行邮箱登录
        console.log('发送邮箱登录请求到后端...')
        response = await authApi.loginWithEmail(email, password)
      }
      
      console.log('登录成功，响应:', response)
      
      // 登录成功，保存token和用户信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', response.username)
      localStorage.setItem('user_id', response.user_id)
      localStorage.setItem('pinecone_count', response.pinecone_count)
      if (response.email) {
        localStorage.setItem('email', response.email)
        localStorage.setItem('email_verified', response.email_verified)
        localStorage.setItem('userEmail', response.email)
        localStorage.setItem('userEmailVerified', response.email_verified)
      }
      console.log('保存用户信息到localStorage')
      
      // 跳转到主页
      console.log('跳转到主页...')
      navigate('/home')
    } catch (error) {
      // 登录失败，显示具体的错误信息
      console.error('登录失败:', error)
      console.error('错误详情:', error.message, error.stack)
      setErrorMessage(error.message || (loginMethod === 'username' ? '登录失败，请检查用户名和密码' : '登录失败，请检查邮箱和密码'))
      setLoginFailed(true)
      
      // 3秒后重置状态
      setTimeout(() => {
        resetLoginState()
      }, 3000)
    } finally {
      setIsLoading(false)
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>
              {loginMethod === 'username' ? '用户名' : '邮箱'}
            </label>
            <input 
              type={loginMethod === 'email' ? 'email' : 'text'} 
              value={loginMethod === 'username' ? username : email} 
              onChange={(e) => loginMethod === 'username' ? setUsername(e.target.value) : setEmail(e.target.value)} 
              placeholder={loginMethod === 'username' ? '请输入用户名' : '请输入邮箱'} 
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
                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.3)'
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
                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.3)'
                resetLoginState()
              }} 
              onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
          </div>
          
          <button 
            type="submit" 
            className="healing-btn"
            style={{ marginTop: '10px' }}
            disabled={isLoading}
          >
            {isLoading ? (
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
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-color)' }}>
          还没有账号？ <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>注册</Link>
        </div>
        
        {/* 测试用户登录按钮 */}
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => {
              setUsername('testuser');
              setPassword('password123');
              // 模拟登录成功
              localStorage.setItem('token', 'test_token_123');
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('username', 'testuser');
              localStorage.setItem('user_id', '1');
              localStorage.setItem('pinecone_count', '0');
              navigate('/home');
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
          >
            🧪 测试用户登录
          </button>
          <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)', textAlign: 'center' }}>
            自动填充测试账号：testuser / password123
          </div>
        </div>
        
        {/* 登录方式切换 */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <button 
              onClick={() => setLoginMethod('username')}
              style={{
                padding: '8px 16px',
                backgroundColor: loginMethod === 'username' ? 'var(--primary-color)' : 'rgba(76, 175, 80, 0.1)',
                color: loginMethod === 'username' ? 'white' : 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '15px 0 0 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              用户名登录
            </button>
            <button 
              onClick={() => setLoginMethod('email')}
              style={{
                padding: '8px 16px',
                backgroundColor: loginMethod === 'email' ? 'var(--primary-color)' : 'rgba(76, 175, 80, 0.1)',
                color: loginMethod === 'email' ? 'white' : 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '0 15px 15px 0',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              邮箱登录
            </button>
          </div>
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Login