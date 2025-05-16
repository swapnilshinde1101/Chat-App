import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      alert("Registration successful! Redirecting to login...");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-500 to-blue-700 flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow-md">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 outline-none transition-all"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 outline-none transition-all"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 outline-none transition-all"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-cyan-400 outline-none transition-all"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-transform hover:scale-[1.02]"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-600 font-medium hover:underline hover:text-cyan-700">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;