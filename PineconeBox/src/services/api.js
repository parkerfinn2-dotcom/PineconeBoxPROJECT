// API服务文件，用于处理与后端的通信

const API_BASE_URL = 'http://localhost:3001/api';

// 获取存储的令牌
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求函数
const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有令牌，添加到请求头
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 检查响应状态
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${response.status}`);
  }

  return response.json();
};

// 用户认证相关API
export const authApi = {
  // 注册
  register: async (username, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // 登录
  login: async (username, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// 单词相关API
export const wordApi = {
  // 获取单词列表
  getWords: async (level = 1, count = 10) => {
    return request(`/words?level=${level}&count=${count}`);
  },

  // 获取单词详情
  getWordDetail: async (wordId) => {
    return request(`/words/${wordId}`);
  },
};

// 打卡相关API
export const checkinApi = {
  // 创建打卡记录
  createCheckin: async (level = 1, wordCount = 10) => {
    return request('/checkins', {
      method: 'POST',
      body: JSON.stringify({ level, word_count: wordCount }),
    });
  },

  // 获取今日打卡状态
  getTodayStatus: async () => {
    return request('/checkins/today');
  },
};

// 练习相关API
export const exerciseApi = {
  // 提交练习答案
  submitAnswers: async (checkinId, answers) => {
    return request('/exercises/submit', {
      method: 'POST',
      body: JSON.stringify({ checkin_id: checkinId, answers }),
    });
  },
};

// 松果相关API
export const pineconeApi = {
  // 获取用户松果总数
  getTotal: async () => {
    return request('/users/pinecones');
  },

  // 获取松果变动记录
  getLogs: async () => {
    return request('/users/pinecones/logs');
  },
};

// 松果币银行相关API
export const bankApi = {
  // 获取松果币银行信息
  getBankInfo: async () => {
    return request('/bank/info');
  },

  // 浇水达到20次后生成树并换取松果币
  harvestTree: async (waterCount) => {
    return request('/bank/harvest-tree', {
      method: 'POST',
      body: JSON.stringify({ water_count: waterCount }),
    });
  },

  // 获取成长树记录
  getTreeRecords: async () => {
    return request('/bank/trees');
  },
};

export default {
  auth: authApi,
  word: wordApi,
  checkin: checkinApi,
  exercise: exerciseApi,
  pinecone: pineconeApi,
  bank: bankApi,
};