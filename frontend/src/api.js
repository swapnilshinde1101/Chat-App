import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // Make sure this matches your backend port
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
        return res.data;
      })
      .catch(err => {
        throw new Error(err.response?.data?.error || 'Login failed');
      }),

  signup: (userData) => 
    API.post('/auth/register', {  // Changed from /signup to /register
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    })
    .then(res => res.data)
    .catch(err => {
      throw new Error(err.response?.data || 'Registration failed');
    })
};

export const users = {
  getCurrentUser: () => API.get('/users/me'),
  getUserById: (id) => API.get(`/users/${id}`),
  getAllUsers: () => API.get('/users')
};

export const messages = {
  sendMessage: (receiverId, content) => 
    API.post('/messages', { receiverId, content }),
  
  getMessagesBetween: (otherUserId) => 
    API.get('/messages/between', { params: { otherUserId } }),
  
  getUnreadMessages: () => API.get('/messages/unread'),
  
  markAsRead: (messageId) => 
    API.put(`/messages/${messageId}/read`),
  
  getAllMessages: () => API.get('/messages/all')
};

export const chats = {
  getUserChats: () => API.get('/messages/all') // Using messages endpoint since no dedicated chats endpoint
};