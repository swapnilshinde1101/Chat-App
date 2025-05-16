// api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
API.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Enhanced API methods with error handling
export const auth = {
  login: (username, password) => 
    API.post('/auth/login', { username, password })
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Login failed');
      }),

  signup: (userData) => 
    API.post('/auth/signup', userData)
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.response?.data?.message || 'Registration failed');
      })
};

export const messages = {
  getMessages: (userId) => 
    API.get(`/messages/${userId}`)
      .then(res => res.data)
      .catch(err => {
        throw new Error('Failed to load messages');
      }),

  sendMessage: (userId, text) => 
    API.post(`/messages/${userId}`, { text })
      .then(res => res.data)
      .catch(err => {
        throw new Error('Failed to send message');
      })
};