import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import API from './api'; // Added import
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
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  return currentUser ? children : <Navigate to="/login" state={{ from: location }} replace />;
};




export default App;