import React, { useState } from 'react';
import './App.css';
import VoiceReader from './components/VoiceReader';
import DialogAI from './components/DialogAI';
import ProgressTracker from './components/ProgressTracker';
import ScenarioDialog from './components/ScenarioDialog';

function App() {
  // 状态管理
  const [isOldAgeMode, setIsOldAgeMode] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentScenario, setCurrentScenario] = useState('greeting');

  // 切换大字模式
  const toggleLargeTextMode = () => {
    setIsOldAgeMode(!isOldAgeMode);
    if (!isOldAgeMode) {
      document.body.classList.add('large-text-mode');
    } else {
      document.body.classList.remove('large-text-mode');
    }
  };

  // 按钮数据
  const buttons = [
    { id: 1, label: '今天学一点', onClick: () => setActiveSection('today') },
    { id: 2, label: '我的进步', onClick: () => setActiveSection('progress') },
    { id: 3, label: '日常问候', onClick: () => handleScenarioClick('greeting') },
    { id: 4, label: '餐厅用餐', onClick: () => handleScenarioClick('restaurant') },
    { id: 5, label: '旅行交通', onClick: () => handleScenarioClick('travel') },
    { id: 6, label: '医院健康', onClick: () => handleScenarioClick('hospital') },
    { id: 7, label: '紧急求助', onClick: () => handleScenarioClick('emergency') },
    { id: 8, label: '社交聊天', onClick: () => handleScenarioClick('social') },
    { id: 9, label: '职场用语', onClick: () => handleScenarioClick('workplace') },
    { id: 10, label: '购物', onClick: () => handleScenarioClick('shopping') },
    { id: 11, label: '电话用语', onClick: () => handleScenarioClick('phone') },
    { id: 12, label: '家庭生活', onClick: () => handleScenarioClick('family') },
  ];

  // 场景点击处理函数
  const handleScenarioClick = (scenario) => {
    setCurrentScenario(scenario);
    setActiveSection('scenario');
  };

  // 返回主页
  const goBackToHome = () => {
    setActiveSection(null);
  };

  // 渲染当前部分
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'today':
        return (
          <div className="content-section">
            <h3>今天学一点</h3>
            <div className="learning-content">
              <p>Hello! 你好！</p>
              <VoiceReader text="Hello!" />
              <p>How are you? 你好吗？</p>
              <VoiceReader text="How are you?" />
              <p>Thank you! 谢谢！</p>
              <VoiceReader text="Thank you!" />
            </div>
            <button className="back-button" onClick={goBackToHome}>返回主页</button>
          </div>
        );
      case 'progress':
        return (
          <div className="content-section">
            <ProgressTracker />
            <button className="back-button" onClick={goBackToHome}>返回主页</button>
          </div>
        );
      case 'scenario':
        return (
          <div className="content-section">
            <ScenarioDialog initialScenario={currentScenario} />
            <DialogAI scenario={currentScenario} />
            <button className="back-button" onClick={goBackToHome}>返回主页</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {/* 顶部标题 */}
      <header className="header">
        <h1 className="title">大雄 · 不晚英语</h1>
        <h2 className="subtitle">什么时候开始，都不晚。</h2>
      </header>

      {/* 大字模式切换按钮 */}
      <div className="mode-toggle">
        <button 
          className={`toggle-button ${isOldAgeMode ? 'active' : ''}`}
          onClick={toggleLargeTextMode}
        >
          {isOldAgeMode ? '退出大字模式' : '大字模式'}
        </button>
      </div>

      {/* 按钮网格或内容部分 */}
      {activeSection ? (
        renderActiveSection()
      ) : (
        <div className="button-grid">
          {buttons.map((button) => (
            <button
              key={button.id}
              className="main-button"
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}

      {/* 底部信息 */}
      <footer className="footer">
        <p>大雄 · 不晚英语 - 什么时候开始都不晚</p>
      </footer>
    </div>
  );
}

export default App;