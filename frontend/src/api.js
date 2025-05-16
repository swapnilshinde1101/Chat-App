import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const auth = {
  login: (username, password) => API.post('/auth/login', { username, password }),
  signup: (username, email, password) => API.post('/auth/signup', { username, email, password }),
};

export const chats = {
  getUserChats: (userId) => API.get(`/chats/${userId}`),
};

export const messages = {
  getMessages: (userId) => API.get(`/messages/${userId}`),
  sendMessage: (userId, text) => API.post(`/messages/${userId}`, { text }),
};