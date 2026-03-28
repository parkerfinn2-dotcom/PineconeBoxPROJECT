import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// 使用React.lazy实现代码分割
const Home = lazy(() => import('./pages/Home'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Profile = lazy(() => import('./pages/Profile'))
const Square = lazy(() => import('./pages/Square'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const LevelTest = lazy(() => import('./pages/LevelTest'))
const TestWatering = lazy(() => import('./pages/TestWatering'))
const WechatCallback = lazy(() => import('./pages/WechatCallback'))
// import Test from './pages/Test'

// 加载中组件
const Loading = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--background-color), var(--light-color))'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '20px',
          animation: 'spin 2s linear infinite'
        }}>🌲</div>
        <h2 style={{
          color: 'var(--primary-color)',
          marginBottom: '10px'
        }}>加载中...</h2>
        <p style={{
          color: 'var(--text-color)'
        }}>正在为您准备松果盒子...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// 路由守卫组件
const ProtectedRoute = ({ children, requireRegistration = true }) => {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const isRegistered = localStorage.getItem('isRegistered') === 'true'
  const token = localStorage.getItem('token')
  
  // 检查登录状态和token
  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />
  }
  
  // 检查注册状态，但不保护注册页面本身
  if (requireRegistration && !isRegistered && location.pathname !== '/register') {
    return <Navigate to="/register" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/api/auth/wechat/callback" element={<WechatCallback />} />
          {/* 根路径重定向到登录页面 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* 受保护路由 */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/square" element={<ProtectedRoute><Square /></ProtectedRoute>} />
          <Route path="/level-test" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
          <Route path="/test-watering" element={<ProtectedRoute><TestWatering /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App