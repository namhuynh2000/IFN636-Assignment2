import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });
      
      localStorage.setItem('registrationSuccess', 'true');
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-fixed via-secondary-fixed to-tertiary-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Illustration */}
          <div className="hidden md:flex flex-col justify-between h-full min-h-96 bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 md:p-10 text-white shadow-2xl">
            <div>
              <h1 className="font-headline text-5xl font-bold mb-6">
                Goal Tracking King
              </h1>
              <p className="font-body text-lg leading-relaxed">
                Let's make great happen.
              </p>
            </div>

            {/* 3D Illustration */}
            <div className="relative h-64 md:h-80 flex items-center justify-center">
              <svg
                viewBox="0 -100 300 400"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Gradients */}
                <defs>
                  <radialGradient id="person-head" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#e8e8e8', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#b0b0b0', stopOpacity: 0.9 }} />
                  </radialGradient>
                  <radialGradient id="person-body" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#f5f5f5', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#c0c0c0', stopOpacity: 0.9 }} />
                  </radialGradient>
                  <radialGradient id="ground" cx="50%" cy="30%">
                    <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>

                <g>                  
                  <image 
                    href="/logo512px.png" 
                    x="40"   /* Adjust this to move the image left/right */
                    y="-100"   /* Adjust this to move the image up/down */
                    height="250" 
                    width="250" 
                  />
                </g>
              </svg>
            </div>

          </div>

          {/* Right Side - Register Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Card */}
              <div className="bg-white bg-opacity-95 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white border-opacity-50">
                <h2 className="font-headline text-4xl font-bold text-on-surface mb-2">
                  Create Account
                </h2>
                <p className="font-body text-on-surface-variant mb-8">
                  Step into your new editorial workspace.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg animate-pulse">
                    <p className="font-body text-error text-sm">{error}</p>
                  </div>
                )}

                

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      FULL NAME
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-on-surface-variant">👤</span>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-on-surface-variant">✉️</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-on-surface-variant">🔒</span>
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-on-surface-variant">🔒</span>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      PHONE NUMBER
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-on-surface-variant">📞</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+1 (555) 012-3456"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-headline font-semibold text-on-primary text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                  >
                    {loading ? 'Creating Sanctuary...' : 'Create My Sanctuary'}
                  </button>
                </form>

                {/* Login Link */}
                <p className="font-body text-center text-on-surface-variant mt-8">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:text-primary-dim transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
