import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/chat');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

 function Login() {
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  );
}
}
