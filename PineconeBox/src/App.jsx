import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CheckIn from './pages/CheckIn'
import Profile from './pages/Profile'
import Square from './pages/Square'
import Login from './pages/Login'
import Register from './pages/Register'
import LevelTest from './pages/LevelTest'
// import Test from './pages/Test'

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const token = localStorage.getItem('token')
  // 同时检查登录状态和token
  return (isLoggedIn && token) ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 根路径重定向到登录页面 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* 受保护路由 */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/square" element={<ProtectedRoute><Square /></ProtectedRoute>} />
        <Route path="/level-test" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App