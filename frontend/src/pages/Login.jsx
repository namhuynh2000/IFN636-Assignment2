import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary-fixed to-primary-fixed flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Illustration */}
          <div className="hidden md:flex flex-col justify-center space-y-8 p-8">
            <div>
              <h1 className="font-headline text-5xl font-bold text-primary mb-4">
                Goal Tracking King
              </h1>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed">
                Let's make great happen.
              </p>
            </div>

            {/* Feature Card */}
            <div className="bg-white bg-opacity-70 backdrop-blur-2xl rounded-2xl p-6 border border-outline-variant border-opacity-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✨</span>
                <span className="font-body text-sm font-semibold text-primary uppercase tracking-wider">
                  FOCUS PULSE
                </span>
              </div>
              <p className="font-body text-sm text-on-surface">
                Your productivity peak is typically at 10:30 AM. Ready to start?
              </p>
            </div>

            {/* Illustration - 3D Spheres */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-secondary-container to-primary-container rounded-3xl overflow-hidden shadow-2xl">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background gradient */}
                <defs>
                  <radialGradient id="sphere1" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#68abff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0060ad', stopOpacity: 0.8 }} />
                  </radialGradient>
                  <radialGradient id="sphere2" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#a4fd4c', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3a6b00', stopOpacity: 0.8 }} />
                  </radialGradient>
                  <radialGradient id="sphere3" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#e7deff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#6452a5', stopOpacity: 0.8 }} />
                  </radialGradient>
                </defs>

                <g>                  
                  <image 
                    href="/logo512px.png" 
                    x="75"   /* Adjust this to move the image left/right */
                    y="75"   /* Adjust this to move the image up/down */
                    height="150" 
                    width="150" 
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Card */}
              <div className="bg-white bg-opacity-95 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white border-opacity-50">
                <h2 className="font-headline text-4xl font-bold text-on-surface mb-2">
                  Welcome Back
                </h2>
                <p className="font-body text-on-surface-variant mb-8">
                  Enter your sanctuary to continue your journey.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg">
                    <p className="font-body text-error text-sm">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:bg-surface-container-lowest disabled:opacity-50"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider">
                        PASSWORD
                      </label>
                      <Link
                        to="/forgot-password"
                        className="font-body text-xs text-primary hover:text-primary-dim transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant border-opacity-20 rounded-xl font-body text-on-surface placeholder-on-surface-variant placeholder-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:bg-surface-container-lowest disabled:opacity-50"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-headline font-semibold text-on-primary text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-8"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center gap-4">
                  <div className="flex-1 h-px bg-outline-variant bg-opacity-30"></div>
                  <span className="font-body text-xs text-on-surface-variant uppercase">OR CONTINUE WITH</span>
                  <div className="flex-1 h-px bg-outline-variant bg-opacity-30"></div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    disabled={loading}
                    className="py-3 bg-surface-container-low border border-outline-variant border-opacity-20 rounded-xl font-body font-semibold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="py-3 bg-surface-container-low border border-outline-variant border-opacity-20 rounded-xl font-body font-semibold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                  >
                    Facebook
                  </button>
                </div>

                {/* Signup Link */}
                <p className="font-body text-center text-on-surface-variant mt-8">
                  New to the sanctuary?{' '}
                  <Link
                    to="/register"
                    className="text-primary font-semibold hover:text-primary-dim transition-colors"
                  >
                    Create an account
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

export default Login;
