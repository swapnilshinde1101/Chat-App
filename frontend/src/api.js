import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (username, password) => 
    API.post('/auth/login', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data;
      })
      .catch(err => {
        throw new Error(err.response?.data?.error || 'Login failed');
      }),

  signup: (userData) => 
    API.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    })
    .then(res => res.data)
    .catch(err => {
      throw new Error(err.response?.data || err.message || 'Registration failed');
    })
};

export const users = {
  getCurrentUser: () => API.get('/users/me'),
  getUserById: (id) => API.get(`/users/${id}`),
  getAllUsers: () => API.get('/users'),
  searchUsers: (query) => API.get('/users/search', { params: { query } })
};

export const messages = {
  sendMessage: (receiverId, content) => 
    API.post('/messages', { receiverId, content }),
  
  getConversation: (otherUserId) => 
    API.get(`/messages/conversation/${otherUserId}`),
  
  getUnreadMessages: () => API.get('/messages/unread'),
  
  markAsRead: (messageId) => 
    API.put(`/messages/${messageId}/read`),
  
  getAllConversations: () => API.get('/messages/conversations')
};

export const chats = {
  getChatList: () => API.get('/messages/conversations'),
  createGroupChat: (participants) => 
    API.post('/chats/group', { participants })
};