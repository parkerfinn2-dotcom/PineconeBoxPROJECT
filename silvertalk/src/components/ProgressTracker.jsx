import React, { useState, useEffect } from 'react';
import englishPhrases from '../data/englishPhrases';

const ProgressTracker = () => {
  // 计算每个场景的总句子数
  const calculateTotalSentences = () => {
    const totals = {};
    Object.entries(englishPhrases).forEach(([category, dialogs]) => {
      let total = 0;
      dialogs.forEach(dialog => {
        total += dialog.length;
      });
      totals[category] = total;
    });
    return totals;
  };

  const totalSentences = calculateTotalSentences();

  const [progress, setProgress] = useState({
    totalLearned: 0,
    categories: {
      greeting: { learned: 0, total: totalSentences.greeting },
      restaurant: { learned: 0, total: totalSentences.restaurant },
      travel: { learned: 0, total: totalSentences.travel },
      hospital: { learned: 0, total: totalSentences.hospital },
      emergency: { learned: 0, total: totalSentences.emergency },
      social: { learned: 0, total: totalSentences.social },
      workplace: { learned: 0, total: totalSentences.workplace },
      shopping: { learned: 0, total: totalSentences.shopping },
      phone: { learned: 0, total: totalSentences.phone },
      family: { learned: 0, total: totalSentences.family },
    },
    streak: 0,
    lastLearned: null,
  });

  // 从本地存储加载进度
  useEffect(() => {
    const savedProgress = localStorage.getItem('englishLearningProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // 保存进度到本地存储
  useEffect(() => {
    localStorage.setItem('englishLearningProgress', JSON.stringify(progress));
  }, [progress]);

  // 从localStorage读取已学会的句子数量
  useEffect(() => {
    const learnedSentences = {};
    let totalLearned = 0;
    
    // 遍历localStorage，找到所有已学会的句子
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('learned_')) {
        const value = localStorage.getItem(key);
        if (value === 'true') {
          totalLearned++;
          // 提取场景信息
          const parts = key.split('_')[1].split('-');
          const category = parts[0];
          if (category) {
            learnedSentences[category] = (learnedSentences[category] || 0) + 1;
          }
        }
      }
    }
    
    // 更新进度数据
    setProgress(prev => ({
      ...prev,
      totalLearned,
      categories: {
        ...prev.categories,
        greeting: {
          ...prev.categories.greeting,
          learned: learnedSentences.greeting || 0
        },
        restaurant: {
          ...prev.categories.restaurant,
          learned: learnedSentences.restaurant || 0
        },
        travel: {
          ...prev.categories.travel,
          learned: learnedSentences.travel || 0
        },
        hospital: {
          ...prev.categories.hospital,
          learned: learnedSentences.hospital || 0
        },
        emergency: {
          ...prev.categories.emergency,
          learned: learnedSentences.emergency || 0
        },
        social: {
          ...prev.categories.social,
          learned: learnedSentences.social || 0
        },
        workplace: {
          ...prev.categories.workplace,
          learned: learnedSentences.workplace || 0
        },
        shopping: {
          ...prev.categories.shopping,
          learned: learnedSentences.shopping || 0
        },
        phone: {
          ...prev.categories.phone,
          learned: learnedSentences.phone || 0
        },
        family: {
          ...prev.categories.family,
          learned: learnedSentences.family || 0
        }
      }
    }));
  }, []);

  // 计算总进度百分比
  const calculateTotalProgress = () => {
    const totalPossible = Object.values(progress.categories).reduce((sum, cat) => sum + cat.total, 0);
    const totalLearned = Object.values(progress.categories).reduce((sum, cat) => sum + cat.learned, 0);
    return Math.round((totalLearned / totalPossible) * 100);
  };

  // 获取已学会的句子列表
  const getLearnedSentences = () => {
    const learnedSentences = [];
    
    // 遍历localStorage，找到所有已学会的句子
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('learned_')) {
        const value = localStorage.getItem(key);
        if (value === 'true') {
          // 提取场景和句子信息
          const parts = key.split('_')[1].split('-');
          const category = parts[0];
          const dialogIndex = parts[1];
          const sentenceIndex = parts[2];
          
          // 根据场景和索引查找对应句子
          if (category && dialogIndex && sentenceIndex) {
            const scenarioDialogs = englishPhrases[category];
            if (scenarioDialogs) {
              // 由于dialogIndex是递增的，我们需要遍历查找
              for (let j = 0; j < scenarioDialogs.length; j++) {
                const dialog = scenarioDialogs[j];
                if (parseInt(sentenceIndex) < dialog.length) {
                  const sentence = dialog[parseInt(sentenceIndex)];
                  if (sentence) {
                    learnedSentences.push({
                      id: key,
                      category: category,
                      text: sentence.text,
                      translation: sentence.translation
                    });
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return learnedSentences;
  };

  const learnedSentences = getLearnedSentences();

  return (
    <div className="progress-tracker">
      <h3>我的学习进步</h3>
      
      {/* 总进度 */}
      <div className="total-progress">
        <h4>总体进度</h4>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${calculateTotalProgress()}%` }}
          ></div>
        </div>
        <p>{calculateTotalProgress()}% 完成</p>
      </div>

      {/* 分类进度 */}
      <div className="category-progress">
        <h4>分类进度</h4>
        {Object.entries(progress.categories).map(([key, value]) => {
          const categoryName = {
            greeting: '日常问候',
            restaurant: '餐厅用餐',
            travel: '旅行交通',
            hospital: '医院健康',
            emergency: '紧急求助',
            social: '社交聊天',
            workplace: '职场用语',
            shopping: '购物',
            phone: '电话用语',
            family: '家庭生活',
          }[key];
          const percentage = Math.round((value.learned / value.total) * 100);
          
          return (
            <div key={key} className="category-item">
              <div className="category-header">
                <span>{categoryName}</span>
                <span>{value.learned}/{value.total}</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 学习统计 */}
      <div className="learning-stats">
        <h4>学习统计</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{progress.totalLearned}</span>
            <span className="stat-label">已学单词/短语</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{progress.streak}</span>
            <span className="stat-label">连续学习天数</span>
          </div>
        </div>
      </div>

      {/* 已学会的句子 */}
      {learnedSentences.length > 0 && (
        <div className="learned-sentences">
          <h4>已学会的句子</h4>
          <div className="sentences-list">
            {learnedSentences.map((sentence, index) => (
              <div key={index} className="learned-sentence-item">
                <div className="sentence-text">{sentence.text}</div>
                <div className="sentence-translation">{sentence.translation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;