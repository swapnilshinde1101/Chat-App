import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import ChatPage from '../src/pages/ChatPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
