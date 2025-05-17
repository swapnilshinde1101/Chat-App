import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username required';
    if (!formData.password) newErrors.password = 'Password required';
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there are any errors
    if (errors.username || errors.password) {
      return;
    }

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/inbox');
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.response?.data?.error || 'Login failed. Check your credentials.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <h3 className="text-xl font-semibold text-gray-600 mt-2">Login</h3>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center text-red-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({...formData, username: e.target.value});
                    if (e.target.value.trim()) {
                      setErrors(prev => ({ ...prev, username: '' }));
                    }
                  }}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (e.target.value) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || errors.username || errors.password}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${loading || errors.username || errors.password ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 shadow-md hover:shadow-lg'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : 'Login'}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="mt-2 text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;