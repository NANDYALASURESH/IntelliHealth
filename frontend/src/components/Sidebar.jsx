// src/components/Sidebar.js
import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';

import {
  Users, FileText, Calendar, Settings, LogOut, Activity,
  BarChart2, User, Shield, Heart, Stethoscope,
  TestTube, BookOpen, AlertCircle, Clock, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const menuItems = {
    admin: [
      { icon: BarChart2, label: 'Overview', path: '/dashboard', color: 'text-blue-600' },
      { icon: Users, label: 'User Management', path: '/dashboard?tab=users', color: 'text-green-600' },
      { icon: Shield, label: 'System Security', path: '/dashboard?tab=security', color: 'text-red-600' },
      { icon: Settings, label: 'System Settings', path: '/dashboard?tab=settings', color: 'text-gray-600' },
      { icon: AlertCircle, label: 'System Logs', path: '/dashboard?tab=logs', color: 'text-yellow-600' }
    ],
    doctor: [
      { icon: Activity, label: 'Dashboard', path: '/doctor-dashboard', color: 'text-blue-600' },
      { icon: Calendar, label: 'Appointments', path: '/doctor/appointments', color: 'text-green-600' },
      { icon: Users, label: 'My Patients', path: '/doctor/patients', color: 'text-purple-600' },
      { icon: Stethoscope, label: 'Diagnoses', path: '/doctor/diagnoses', color: 'text-red-600' },
      { icon: FileText, label: 'Medical Records', path: '/doctor/records', color: 'text-indigo-600' },
      { icon: BookOpen, label: 'Medical Library', path: '/doctor/library', color: 'text-teal-600' }
    ],
    patient: [
      { icon: Heart, label: 'Health Overview', path: '/patient-dashboard', color: 'text-red-500' },
      { icon: Calendar, label: 'My Appointments', path: '/patient/appointments', color: 'text-blue-600' },
      { icon: FileText, label: 'Medical Records', path: '/patient/records', color: 'text-green-600' },
      { icon: TestTube, label: 'Lab Results', path: '/patient/lab-results', color: 'text-purple-600' },
      { icon: User, label: 'Profile', path: '/patient/profile', color: 'text-gray-600' }
    ],
    lab: [
      { icon: TestTube, label: 'Lab Dashboard', path: '/lab-dashboard', color: 'text-blue-600' },
      { icon: TestTube, label: 'Pending Tests', path: '/lab/tests', color: 'text-yellow-600' },
      { icon: FileText, label: 'Test Reports', path: '/lab/reports', color: 'text-green-600' },
      { icon: BarChart2, label: 'Analytics', path: '/lab/analytics', color: 'text-purple-600' },
      { icon: Clock, label: 'Test History', path: '/lab/history', color: 'text-gray-600' }
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path.includes('?tab=')) {
      const tab = path.split('?tab=')[1];
      return activeTab === tab;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    if (path.includes('?tab=')) {
      const tab = path.split('?tab=')[1];
      navigate(`/dashboard?tab=${tab}`, { replace: true });
    } else {
      navigate(path);
    }
  };

  const handleQuickAction = async (action) => {
    switch (action) {
      case 'addUser':
        navigate('/dashboard?tab=users');
        break;
      // Add more quick actions as needed
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role} Dashboard</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 ml-1">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems[user?.role]?.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                isActive(item.path) 
                  ? 'text-white transform rotate-90' 
                  : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
              }`} />
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {user?.role === 'admin' && (
              <button 
                onClick={() => handleQuickAction('addUser')}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                + Add User
              </button>
            )}
            {user?.role === 'doctor' && (
              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                + New Diagnosis
              </button>
            )}
            {user?.role === 'patient' && (
              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                + Book Appointment
              </button>
            )}
            {user?.role === 'lab' && (
              <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
                + Upload Results
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;