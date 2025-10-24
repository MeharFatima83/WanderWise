import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Your validation is already great ---
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) return setError('Fill all fields');
    if (!formData.email.includes('@')) return setError('Invalid email');
    if (formData.password.length < 6) return setError('Password too short');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      // --- Use the correct, full backend URL for signup ---
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for CORS consistency
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Use the error message from the backend if it exists
        throw new Error(data.message || 'Signup failed. Please try again.');
      }
      
      // --- Set a success message instead of using alert() ---
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login after a short delay so the user can read the message
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12 px-4">
      <div className="mt-7 max-w-lg mx-auto bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="block text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              👤 Sign Up
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Create your account to start planning amazing trips.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              ✅ {success}
            </div>
          )}

          <div className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="py-3 px-4 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="py-3 px-4 pr-12 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Password must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="py-3 px-4 pr-12 block w-full border-2 border-blue-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {loading ? '🔄 Creating Account...' : '✨ Create Account'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}