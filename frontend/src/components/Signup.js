import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        navigate('/login', {
          state: {
            registrationSuccess: true,
            message: 'Registration successful! Please login.'
          }
        });
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Registration</h1>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="username"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
