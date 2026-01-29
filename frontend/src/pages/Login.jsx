import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { User, Lock, Heart, Brain, Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure login from useAuth

  const roles = [
    { value: 'admin', label: 'Admin', route: '/admin' },
    { value: 'doctor', label: 'Doctor', route: '/doctor' },
    { value: 'patient', label: 'Patient', route: '/patient' },
    { value: 'lab', label: 'Lab', route: '/lab' }
  ];

  const routes = {
    doctor: '/doctor-dashboard',
    admin: '/admin/dashboard',
    patient: '/patient/dashboard',
    lab: '/lab/dashboard'
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (token && role && routes[role]) {
      navigate("/dashboard");
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    setServerError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log('Submitting form:', formData);
      // Only send email and password, not role
      const response = await login({
        email: formData.email,
        password: formData.password
      });
      console.log('Login response:', response);

      // Store role in cookies for persistence
      Cookies.set('role', response.user.role);

      // Navigate to role-specific dashboard
      if (routes[response?.user?.role]) {
        navigate(routes[response.user.role]);
      } else {
        setServerError('Invalid user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-gradient-shift"></div>

      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-float"></div>

        {/* Medical icons floating */}
        <div className="absolute top-1/4 left-1/4 animate-float-slow">
          <Heart className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float">
          <Activity className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float-slower">
          <Brain className="w-6 h-6 text-white/20" />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/30">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="relative mb-4">
            <div className="flex justify-center items-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IntelliHealth
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-2 rounded-full"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-600">Sign in to your healthcare dashboard</p>
        </div>

        {/* FORM START */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50/50 hover:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                  ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white'
                  }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-gray-50/50 hover:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                  ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white'
                  }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-gray-50/50 hover:bg-white transition-all duration-200 cursor-pointer"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600 text-center">{serverError}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 hover:scale-105 focus:ring-4 focus:ring-indigo-500/30 shadow-lg hover:shadow-2xl'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Forgot password */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
            Forgot your password?
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">IntelliHealth</span> Platform
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-30px) translateX(10px);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-40px) translateX(-15px) scale(1.05);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
