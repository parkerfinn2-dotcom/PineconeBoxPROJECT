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
        
        // 选择一个高质量的英语语音
        const englishVoice = availableVoices.find(voice => 
          voice.lang === 'en-US' && voice.name.includes('Microsoft')
        ) || availableVoices.find(voice => 
          voice.lang === 'en-US'
        ) || availableVoices[0];
        
        setSelectedVoice(englishVoice);
      }
    };

    // 加载语音列表
    loadVoices();
    
    // 监听语音列表变化
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if ('speechSynthesis' in window && text) {
      // 停止之前的朗读
      window.speechSynthesis.cancel();
      
      // 创建新的朗读实例
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置语音参数
      if (selectedVoice) {
        utterance.voice = selectedVoice;
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
    }
    setIsSpeaking(false);
  };

  return (
    <div className="voice-reader">
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