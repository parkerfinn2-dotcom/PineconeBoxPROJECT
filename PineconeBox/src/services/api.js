// API服务文件，用于处理与后端的通信

const API_BASE_URL = 'http://localhost:3001/api';

// 获取存储的令牌
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求函数
const request = async (endpoint, options = {}) => {
  console.log('发送请求:', {
    endpoint: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    hasToken: !!getToken()
  });
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有令牌，添加到请求头
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('添加Authorization头:', `Bearer ${token.substring(0, 20)}...`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('请求响应:', {
      status: response.status,
      statusText: response.statusText
    });

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('请求失败:', {
        status: response.status,
        message: errorData.message || `请求失败: ${response.status}`
      });
      throw new Error(errorData.message || `请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log('请求成功，返回数据:', data);
    return data;
  } catch (error) {
    console.error('请求出错:', error);
    throw error;
  }
};

// 用户认证相关API
export const authApi = {
  // 注册
  register: async (username, password, email) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  },

  // 登录
  login: async (username, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // 邮箱登录
  loginWithEmail: async (email, password) => {
    return request('/auth/login/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // 邮箱验证
  verifyEmail: async (email, code) => {
    return request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  // 重新发送验证码
  resendVerification: async (email) => {
    return request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
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