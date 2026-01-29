import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TestWatering = () => {
  const [waterCount, setWaterCount] = useState(parseInt(localStorage.getItem('waterCount') || '0'))
  const [lastWateredDate, setLastWateredDate] = useState(localStorage.getItem('lastWateredDate') || '从未浇水')
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }))

  // 格式化日期为中文格式（例如：1月29日）
  const formatDateToChinese = (dateString) => {
    if (!dateString) return '从未浇水'
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  // 模拟浇水操作
  const handleWatering = () => {
    const today = new Date().toDateString()
    const newWaterCount = waterCount + 1
    
    // 更新本地存储
    localStorage.setItem('waterCount', newWaterCount.toString())
    localStorage.setItem('lastWateredDate', today)
    
    // 更新状态
    setWaterCount(newWaterCount)
    setLastWateredDate(today)
    setCurrentDate(new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }))
    
    alert('浇水成功！当前浇水次数：' + newWaterCount)
  }

  // 模拟收获树操作
  const handleHarvest = () => {
    if (waterCount < 20) {
      alert('浇水次数不足20次，无法收获！')
      return
    }
    
    // 重置浇水次数
    localStorage.setItem('waterCount', '0')
    localStorage.setItem('lastWateredDate', new Date().toDateString())
    
    // 更新状态
    setWaterCount(0)
    setLastWateredDate(new Date().toDateString())
    
    alert('收获成功！浇水次数已重置为0')
  }

  // 每秒钟更新当前日期
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f5f5, #e8f5e8)',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#4CAF50', marginBottom: '30px' }}>🌱 浇水功能测试页面</h1>
      
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>当前状态</h2>
          <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            <strong>当前日期：</strong>{currentDate}
          </div>
          <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            <strong>浇水次数：</strong>{waterCount} / 20
          </div>
          <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            <strong>最后浇水日期：</strong>{formatDateToChinese(lastWateredDate)}
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            <strong>树的状态：</strong>
            {waterCount >= 20 ? '🌲 结果' :
             waterCount >= 15 ? '🌳 小树' :
             waterCount >= 10 ? '🌿 幼苗' :
             waterCount >= 5 ? '🌱 发芽' : '🌰 种子'}
          </div>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={handleWatering}
            disabled={waterCount >= 20}
            style={{
              backgroundColor: waterCount >= 20 ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: waterCount >= 20 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            💧 浇水
          </button>
          <p style={{ color: '#666', marginTop: '10px' }}>
            {waterCount >= 20 ? '能量已满！可以收获了' : `还需要 ${20 - waterCount} 次浇水`}
          </p>
        </div>
        
        <div>
          <button 
            onClick={handleHarvest}
            disabled={waterCount < 20}
            style={{
              backgroundColor: waterCount < 20 ? '#ccc' : '#FF9800',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: waterCount < 20 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🌲 收获
          </button>
          <p style={{ color: '#666', marginTop: '10px' }}>
            每20次浇水可收获1棵成长树
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            返回个人页面
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TestWatering