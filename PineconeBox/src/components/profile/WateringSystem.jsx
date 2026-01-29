import React, { useState, useEffect, useCallback } from 'react';

const WateringSystem = ({ waterCount, setWaterCount, hasWateredToday, setHasWateredToday, updateTreeGrowth }) => {
  const [isWatering, setIsWatering] = useState(false);
  const containerRef = React.useRef(null);
  const audioRef = React.useRef(null);

  // 浇水功能
  const waterTree = useCallback((e) => {
    // 防止重复点击
    if (isWatering) {
      console.log('正在浇水中，请勿重复点击');
      return;
    }

    // 检查今天是否已经浇过水
    const today = new Date().toDateString();
    const lastWatered = localStorage.getItem('lastWateredDate');
    if (lastWatered === today) {
      console.log('今天已经浇过水了，请勿重复浇水');
      setHasWateredToday(true);
      return;
    }

    setIsWatering(true);

    try {
      // 先获取最新的浇水次数（确保从localStorage读取，避免内存状态延迟）
      const currentWaterCount = parseInt(localStorage.getItem('waterCount') || '0');
      // 计算新的浇水次数
      const newWaterCount = currentWaterCount + 1;

      console.log('浇水次数更新:', { current: currentWaterCount, new: newWaterCount, timestamp: new Date().toISOString() });

      // 保存到localStorage（确保数据持久化）
      localStorage.setItem('waterCount', newWaterCount.toString());
      console.log('LocalStorage更新成功:', localStorage.getItem('waterCount'));

      // 更新最后浇水日期
      localStorage.setItem('lastWateredDate', today);
      console.log('最后浇水日期更新:', today);

      // 立即更新状态（确保UI同步）
      setWaterCount(newWaterCount);
      console.log('React状态更新成功:', newWaterCount);

      // 更新成长树状态
      updateTreeGrowth(newWaterCount);
      console.log('成长树状态更新成功');

      // 更新今天是否浇水的状态
      setHasWateredToday(true);
      console.log('今天是否浇水状态更新成功:', true);

      // 创建水滴效果的动态反馈
      createWaterDropEffect(e);

      // 播放音效
      playSound();

      // 确认最终状态
      setTimeout(() => {
        const finalCount = parseInt(localStorage.getItem('waterCount') || '0');
        const finalLastWatered = localStorage.getItem('lastWateredDate');
        console.log('最终状态:', { waterCount: finalCount, lastWatered: finalLastWatered });
        if (finalCount !== newWaterCount) {
          console.error('浇水次数同步失败，强制修正:', newWaterCount);
          localStorage.setItem('waterCount', newWaterCount.toString());
          setWaterCount(newWaterCount);
        }
        if (finalLastWatered !== today) {
          console.error('最后浇水日期同步失败，强制修正:', today);
          localStorage.setItem('lastWateredDate', today);
          setHasWateredToday(true);
        }
      }, 100);
    } catch (error) {
      console.error('浇水失败:', error);
      // 出错时重置浇水状态
      setIsWatering(false);
    } finally {
      // 1.5秒后允许再次浇水（给足够的时间完成所有状态更新）
      setTimeout(() => {
        setIsWatering(false);
        console.log('浇水状态重置，允许再次浇水');
      }, 1500);
    }
  }, [isWatering, setWaterCount, setHasWateredToday, updateTreeGrowth]);

  // 创建水滴效果
  const createWaterDropEffect = (e) => {
    if (!containerRef.current) return;

    // 检查事件对象是否存在
    if (!e || !e.clientX || !e.clientY) {
      console.log('事件对象不存在，使用默认位置');
      // 使用默认位置
      const defaultX = window.innerWidth / 2;
      const defaultY = window.innerHeight / 2;

      // 创建多个水滴元素
      for (let i = 0; i < 5; i++) {
        const drop = document.createElement('div');
        drop.textContent = '💧';
        drop.style.position = 'fixed';
        drop.style.left = `${defaultX + (Math.random() - 0.5) * 100}px`;
        drop.style.top = `${defaultY}px`;
        drop.style.fontSize = `${Math.random() * 1 + 0.5}rem`;
        drop.style.pointerEvents = 'none';
        drop.style.zIndex = '1000';
        drop.style.opacity = '0';
        drop.style.transition = `all ${Math.random() * 1 + 1}s ease-out`;

        // 添加到容器
        containerRef.current.appendChild(drop);

        // 触发动画
        requestAnimationFrame(() => {
          drop.style.opacity = '1';
          drop.style.transform = `translateY(-${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`;
        });

        // 移除元素
        setTimeout(() => {
          drop.remove();
        }, 2000);
      }
      return;
    }

    // 创建多个水滴元素
    for (let i = 0; i < 5; i++) {
      const drop = document.createElement('div');
      drop.textContent = '💧';
      drop.style.position = 'fixed';
      drop.style.left = `${e.clientX + (Math.random() - 0.5) * 100}px`;
      drop.style.top = `${e.clientY}px`;
      drop.style.fontSize = `${Math.random() * 1 + 0.5}rem`;
      drop.style.pointerEvents = 'none';
      drop.style.zIndex = '1000';
      drop.style.opacity = '0';
      drop.style.transition = `all ${Math.random() * 1 + 1}s ease-out`;

      // 添加到容器
      containerRef.current.appendChild(drop);

      // 触发动画
      requestAnimationFrame(() => {
        drop.style.opacity = '1';
        drop.style.transform = `translateY(-${Math.random() * 200 + 100}px) rotate(${Math.random() * 360}deg)`;
      });

      // 移除元素
      setTimeout(() => {
        drop.remove();
      }, 2000);
    }
  };

  // 播放音效函数
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('音频播放失败:', e));
    }
  };

  // 补签功能
  const handleMakeUpCheckIn = () => {
    // 这里可以实现补签逻辑，例如使用松果币兑换补签机会
    const userRewards = JSON.parse(localStorage.getItem('userRewards') || '{}');
    const pineconeCoins = userRewards['松果币'] || 0;

    if (pineconeCoins >= 10) {
      // 扣除松果币
      userRewards['松果币'] -= 10;
      localStorage.setItem('userRewards', JSON.stringify(userRewards));

      // 增加连续签到天数
      const newStreakDays = parseInt(localStorage.getItem('streakDays') || '0') + 1;
      localStorage.setItem('streakDays', newStreakDays.toString());

      // 显示成功消息
      alert('补签成功！');
    } else {
      alert('松果币不足，需要10个松果币才能补签');
    }
  };

  return (
    <div ref={containerRef}>
      {/* 浇水能量 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: 'var(--card-bg)', 
        borderRadius: '15px', 
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💧</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>
          浇水能量
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800', marginBottom: '15px' }}>
          {waterCount} / 20
        </div>
        <div style={{ 
          width: '80%', 
          height: '12px', 
          backgroundColor: '#E8F5E8', 
          borderRadius: '10px', 
          margin: '0 auto 15px', 
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${Math.min((waterCount / 20) * 100, 100)}%`, 
            height: '100%', 
            backgroundColor: waterCount >= 20 ? '#4CAF50' : '#FF9800', 
            borderRadius: '10px', 
            transition: 'width 0.8s ease'
          }}></div>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-color)', fontWeight: 'bold' }}>
          {waterCount >= 20 ? '🎉 能量已满！可以收获啦～' : `还需要 ${20 - waterCount} 次浇水，加油！`}
        </div>
      </div>

      {/* 浇水按钮 */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleMakeUpCheckIn}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}
        >
          🪄 松果补签卡
        </button>
        <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-color)', marginBottom: '20px' }}>
          花费10个松果币，补签一天（连续签到不中断）
        </p>
        
        {/* 浇水按钮 */}
        <button 
          onClick={(e) => waterTree(e)}
          disabled={waterCount >= 20 || hasWateredToday}
          style={{
            backgroundColor: (waterCount >= 20 || hasWateredToday) ? '#ccc' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: (waterCount >= 20 || hasWateredToday) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}
        >
          {waterCount >= 20 ? '🎉 能量已满！' : hasWateredToday ? '💧 今日已浇水' : '💧 浇水'}
        </button>
      </div>

      {/* 音频元素 */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-water-droplet-1447.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default WateringSystem;