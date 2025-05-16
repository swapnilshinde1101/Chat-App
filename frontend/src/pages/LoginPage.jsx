import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';



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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative w-full max-w-md px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg shadow-2xl transform rotate-3 opacity-30"></div>
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              <h1 className="text-2xl font-bold text-slate-800">Company Portal</h1>
            </div>
            <p className="text-slate-600">Secure access to your workspace</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Continue</span>
                <FaArrowRight className="w-4 h-4" />
              </div>
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <Link 
              to="/register" 
              className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create new account →
            </Link>
            
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Company Name. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}