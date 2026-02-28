# 大雄 · 不晚英语

一个面向老年用户的鼓励型英语学习辅助网页应用。

## 核心理念

这是一个鼓励型英语学习工具，目标用户是 50 岁以上的中老年人。
产品的情绪目标是 " 什么时候开始都不晚，只要想学就一定可以学好 "。

## 设计目标

- 消除学习焦虑
- 提供陪伴感
- 强调进步而不是效率
- 让用户感觉不会掉队

## 技术架构

### 前端技术栈

- React 18
- Vite
- CSS3

### 项目结构

```
silvertalk/
├── public/
├── src/
│   ├── components/           # 组件目录
│   │   ├── VoiceReader.jsx   # 语音朗读功能
│   │   ├── DialogAI.jsx      # 简单对话模拟 AI
│   │   ├── ProgressTracker.jsx # 学习记录与进步统计
│   │   ├── ScenarioDialog.jsx # 场景化对话生成模块
│   │   └── components.css    # 组件样式
│   ├── App.jsx               # 主应用组件
│   ├── App.css               # 应用样式
│   ├── main.jsx              # 应用入口
│   └── index.css             # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 功能模块

### 1. 语音朗读功能

- 使用 Web Speech API 实现文本到语音转换
- 支持调整语速和音量
- 适合老年人的慢速朗读

### 2. 简单对话模拟 AI

- 基于预设模板的对话模拟
- 支持多种场景的对话练习
- 未来可接入大语言模型 API 实现更智能的对话

### 3. 学习记录与进步统计

- 使用 localStorage 存储学习进度
- 展示总体进度和分类进度
- 记录连续学习天数

### 4. 老年模式

- 自动放大字体和按钮
- 提高界面可读性
- 减少认知负担

### 5. 场景化对话生成模块

- 基于场景的对话模板
- 支持多种日常生活场景
- 提供真实的对话练习

## 未来接入大语言模型 API

### 技术方案

1. **API 选择**
   - OpenAI API (GPT-3.5/4)
   - Google Gemini API
   - Anthropic Claude API

2. **集成方式**
   - 创建 API 服务层，封装大语言模型调用
   - 使用环境变量存储 API 密钥
   - 实现错误处理和重试机制

3. **功能增强**
   - 智能对话生成：根据用户输入生成自然的英语回复
   - 个性化学习计划：基于用户学习历史推荐内容
   - 发音评估：分析用户发音并提供改进建议
   - 场景对话生成：根据用户需求生成特定场景的对话

4. **性能优化**
   - 实现请求缓存，减少 API 调用
   - 使用流式响应，提高用户体验
   - 实现本地 fallback 机制，确保基本功能可用

### 代码示例

```javascript
// api.js - 大语言模型 API 服务

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function getAIResponse(prompt, context) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful English teacher for elderly learners. Speak simply and clearly.',
          },
          ...context,
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('API error:', error);
    // 返回 fallback 响应
    return 'I understand. Let\'s practice English together!';
  }
}
```

## 如何运行

1. 安装依赖
   ```bash
   npm install
   ```

2. 启动开发服务器
   ```bash
   npm run dev
   ```

3. 构建生产版本
   ```bash
   npm run build
   ```

## 设计特点

- **老年友好**：大字体、高对比度、简洁布局
- **鼓励型设计**：强调进步，提供积极反馈
- **低认知负担**：简单直观的界面，减少复杂操作
- **响应式设计**：适配不同屏幕尺寸
- **温暖色调**：使用米白色背景和深蓝色按钮，营造温馨氛围

## 未来规划

- 添加更多学习场景
- 实现社区功能，让用户互相鼓励
- 开发移动应用版本
- 接入更多智能学习功能
- 提供更多个性化学习内容
