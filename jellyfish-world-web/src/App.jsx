import React, { useState, useEffect, useRef } from 'react';

// 水母数据
const jellyfishData = [
  {
    "name": "MoonJellyfish",
    "displayName": "海月水母",
    "size": 1.0,
    "color": [0.6, 0.8, 1.0],
    "glowIntensity": 0.3,
    "transparency": 0.7,
    "speed": 0.5,
    "description": "最常见的水母之一，伞部呈圆盘状，有4个马蹄形生殖腺"
  },
  {
    "name": "BoxJellyfish",
    "displayName": "箱水母",
    "size": 0.8,
    "color": [0.8, 0.2, 0.3],
    "glowIntensity": 0.1,
    "transparency": 0.6,
    "speed": 1.0,
    "description": "世界上最毒的水母之一，触须上的刺细胞含有强毒性神经毒素"
  },
  {
    "name": "CrownJellyfish",
    "displayName": "冠水母",
    "size": 1.2,
    "color": [0.4, 0.6, 0.9],
    "glowIntensity": 0.5,
    "transparency": 0.8,
    "speed": 0.3,
    "description": "伞部呈冠状，边缘有许多触手"
  },
  {
    "name": "Jellyfish",
    "displayName": "海蜇",
    "size": 1.5,
    "color": [0.9, 0.9, 1.0],
    "glowIntensity": 0.0,
    "transparency": 0.9,
    "speed": 0.4,
    "description": "可食用水母，在中国被广泛养殖"
  },
  {
    "name": "StalkedJellyfish",
    "displayName": "十字水母",
    "size": 0.3,
    "color": [0.7, 0.5, 0.8],
    "glowIntensity": 0.2,
    "transparency": 0.7,
    "speed": 0.2,
    "description": "小型水母，通常附着在海藻或岩石上"
  }
];

function App() {
  const [isNight, setIsNight] = useState(true);
  const [jellyfishes, setJellyfishes] = useState(jellyfishData);
  const bubblesRef = useRef(null);

  // 切换昼夜模式
  const toggleDayNight = () => {
    setIsNight(!isNight);
  };

  // 创建背景气泡
  useEffect(() => {
    const createBubbles = () => {
      if (!bubblesRef.current) return;

      // 清空现有气泡
      bubblesRef.current.innerHTML = '';

      // 创建50个气泡
      for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // 随机大小
        const size = Math.random() * 50 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // 随机位置
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `-100px`;

        // 随机透明度
        bubble.style.opacity = Math.random() * 0.5 + 0.1;

        // 随机动画持续时间
        const duration = Math.random() * 20 + 10;
        bubble.style.animationDuration = `${duration}s`;

        // 随机延迟
        bubble.style.animationDelay = `${Math.random() * 10}s`;

        bubblesRef.current.appendChild(bubble);
      }
    };

    createBubbles();
  }, []);

  // 将RGB数组转换为CSS颜色
  const rgbToString = (rgbArray) => {
    return `rgb(${Math.round(rgbArray[0] * 255)}, ${Math.round(rgbArray[1] * 255)}, ${Math.round(rgbArray[2] * 255)})`;
  };

  return (
    <div className={`app ${isNight ? 'night-mode' : 'day-mode'}`}>
      {/* 背景气泡 */}
      <div className="bubbles" ref={bubblesRef}></div>

      {/* 昼夜切换按钮 */}
      <div className="day-night-toggle">
        <button 
          className="toggle-btn" 
          onClick={toggleDayNight}
        >
          {isNight ? '切换到白天' : '切换到夜晚'}
        </button>
      </div>

      {/* 头部 */}
      <header className="header">
        <h1>水母世界</h1>
        <p>探索神秘的海洋生物 - {isNight ? '夜晚模式' : '白天模式'}</p>
      </header>

      {/* 水母容器 */}
      <main className="jellyfish-container">
        {jellyfishes.map((jellyfish, index) => {
          const jellyColor = rgbToString(jellyfish.color);
          const glowEffect = isNight ? 
            `0 0 ${jellyfish.glowIntensity * 30 + 20}px ${jellyColor}` : 
            `0 0 ${jellyfish.glowIntensity * 10}px ${jellyColor}`;

          return (
            <div key={jellyfish.name} className="jellyfish-card">
              {/* 水母可视化 */}
              <div className="jellyfish-visual">
                <div 
                  className="jellyfish-shape" 
                  style={{
                    backgroundColor: jellyColor,
                    opacity: jellyfish.transparency,
                    boxShadow: glowEffect,
                    transform: `scale(${jellyfish.size})`
                  }}
                >
                  {/* 触手 */}
                  <div className="jellyfish-tentacles">
                    {[...Array(5)].map((_, tentacleIndex) => (
                      <div 
                        key={tentacleIndex} 
                        className="tentacle"
                        style={{
                          animationDelay: `${tentacleIndex * 0.2}s`,
                          animationDuration: `${2 + jellyfish.speed}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 水母信息 */}
              <div className="jellyfish-info">
                <h3>{jellyfish.displayName}</h3>
                <p>{jellyfish.description}</p>
                
                {/* 水母属性 */}
                <div className="jellyfish-stats">
                  <div className="stat-item">
                    <span>大小:</span>
                    <span className="stat-value">{jellyfish.size.toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span>速度:</span>
                    <span className="stat-value">{jellyfish.speed.toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span>透明度:</span>
                    <span className="stat-value">{jellyfish.transparency.toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span>发光强度:</span>
                    <span className="stat-value">{jellyfish.glowIntensity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;