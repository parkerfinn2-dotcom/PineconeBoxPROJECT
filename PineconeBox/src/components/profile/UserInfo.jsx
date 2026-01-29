import React, { useState, useCallback } from 'react';
import { authApi } from '../../services/api';

const UserInfo = ({ userData, setUserData, pixelAnimals, currentAvatarIndex, setCurrentAvatarIndex }) => {
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  // 切换头像函数
  const changeAvatar = useCallback(() => {
    setCurrentAvatarIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % pixelAnimals.length;
      // 保存到localStorage
      localStorage.setItem('userAvatar', pixelAnimals[newIndex]);
      return newIndex;
    });
  }, [pixelAnimals, setCurrentAvatarIndex]);

  // 重新发送验证邮件函数
  const resendVerificationEmail = useCallback(async () => {
    if (!userData.email) {
      setVerificationMessage('请先登录并绑定邮箱');
      setTimeout(() => setVerificationMessage(''), 3000);
      return;
    }

    setResendingVerification(true);
    setVerificationMessage('');

    try {
      const response = await authApi.resendVerification(userData.email);
      setVerificationMessage('验证邮件已发送，请查收！');
      setTimeout(() => setVerificationMessage(''), 5000);
    } catch (error) {
      setVerificationMessage(`发送失败：${error.message || '请稍后重试'}`);
      setTimeout(() => setVerificationMessage(''), 5000);
    } finally {
      setResendingVerification(false);
    }
  }, [userData.email]);

  return (
    <div>
      {/* 个人信息卡片 */}
      <div className="card" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '30px', boxShadow: 'var(--shadow)', marginBottom: '30px', textAlign: 'center' }}>
        {userData.isLoggedIn && (
          <div 
            style={{ 
              position: 'relative', 
              display: 'inline-block', 
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onClick={changeAvatar}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '6rem', marginBottom: '20px', position: 'relative' }}>
              {localStorage.getItem('userAvatar') || pixelAnimals[currentAvatarIndex]}
              {/* 显示头像挂件 */}
              {localStorage.getItem('currentAvatarBadge') && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  right: '-15px', 
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow)'
                }}>
                  <span style={{ fontSize: '1.5rem', color: 'white' }}>
                    {localStorage.getItem('currentAvatarBadge') === 'silver' ? '🥈' : localStorage.getItem('currentAvatarBadge') === 'gold' ? '🥇' : '💎'}
                  </span>
                </div>
              )}
            </div>
            <div style={{ 
              position: 'absolute', 
              bottom: '15px', 
              right: '15px', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '15px', 
              fontSize: '12px', 
              fontWeight: 'bold',
              boxShadow: 'var(--shadow)'
            }}>
              点击切换
            </div>
          </div>
        )}
        {!userData.isLoggedIn && <div style={{ fontSize: '6rem', marginBottom: '20px' }}>👤</div>}
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{userData.username}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', marginBottom: '20px' }}>
          {userData.isLoggedIn ? '欢迎回到松果盒子！' : '请先登录查看松果库存'}
        </p>

        {/* 邮箱验证状态显示 */}
        {userData.isLoggedIn && userData.email && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              backgroundColor: userData.email_verified ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
              border: `2px solid ${userData.email_verified ? '#4CAF50' : '#FFC107'}`,
              marginBottom: '10px'
            }}>
              <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>
                {userData.email_verified ? '✅' : '⚠️'}
              </span>
              <span style={{ fontWeight: 'bold', color: userData.email_verified ? '#4CAF50' : '#FFC107' }}>
                {userData.email_verified ? '邮箱已验证' : '邮箱未验证'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '10px' }}>
              {userData.email}
            </p>
            {!userData.email_verified && (
              <button 
                onClick={resendVerificationEmail}
                disabled={resendingVerification}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  cursor: resendingVerification ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  opacity: resendingVerification ? 0.7 : 1
                }}
                onMouseEnter={(e) => !resendingVerification && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => !resendingVerification && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {resendingVerification ? '发送中...' : '重新发送验证邮件'}
              </button>
            )}
            {verificationMessage && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: verificationMessage.includes('失败') ? '#f44336' : '#4CAF50',
                marginTop: '10px',
                fontWeight: 'bold'
              }}>
                {verificationMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;