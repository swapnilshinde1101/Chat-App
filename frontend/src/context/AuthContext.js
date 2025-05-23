import { useState, useEffect, createContext, useContext } from 'react';
import API from '../api';
import { auth } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await API.get('/auth/verify');
      return response.data.authenticated;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
    if (token && userData) {
  const isValid = await verifyToken();
  if (isValid) {
    setCurrentUser(JSON.parse(userData));
  } else {
    logout();
  }
}

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await auth.login(username, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      logout();
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);