import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Update PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (currentUser?.token) {
        const isValid = await verifyToken(currentUser.token);
        setVerified(isValid);
      }
    };
    verifyToken();
  }, [currentUser]);

  return verified ? children : <Navigate to="/login" />;
};

export default App;