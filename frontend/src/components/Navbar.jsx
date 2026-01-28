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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              <div className="block min-w-0">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent truncate">
                  IntelliHealth
                </span>
                <div className="text-xs text-gray-500 -mt-0.5 sm:-mt-1 hidden sm:block">Healthcare Platform</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {user ? (
              <>
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-48 xl:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50 text-sm"
                  />
                </div>

                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
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
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 xl:w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer">
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type).split(' ')[1]}`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
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
                    className="flex items-center space-x-2 xl:space-x-3 px-2 xl:px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden xl:block text-left min-w-0">
                      <p className="text-sm font-medium truncate max-w-24">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize truncate">{user.role}</p>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize truncate">{user.role}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Profile Settings</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <Settings className="h-4 w-4 flex-shrink-0" />
                          <span>Preferences</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                        >
                          <LogOut className="h-4 w-4 flex-shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 xl:px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Tablet Navigation (md:hidden lg:flex) */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {user ? (
              <>
                {/* Mobile Search */}
                <div className="relative" ref={searchRef}>
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {isSearchOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className={`text-sm font-medium px-2 py-2 rounded-lg transition-all duration-200 ${
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
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer">
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type).split(' ')[1]}`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize truncate">{user.role}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span>Profile Settings</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <Settings className="h-4 w-4 flex-shrink-0" />
                          <span>Preferences</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                        >
                          <LogOut className="h-4 w-4 flex-shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <>
                {/* Mobile Search */}
                <div className="relative" ref={searchRef}>
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {isSearchOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notifications.length > 9 ? '9+' : notifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer">
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type).split(' ')[1]}`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-lg hover:bg-indigo-50 transition-colors"
              aria-label="Toggle menu"
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
                  <div className="px-3 py-3 border-b border-gray-200 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-medium text-gray-800 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize truncate">{user.role}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Search Bar */}
                  <div className="px-3 py-2 mb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-gray-50/50 text-sm"
                      />
                    </div>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === getDashboardLink()
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5" />
                      <span>Dashboard</span>
                    </div>
                  </Link>

                  <button
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5" />
                      <span>Profile Settings</span>
                    </div>
                  </button>

                  <button
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5" />
                      <span>Preferences</span>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-3 rounded-lg text-base font-medium transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut className="h-5 w-5" />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5" />
                      <span>Sign in</span>
                    </div>
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <User className="h-5 w-5" />
                      <span>Sign up</span>
                    </div>
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
