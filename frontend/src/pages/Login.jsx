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

  const sampleAccounts = [
    { role: 'admin', email: 'admin@intellihealth.com', password: 'Admin123!', icon: '🛡️', label: 'Admin' },
    { role: 'doctor', email: 'sarah.wilson@intellihealth.com', password: 'Doctor123!', icon: '👨‍⚕️', label: 'Doctor' },
    { role: 'patient', email: 'john.doe@example.com', password: 'Patient123!', icon: '🤒', label: 'Patient' },
    { role: 'lab', email: 'lab@intellihealth.com', password: 'Lab123!', icon: '🔬', label: 'Lab' }
  ];

  const handleSampleLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password,
      role: account.role
    });
    setErrors({});
    setServerError('');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-white/20">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="relative mb-4">
            <div className="flex justify-center items-center space-x-1 mb-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Activity className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              IntelliHealth
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2"></div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-600">Sign in to your healthcare dashboard</p>
        </div>

        {/* FORM START */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-gray-50/50 hover:bg-white transition-all duration-200"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {serverError && <p className="text-sm text-red-600 text-center">{serverError}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 focus:ring-4 focus:ring-indigo-500/30 shadow-lg hover:shadow-xl'
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
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
            Forgot your password?
          </a>
        </div>

        {/* Sample Login Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Sample Login for Recruiters</p>
          <div className="grid grid-cols-2 gap-3">
            {sampleAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => handleSampleLogin(account)}
                className="flex items-center space-x-2 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200 text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{account.icon}</span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{account.label}</p>
                  <p className="text-[10px] text-gray-500 truncate">{account.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">IntelliHealth</span> Platform
          </p>
        </div>
      </div>
    </div>
  );
}
