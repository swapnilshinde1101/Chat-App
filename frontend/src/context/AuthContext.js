import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await auth.login(username, password);
    localStorage.setItem('user', JSON.stringify(response.data));
    setCurrentUser(response.data);
  };

  const signup = async (username, email, password) => {
    const response = await auth.signup(username, email, password);
    localStorage.setItem('user', JSON.stringify(response.data));
    setCurrentUser(response.data);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Add token refresh logic
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('/auth/refresh', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('token', res.data.newToken);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };
  checkAuth();
}, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);