import React, { useState } from 'react';
import englishPhrases from '../data/englishPhrases';

const ScenarioDialog = ({ initialScenario = 'greeting' }) => {
  const [selectedScenario, setSelectedScenario] = useState(initialScenario);
  const [generatedDialog, setGeneratedDialog] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

  // 使用导入的englishPhrases数据
  const dialogTemplates = englishPhrases;

  // 语音朗读功能
  const speak = (text) => {
    if ('speechSynthesis' in window && text) {
      // 停止之前的朗读
      window.speechSynthesis.cancel();
      
      // 创建新的朗读实例
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 尝试选择高质量的英语语音
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Microsoft')
      ) || voices.find(voice => 
        voice.lang === 'en-US'
      );
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 0.8; // 适合老年人的语速
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // 开始朗读
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);

      // 朗读结束后更新状态
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      // 处理错误
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
    } else {
      alert('您的浏览器不支持语音合成功能');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // 生成对话
  const generateDialog = () => {
    setIsGenerating(true);
    // 模拟生成延迟
    setTimeout(() => {
      const scenarioDialogs = dialogTemplates[selectedScenario];
      const randomIndex = Math.floor(Math.random() * scenarioDialogs.length);
      setGeneratedDialog(scenarioDialogs[randomIndex]);
      // 更新对话索引，确保句子ID唯一性
      setCurrentDialogIndex(prev => prev + 1);
      setIsGenerating(false);
    }, 1000);
  };

  // 朗读整个对话
  const readAloudDialog = () => {
    if (generatedDialog.length > 0) {
      let currentIndex = 0;
      
      const readNextLine = () => {
        if (currentIndex < generatedDialog.length) {
          speak(generatedDialog[currentIndex].text);
          currentIndex++;
          
          // 等待当前朗读结束后再朗读下一行
          setTimeout(readNextLine, 2000); // 2秒延迟，给用户时间理解
        }
      };
      
      readNextLine();
    }
  };

  return (
    <div className="scenario-dialog">
      <h3>场景对话练习</h3>
      
      {/* 场景选择 */}
      <div className="scenario-selector">
        <label>选择场景：</label>
        <select 
          value={selectedScenario} 
          onChange={(e) => setSelectedScenario(e.target.value)}
        >
          <option value="greeting">日常问候</option>
          <option value="restaurant">餐厅用餐</option>
          <option value="travel">旅行交通</option>
          <option value="hospital">医院健康</option>
          <option value="emergency">紧急求助</option>
          <option value="social">社交聊天</option>
          <option value="workplace">职场用语</option>
          <option value="shopping">购物</option>
          <option value="phone">电话用语</option>
          <option value="family">家庭生活</option>
        </select>
        <button className="generate-button" onClick={generateDialog}>
          生成对话
        </button>
      </div>

      {/* 生成的对话 */}
      {isGenerating ? (
        <div className="loading">生成对话中...</div>
      ) : generatedDialog.length > 0 ? (
        <div className="dialog-container">
          <div className="dialog-actions">
            <button 
              className="read-aloud-dialog-button"
              onClick={readAloudDialog}
              disabled={isSpeaking}
            >
              朗读整个对话
            </button>
          </div>
          {generatedDialog.map((line, index) => {
            const sentenceId = `${selectedScenario}-${currentDialogIndex}-${index}`;
            const isLearned = localStorage.getItem(`learned_${sentenceId}`) === 'true';
            
            const toggleLearned = () => {
              if (isLearned) {
                localStorage.removeItem(`learned_${sentenceId}`);
              } else {
                localStorage.setItem(`learned_${sentenceId}`, 'true');
              }
              // 强制重新渲染
              setGeneratedDialog([...generatedDialog]);
            };
            
            return (
              <div key={index} className={`dialog-line ${line.role.toLowerCase()}`}>
                <span className="role">{line.role}:</span>
                <span className="text">{line.text}</span>
                {line.translation && (
                  <span className="text-translation">{line.translation}</span>
                )}
                <div className="sentence-actions">
                  <button 
                    className="read-aloud-button"
                    onClick={() => speak(line.text)}
                    disabled={isSpeaking}
                  >
                    朗读
                  </button>
                  <button 
                    className={`learned-button ${isLearned ? 'learned' : ''}`}
                    onClick={toggleLearned}
                  >
                    {isLearned ? '已学会' : '标记为已学会'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">请选择场景并生成对话</div>
      )}
      
      {isSpeaking && (
        <div className="speaking-indicator">
          <button className="stop-speaking-button" onClick={stopSpeaking}>
            停止朗读
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenarioDialog;