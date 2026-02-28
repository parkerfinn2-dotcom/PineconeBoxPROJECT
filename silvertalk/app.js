
 
 let home, learn, cn, en, result, list=[], index=0;

// 等待DOM加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  home = document.getElementById("home"); 
  learn = document.getElementById("learn"); 
  cn = document.getElementById("cn");
  en = document.getElementById("en");
  result = document.getElementById("result");

  // 添加今日推荐按钮
  const dailyBtn = document.createElement("button");
  dailyBtn.innerText = "今日推荐";
  dailyBtn.onclick = startDaily;
  home.appendChild(dailyBtn);

  // 添加学习进度按钮
const progressBtn = document.createElement("button");
progressBtn.innerText = "学习进度";
progressBtn.onclick = showProgress;
home.appendChild(progressBtn);

// 添加导出进度按钮
const exportBtn = document.createElement("button");
exportBtn.innerText = "导出进度";
exportBtn.onclick = exportProgress;
home.appendChild(exportBtn);

// 添加导入进度按钮
const importBtn = document.createElement("button");
importBtn.innerText = "导入进度";
importBtn.onclick = importProgress;
home.appendChild(importBtn);

  // 添加分类按钮
  Object.keys(data).forEach(k=>{ 
    const b=document.createElement("button"); 
    b.innerText=k; 
    b.onclick=()=>start(k); 
    home.appendChild(b); 
  });
}); 
 
 function start(key){ 
   list=data[key]; 
   index=0; 
   home.classList.add("hidden"); 
   learn.classList.remove("hidden"); 
   show(); 
 } 
 
 function startDaily() {
   // 收集所有句子
   const allSentences = [];
   Object.values(data).forEach(category => {
     allSentences.push(...category);
   });
   
   // 随机排序并取前10句
   list = allSentences.sort(() => 0.5 - Math.random()).slice(0, 10);
   index = 0;
   home.classList.add("hidden");
   learn.classList.remove("hidden");
   show();
 }
 
 function show(){ 
  cn.innerText=list[index].cn; 
  en.innerText=list[index].en; 
  result.textContent = '';
  result.className = '';
  
  // 记录学习进度
  saveProgress();
}

// 保存学习进度
function saveProgress() {
  const currentCategory = Object.keys(data).find(key => data[key] === list);
  if (!currentCategory) return;
  
  // 获取当前学习数据
  let progress = JSON.parse(localStorage.getItem('warmSpeakProgress') || '{}');
  
  // 更新当前分类的进度
  if (!progress[currentCategory]) {
    progress[currentCategory] = {
      learned: 0,
      total: list.length,
      lastLearned: new Date().toISOString()
    };
  }
  
  // 标记当前句子为已学习
  const currentSentence = list[index].en;
  if (!progress[currentCategory].learnedSentences) {
    progress[currentCategory].learnedSentences = [];
  }
  
  if (!progress[currentCategory].learnedSentences.includes(currentSentence)) {
    progress[currentCategory].learnedSentences.push(currentSentence);
    progress[currentCategory].learned = progress[currentCategory].learnedSentences.length;
    progress[currentCategory].lastLearned = new Date().toISOString();
    
    // 更新总学习次数
    if (!progress.totalLearning) {
      progress.totalLearning = 0;
    }
    progress.totalLearning++;
    
    // 保存到本地存储
    localStorage.setItem('warmSpeakProgress', JSON.stringify(progress));
    console.log('学习进度已保存');
  }
} 
 
 window.next=()=>{ 
   index=(index+1)%list.length; 
   show(); 
 } 
 
 // 全局变量存储语音列表
 let voices = [];

 // 语音加载完成回调
 function onVoicesChanged() {
   voices = speechSynthesis.getVoices();
   console.log('语音列表加载完成，共', voices.length, '个语音');
   // 打印可用的语音
   voices.forEach((voice, index) => {
     if (voice.lang.startsWith('en-')) {
       console.log(index, ':', voice.name, '(', voice.lang, ')');
     }
   });
 }

 // 监听语音列表加载
 speechSynthesis.onvoiceschanged = onVoicesChanged;

 window.speak=()=>{ 
  const text = list[index].en;
  
  // 使用Google Cloud Text-to-Speech API获取真人语音
  // 注意：这里使用了一个免费的API密钥，实际使用时应该替换为自己的API密钥
  const apiKey = 'AIzaSyB-9Nq07zI7sWvqY7q6X5q3X5q3X5q3X5'; // 示例API密钥，需要替换
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-F' // 美式英语女声
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.8, // 适合老年人的语速
        pitch: 0 // 正常音调
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('API调用失败');
    }
    return response.json();
  })
  .then(data => {
    if (data.audioContent) {
      // 播放返回的音频
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
      console.log('使用Google Cloud Text-to-Speech API');
    } else {
      throw new Error('没有返回音频内容');
    }
  })
  .catch(error => {
    console.error('API调用失败，使用默认语音:', error);
    // 降级使用浏览器内置语音
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    
    // 尝试使用高质量语音
    if (voices.length === 0) {
      voices = speechSynthesis.getVoices();
    }
    
    let selectedVoice = voices.find(voice => 
      voice.lang === 'en-US' &&
      (voice.name.includes('Google') || 
       voice.name.includes('Microsoft') || 
       voice.name.includes('Apple'))
    );
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    speechSynthesis.speak(utterance);
  });
} 

 // 预加载语音列表
 window.addEventListener('load', () => {
   // 触发语音列表加载
   const loadedVoices = speechSynthesis.getVoices();
   if (loadedVoices.length > 0) {
     onVoicesChanged();
   }
 });
 
 window.goHome=()=>{ 
  learn.classList.add("hidden"); 
  home.classList.remove("hidden"); 
}

// 显示学习进度
function showProgress() {
  // 获取学习进度数据
  const progress = JSON.parse(localStorage.getItem('warmSpeakProgress') || '{}');
  
  // 创建进度显示界面
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  progressContainer.innerHTML = `
    <h2>学习进度</h2>
    <div class="progress-content">
      <p><strong>总学习次数:</strong> ${progress.totalLearning || 0}</p>
      <h3>分类学习情况:</h3>
      <div class="category-progress"></div>
      <button onclick="closeProgress()">关闭</button>
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(progressContainer);
  
  // 填充分类学习情况
  const categoryProgress = progressContainer.querySelector('.category-progress');
  Object.keys(data).forEach(category => {
    const catProgress = progress[category] || { learned: 0, total: data[category].length };
    const percentage = Math.round((catProgress.learned / catProgress.total) * 100);
    
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';
    categoryItem.innerHTML = `
      <div class="category-name">${category}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="progress-text">${catProgress.learned}/${catProgress.total} (${percentage}%)</div>
    `;
    
    categoryProgress.appendChild(categoryItem);
  });
}

// 关闭进度显示
function closeProgress() {
  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.remove();
  }
}

// 导出学习进度
function exportProgress() {
  // 获取学习进度数据
  const progress = JSON.parse(localStorage.getItem('warmSpeakProgress') || '{}');
  
  // 添加导出时间
  progress.exportTime = new Date().toISOString();
  
  // 转换为JSON字符串
  const jsonStr = JSON.stringify(progress, null, 2);
  
  // 创建Blob对象
  const blob = new Blob([jsonStr], { type: 'application/json' });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `warm-speak-progress-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  
  // 触发下载
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  console.log('学习进度已导出');
}

// 导入学习进度
function importProgress() {
  // 创建文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  // 监听文件选择
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        // 解析JSON
        const progress = JSON.parse(e.target.result);
        
        // 验证数据格式
        if (typeof progress === 'object' && progress !== null) {
          // 保存到本地存储
          localStorage.setItem('warmSpeakProgress', JSON.stringify(progress));
          console.log('学习进度已导入');
          alert('学习进度导入成功！');
        } else {
          alert('无效的进度文件格式');
        }
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败，请确保选择了正确的进度文件');
      }
    };
    reader.readAsText(file);
  };
  
  // 触发文件选择
  input.click();
} 
 
 window.record=()=>{ 
   console.log('开始语音识别');
   
   const R=window.webkitSpeechRecognition || window.SpeechRecognition;
   if(!R) {
     console.log('浏览器不支持语音识别');
     result.textContent = "浏览器不支持语音识别";
     result.className = "incorrect";
     return;
   }
   
   try {
     const r=new R(); 
     r.lang="en-US";
     
     // 添加更多事件监听器
     r.onstart = () => {
       console.log('语音识别开始');
       result.textContent = "正在听...";
       result.className = "";
     };
     
     r.onend = () => {
       console.log('语音识别结束');
     };
     
     r.onresult = (event) => {
       console.log('语音识别结果:', event.results);
       const transcript = event.results[0][0].transcript.toLowerCase().trim();
       const expected = list[index].en.toLowerCase().trim();
       console.log('识别文本:', transcript);
       console.log('期望文本:', expected);
       
       // 简单的相似度比较
       const similarity = calculateSimilarity(transcript, expected);
       console.log('相似度:', similarity);
       
       if (similarity > 0.7) {
         result.textContent = "很棒！发音正确";
         result.className = "correct";
       } else {
         result.textContent = "再试一次";
         result.className = "incorrect";
       }
     };
     
     r.onerror = (event) => {
       console.error('语音识别错误:', event.error);
       result.textContent = "识别失败，请重试";
       result.className = "incorrect";
     };
     
     r.start();
     console.log('语音识别已启动');
   } catch (error) {
     console.error('语音识别初始化错误:', error);
     result.textContent = "初始化失败，请重试";
     result.className = "incorrect";
   }
 } 
 
 // 计算字符串相似度
 function calculateSimilarity(str1, str2) {
   const words1 = str1.split(' ');
   const words2 = str2.split(' ');
   
   let matchCount = 0;
   for (const word of words1) {
     if (words2.includes(word)) {
       matchCount++;
     }
   }
   
   return matchCount / Math.max(words1.length, words2.length);
 }