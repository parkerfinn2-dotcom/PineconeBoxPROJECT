import React, { useState, useEffect } from 'react';

const VoiceReader = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // 初始化语音列表
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // 打印所有可用语音，用于调试
        console.log('Available voices:', availableVoices);
        
        // 定义更全面的女性语音关键词列表（用于排除）
        const femaleKeywords = ['female', 'woman', 'girl', 'sarah', 'emily', 'jennifer', 'lisa', 'mary', 'anna', 'julia', 'emma', 'olivia', 'sophia', 'isabella', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn', 'abigail', 'elizabeth', 'sophie', 'aria', 'grace', 'chloe', 'penelope', 'layla', 'nora'];
        
        // 定义更全面的男声关键词列表
        const maleKeywords = ['male', 'man', 'boy', 'david', 'paul', 'john', 'james', 'robert', 'michael', 'william', 'steve', 'george', 'thomas', 'charles', 'joseph', 'daniel', 'matthew', 'anthony', 'andrew', 'david', 'microsoft david', 'google us english male', 'us english male', 'english us male', 'american male', 'us male', 'en-us male'];
        
        // 1. 过滤掉所有女性语音（更严格的过滤）
        const nonFemaleVoices = availableVoices.filter(voice => {
          const voiceName = voice.name.toLowerCase();
          const voiceLang = voice.lang.toLowerCase();
          // 排除明确标记为女性的语音
          if (femaleKeywords.some(keyword => voiceName.includes(keyword))) {
            return false;
          }
          // 排除可能是女性的语音（基于常见命名模式）
          if (voiceName.includes('female') || voiceName.includes('woman') || voiceName.includes('girl')) {
            return false;
          }
          // 优先保留明确标记为男性的语音
          if (maleKeywords.some(keyword => voiceName.includes(keyword))) {
            return true;
          }
          // 对于没有明确性别的语音，优先保留英语语音
          return voiceLang.includes('en');
        });
        
        console.log('Non-female voices:', nonFemaleVoices);
        
        // 2. 优先选择明确标记为男声的语音
        let selectedVoice = null;
        
        // 尝试找到明确标记为男声的语音
        for (const keyword of maleKeywords) {
          const voice = nonFemaleVoices.find(v => 
            v.name.toLowerCase().includes(keyword.toLowerCase()) || 
            (v.lang.toLowerCase() === 'en-us' && v.name.toLowerCase().includes('male'))
          );
          if (voice) {
            selectedVoice = voice;
            console.log('Found male voice:', voice.name);
            break;
          }
        }
        
        // 3. 如果没有找到明确的男声，选择美国英语语音（通常默认是男声）
        if (!selectedVoice) {
          const usEnglishVoices = nonFemaleVoices.filter(voice => {
            const lang = voice.lang.toLowerCase();
            return lang === 'en-us';
          });
          console.log('US English voices:', usEnglishVoices);
          if (usEnglishVoices.length > 0) {
            selectedVoice = usEnglishVoices[0];
            console.log('Selected US English voice:', selectedVoice.name);
          }
        }
        
        // 4. 如果没有找到美国英语语音，选择其他英语语音
        if (!selectedVoice) {
          const englishVoices = nonFemaleVoices.filter(voice => {
            const lang = voice.lang.toLowerCase();
            return lang.includes('en');
          });
          console.log('English voices:', englishVoices);
          if (englishVoices.length > 0) {
            selectedVoice = englishVoices[0];
            console.log('Selected English voice:', selectedVoice.name);
          }
        }
        
        // 5. 如果没有找到英语语音，选择第一个非女性语音
        if (!selectedVoice && nonFemaleVoices.length > 0) {
          selectedVoice = nonFemaleVoices[0];
          console.log('Selected non-female voice:', selectedVoice.name);
        }
        
        // 6. 万不得已，选择第一个可用语音
        if (!selectedVoice && availableVoices.length > 0) {
          selectedVoice = availableVoices[0];
          console.log('Selected first available voice:', selectedVoice.name);
        }
        
        console.log('Final selected voice:', selectedVoice);
        setSelectedVoice(selectedVoice);
      }
    };

    // 首次加载
    loadVoices();
    
    // 监听语音列表变化
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // 添加更多延迟加载，确保语音列表完全加载
    const timers = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000].map(delay => {
      return setTimeout(() => {
        console.log('Delayed voice load after', delay, 'ms');
        loadVoices();
      }, delay);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const speak = () => {
    if ('speechSynthesis' in window && text) {
      // 停止之前的朗读
      window.speechSynthesis.cancel();
      
      // 创建新的朗读实例
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 强制选择男声，即使之前的选择失败
      let voiceToUse = selectedVoice;
      
      // 再次尝试获取并选择男声
      const voices = window.speechSynthesis.getVoices();
      const maleKeywords = ['male', 'man', 'boy', 'david', 'paul', 'john', 'james', 'robert', 'michael', 'william', 'steve', 'george', 'thomas', 'charles', 'joseph', 'daniel', 'matthew', 'anthony', 'andrew', 'david', 'microsoft david', 'google us english male', 'us english male', 'english us male', 'american male', 'us male', 'en-us male'];
      const femaleKeywords = ['female', 'woman', 'girl', 'sarah', 'emily', 'jennifer', 'lisa', 'mary', 'anna', 'julia', 'emma', 'olivia', 'sophia', 'isabella', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn', 'abigail', 'elizabeth', 'sophie', 'aria', 'grace', 'chloe', 'penelope', 'layla', 'nora'];
      
      // 过滤出所有非女性语音
      const nonFemaleVoices = voices.filter(voice => {
        const voiceName = voice.name.toLowerCase();
        return !femaleKeywords.some(keyword => voiceName.includes(keyword));
      });
      
      // 尝试找到男声
      let foundMaleVoice = null;
      for (const keyword of maleKeywords) {
        foundMaleVoice = nonFemaleVoices.find(v => 
          v.name.toLowerCase().includes(keyword.toLowerCase())
        );
        if (foundMaleVoice) break;
      }
      
      // 如果找到男声，使用它
      if (foundMaleVoice) {
        voiceToUse = foundMaleVoice;
        console.log('Forced male voice:', foundMaleVoice.name);
      } else if (nonFemaleVoices.length > 0) {
        // 如果没有找到明确的男声，使用第一个非女性语音
        voiceToUse = nonFemaleVoices[0];
        console.log('Using non-female voice:', voiceToUse.name);
      } else if (voices.length > 0) {
        // 万不得已，使用第一个可用语音
        voiceToUse = voices[0];
        console.log('Using first available voice:', voiceToUse.name);
      }
      
      // 设置语音参数
      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('Using voice:', voiceToUse.name);
      } else {
        utterance.lang = 'en-US';
        console.log('Using default language: en-US');
      }
      
      // 优化语音参数，提高音质
      utterance.rate = 0.8; // 适中的语速，提高清晰度
      utterance.pitch = 1.0; // 保持自然音调
      utterance.volume = 1.0; // 最大音量
      
      console.log('Speech rate:', utterance.rate);

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
    }
    setIsSpeaking(false);
  };

  return (
    <div className="voice-reader">
      <div className="voice-selector">
        <label htmlFor="voice-select">选择语音:</label>
        <select 
          id="voice-select"
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={(e) => {
            const voice = voices.find(v => v.name === e.target.value);
            if (voice) {
              setSelectedVoice(voice);
              console.log('Voice changed to:', voice.name);
            }
          }}
        >
          {voices.filter(voice => {
            const voiceName = voice.name.toLowerCase();
            const femaleKeywords = ['female', 'woman', 'girl', 'sarah', 'emily', 'jennifer', 'lisa', 'mary', 'anna', 'julia', 'emma', 'olivia', 'sophia', 'isabella', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn', 'abigail', 'elizabeth', 'sophie', 'aria', 'grace', 'chloe', 'penelope', 'layla', 'nora', 'liam', 'emma', 'ava', 'olivia', 'sophia', 'isabella', 'charlotte', 'mia', 'amelia', 'harper', 'evelyn', 'abigail', 'elizabeth', 'sophie', 'aria', 'grace', 'chloe', 'penelope', 'layla', 'nora'];
            return !femaleKeywords.some(keyword => voiceName.includes(keyword));
          }).map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
      <button 
        className="voice-button" 
        onClick={isSpeaking ? stopSpeaking : speak}
        disabled={!text}
      >
        {isSpeaking ? '停止朗读' : '朗读'}
      </button>
    </div>
  );
};

export default VoiceReader;