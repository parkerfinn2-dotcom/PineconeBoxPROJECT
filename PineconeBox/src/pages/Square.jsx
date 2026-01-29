import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Square = () => {
  const navigate = useNavigate()
  
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
        {/* 广场标题 */}
        <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '30px' }}>松果市集</h2>

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
    </div>
  )
}

export default Square