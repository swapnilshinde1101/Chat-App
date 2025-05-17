import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Inbox from './components/Inbox';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/inbox" element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Updated PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Added loading state
  const location = useLocation();
  const [authVerified, setAuthVerified] = useState(false);

  useEffect(() => {
    if (!currentUser?.token) {
      setAuthVerified(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        if (!response.ok) throw new Error('Verification failed');
        
        const data = await response.json();
        setAuthVerified(data.authenticated);
      } catch (error) {
        console.error('Token verification failed:', error);
        setAuthVerified(false);
      }
    };

    verifyAuth();
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!authVerified) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default App;