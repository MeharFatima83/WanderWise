import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials or server error.');
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem('token', data.token);
      login(data.user || data);
      navigate('/');
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Network error. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">🔐 Sign In</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-3 p-2 border rounded"
          />
          <label className="block mb-1">Password</label>
          <div className="flex gap-2">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded"
            />
            <button type="button" onClick={() => setShowPassword(s => !s)} className="px-3">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" disabled={loading} className="mt-4 w-full p-2 bg-blue-600 text-white rounded">
            {loading ? 'Signing in...' : '✨ Sign In'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
