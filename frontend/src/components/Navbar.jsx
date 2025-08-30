// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Activity, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Mock notifications - replace with actual API call
    if (user) {
      setNotifications([
        { id: 1, message: 'New appointment scheduled', type: 'info', time: '5 min ago' },
        { id: 2, message: 'Lab results available', type: 'success', time: '1 hour ago' },
        { id: 3, message: 'Urgent: Patient requires attention', type: 'warning', time: '2 hours ago' }
      ]);
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const routes = {
      doctor: '/doctor-dashboard',
      admin: '/admin-dashboard',
      patient: '/patient-dashboard',
      lab: '/lab-dashboard'
    };
    return routes[user.role] || '/dashboard';
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Activity className="h-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  IntelliHealth
                </span>
                <div className="text-xs text-gray-500 -mt-1">Healthcare Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Search Bar */}
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50"
                  />
                </div>

                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === getDashboardLink()
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationColor(notification.type).split(' ')[1]}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-sm text-indigo-600 hover:text-indigo-500">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <User className="h-4 w-4" />
                          <span>Profile Settings</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <Settings className="h-4 w-4" />
                          <span>Preferences</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-200 mb-2">
                    <p className="text-base font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-base font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;