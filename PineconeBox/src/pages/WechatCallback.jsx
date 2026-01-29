import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/api'

const WechatCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleWechatCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')

      if (!code) {
        console.error('微信登录失败：缺少code参数')
        navigate('/login')
        return
      }

      try {
        console.log('处理微信登录回调，code:', code)
        
        // 调用后端API处理微信登录
        const response = await authApi.wechatLogin(code)
        console.log('微信登录成功，响应:', response)
        
        // 保存登录状态和用户信息
        localStorage.setItem('token', response.token)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('username', response.username)
        localStorage.setItem('user_id', response.user_id)
        localStorage.setItem('pinecone_count', response.pinecone_count)
        
        console.log('微信登录成功，跳转到主页')
        navigate('/home')
      } catch (error) {
        console.error('微信登录失败:', error)
        // 显示错误信息并跳转到登录页面
        localStorage.setItem('loginError', '微信登录失败，请重试')
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    }

    handleWechatCallback()
  }, [navigate, searchParams])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌲</div>
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>松果盒子 PineconeBox</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>正在处理微信登录...</p>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid var(--primary-color)', 
        borderTop: '4px solid transparent', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite'
      }}></div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default WechatCallback