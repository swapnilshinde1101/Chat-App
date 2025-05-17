import axios from 'axios';


// Create axios instance
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

// Helper function to validate auth responses
const validateAuthResponse = (data) => {
  if (!data || typeof data !== 'object') return false;
  return data.token && data.user && data.user.id;
};

// Auth API methods
const auth = {
  login: (username, password) => 
    API.post('/auth/login', { username, password })
      .then(res => {
        if (validateAuthResponse(res.data)) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          return res.data;
        }
        throw new Error('Invalid response from server');
      }),
  
  signup: (userData) => 
    API.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    })
};

// Users API methods
const users = {
  getCurrentUser: () => API.get('/users/me'),
  getUserById: (id) => API.get(`/users/${id}`),
  getAllUsers: () => API.get('/users'),
  searchUsers: (query) => API.get('/users/search', { params: { query } })
};

// Messages API methods
const messages = {
  sendMessage: (receiverId, content) => 
    API.post('/messages', { receiverId, content }),
  
  getConversation: (otherUserId) => 
    API.get(`/messages/conversation/${otherUserId}`),
  
  getUnreadMessages: () => API.get('/messages/unread'),
  
  markAsRead: (messageId) => 
    API.put(`/messages/${messageId}/read`),
  
  getAllConversations: () => API.get('/messages/conversations')
};

// Chats API methods
const chats = {
  getChatList: () => API.get('/messages/conversations'),
  createGroupChat: (participants) => 
    API.post('/chats/group', { participants })
};

// Export all API methods
export { 
  API as default,
  auth,
  users,
  messages,
  chats
};