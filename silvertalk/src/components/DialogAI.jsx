import React, { useState } from 'react';

const DialogAI = ({ scenario }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 模拟对话回复
  const getAIResponse = (input, scenario) => {
    // 关键词匹配逻辑
    const inputLower = input.toLowerCase();
    
    // 常见问题的特定回复
    if (inputLower.includes('car') || inputLower.includes('where is')) {
      return { text: "I'm sorry, I don't have that information. But you can ask someone for directions.", translation: "对不起，我没有那个信息。但你可以向别人问路。" };
    }
    
    if (inputLower.includes('hello') || inputLower.includes('hi')) {
      return { text: "Hello! How can I help you today?", translation: "你好！今天我能帮你什么？" };
    }
    
    if (inputLower.includes('thank')) {
      return { text: "You're welcome!", translation: "不客气！" };
    }
    
    if (inputLower.includes('name')) {
      return { text: "My name is Daxiong. Nice to meet you!", translation: "我的名字是大雄。很高兴认识你！" };
    }
    
    if (inputLower.includes('how are you')) {
      return { text: "I'm doing well, thank you! How about you?", translation: "我很好，谢谢！你呢？" };
    }
    
    if (inputLower.includes('weather')) {
      return { text: "The weather is nice today, isn't it?", translation: "今天天气很好，不是吗？" };
    }
    
    // 原有的场景回复逻辑
    const responses = {
      greeting: [
        { text: "Hello! How are you today?", translation: "你好！你今天怎么样？" },
        { text: "Good morning! Nice to meet you.", translation: "早上好！很高兴认识你。" },
        { text: "Hi there! How can I help you today?", translation: "嗨！今天我能帮你什么？" }
      ],
      restaurant: [
        { text: "Welcome to our restaurant! May I take your order?", translation: "欢迎来到我们的餐厅！我可以为您点餐吗？" },
        { text: "What would you like to eat today?", translation: "您今天想吃什么？" },
        { text: "Would you like something to drink?", translation: "您想喝点什么吗？" }
      ],
      travel: [
        { text: "Where are you planning to travel?", translation: "您打算去哪里旅行？" },
        { text: "Do you need help with directions?", translation: "您需要方向帮助吗？" },
        { text: "What's your destination?", translation: "您的目的地是哪里？" }
      ],
      hospital: [
        { text: "How are you feeling today?", translation: "您今天感觉怎么样？" },
        { text: "What seems to be the problem?", translation: "您哪里不舒服？" },
        { text: "Do you have any allergies?", translation: "您有任何过敏史吗？" }
      ],
      emergency: [
        { text: "Please stay calm. What's the emergency?", translation: "请保持冷静。发生了什么紧急情况？" },
        { text: "Can you tell me your location?", translation: "您能告诉我您的位置吗？" },
        { text: "Help is on the way.", translation: "救援正在路上。" }
      ],
      social: [
        { text: "How was your day?", translation: "你今天过得怎么样？" },
        { text: "What have you been up to lately?", translation: "你最近在忙什么？" },
        { text: "Do you have any hobbies?", translation: "你有什么爱好吗？" }
      ],
      workplace: [
        { text: "How's your work going?", translation: "你的工作进展如何？" },
        { text: "Do you need help with anything?", translation: "你需要任何帮助吗？" },
        { text: "What are your plans for today?", translation: "你今天的计划是什么？" }
      ]
    };

    const scenarioResponses = responses[scenario] || responses.greeting;
    const randomIndex = Math.floor(Math.random() * scenarioResponses.length);
    return scenarioResponses[randomIndex];
  };

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

  const handleSend = () => {
    if (!userInput.trim()) return;

    // 添加用户消息
    const newMessages = [...messages, { type: 'user', text: userInput, translation: '' }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    // 模拟 AI 回复延迟
    setTimeout(() => {
      const aiResponse = getAIResponse(userInput, scenario);
      const updatedMessages = [...newMessages, { type: 'ai', text: aiResponse.text, translation: aiResponse.translation }];
      setMessages(updatedMessages);
      setIsLoading(false);
      
      // 自动朗读AI回复
      speak(aiResponse.text);
    }, 1000);
  };

  return (
    <div className="dialog-ai">
      <h3>对话练习</h3>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{message.text}</div>
            {message.translation && (
              <div className="message-translation">{message.translation}</div>
            )}
            <button 
              className="read-aloud-button"
              onClick={() => speak(message.text)}
              disabled={isSpeaking}
            >
              朗读
            </button>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">AI 正在思考...</div>
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入您的回复..."
        />
        <button className="send-button" onClick={handleSend}>
          发送
        </button>
      </div>
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

export default DialogAI;