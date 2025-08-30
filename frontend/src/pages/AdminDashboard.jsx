// src/components/dashboards/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Users, FileText, AlertTriangle, Settings, TrendingUp, Shield, Activity, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { adminApi } from '../services/api';


const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    labReports: 0,
    pendingApprovals: 0,
    systemHealth: 98,
    activeUsers: 0,
    dailyAppointments: 0,
    totalAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Basic user fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Emergency contact fields
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  
  // Doctor-specific fields
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [department, setDepartment] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [bio, setBio] = useState('');
  const [isAvailableForEmergency, setIsAvailableForEmergency] = useState(false);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        if (data.success) {
          setStats(data.data.stats);
          setRecentActivity(data.data.recentActivity);
        }
      } catch (error) {
        toast.error(error.message);
        console.error('Dashboard stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const resetForm = () => {
    setName('');
    setGender('');
    setEmail('');
    setRole('');
    setDateOfBirth('');
    setPhone('');
    setPassword('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setEmergencyContactRelationship('');
    setSpecialization('');
    setLicenseNumber('');
    setExperience('');
    setDepartment('');
    setConsultationFee('');
    setBio('');
    setIsAvailableForEmergency(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'role'];
      for (const field of requiredFields) {
        if (!eval(field)) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // Build user data
      const userData = {
        name, email, gender, dateOfBirth, phone, role, password,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relationship: emergencyContactRelationship
        }
      };

      // Add doctor-specific fields
      if (role === 'doctor') {
        const doctorRequiredFields = ['specialization', 'licenseNumber', 'experience', 'department', 'consultationFee'];
        for (const field of doctorRequiredFields) {
          if (!eval(field)) {
            throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required for doctors`);
          }
        }

        Object.assign(userData, {
          specialization,
          licenseNumber,
          experience: parseInt(experience),
          department,
          consultationFee: parseInt(consultationFee),
          bio,
          isAvailableForEmergency
        });
      }

      const data = await adminApi.addUser(userData);
      
      if (data.success) {
        toast.success('User added successfully');
        setIsOpen(false);
        resetForm();
        // Refresh dashboard stats
        const statsData = await adminApi.getDashboardStats();
        if (statsData.success) {
          setStats(statsData.data.stats);
          setRecentActivity(statsData.data.recentActivity);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Add user error:', error);
    } finally {
      setLoading(false);
    }
  };  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {/* Add user management content here */}
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">System Security</h2>
            {/* Add security content here */}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            {/* Add settings content here */}
          </div>
        );
      case 'logs':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">System Logs</h2>
            {/* Add logs content here */}
          </div>
        );
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-blue-600`} />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.change.startsWith('+') 
                        ? 'text-green-700 bg-green-50 border border-green-200' 
                        : 'text-red-700 bg-red-50 border border-red-200'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-4 p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200/50"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        activity.type === 'user' ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white' :
                        activity.type === 'system' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' :
                        activity.type === 'lab' ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white' :
                        'bg-gradient-to-br from-red-400 to-red-500 text-white'
                      }`}>
                        {activity.type.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  System Alerts
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-sm font-semibold text-red-800">High server load</span>
                    </div>
                    <p className="text-xs text-red-600 mt-2 ml-6">Server CPU usage at 85%</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-sm font-semibold text-yellow-800">Backup pending</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-2 ml-6">Daily backup scheduled in 2 hours</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-200 rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-sm font-semibold text-blue-800">System update available</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2 ml-6">Version 2.1.5 ready for deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.doctors,
      change: '+12%',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Total Patients',
      value: stats.patients,
      change: '+8%',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Lab Reports',
      value: stats.labReports,
      change: '+15%',
      icon: FileText,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: '-5%',
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'System Health',
      value: `${stats.systemHealth}%`,
      change: '+2%',
      icon: Shield,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      change: '+25%',
      icon: Activity,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Daily Appointments',
      value: stats.dailyAppointments,
      change: '+18%',
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    },
    {
      title: 'Critical Alerts',
      value: stats.criticalAlerts,
      change: '-10%',
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-br from-slate-100 to-slate-200',
      textColor: 'text-slate-600',
      shadowColor: 'shadow-slate-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'overview' ? 'Admin Dashboard' : 
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'overview' 
                ? `Welcome back, ${user?.name}. Here's your system overview.`
                : `Manage your system ${activeTab}.`}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsOpen(true)} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Add New User
            </button>
            
            {/* popup model for Add New User*/}
            {isOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Add New User
                  </h2>
                  {/* Form fields for adding a new user */}
                  <form onSubmit={handleAddUser} className="space-y-4">
                    {/* Name and Email - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input 
                          onChange={(e) => setName(e.target.value)} 
                          type="text" 
                          name="name" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          onChange={(e) => setEmail(e.target.value)} 
                          type="email" 
                          name="email" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                    </div>

                    {/* Password and Phone - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                          onChange={(e) => setPassword(e.target.value)} 
                          type="password" 
                          name="password" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input 
                          onChange={(e) => setPhone(e.target.value)} 
                          type="tel" 
                          name="phone" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                    </div>
                    {/* Gender*/}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select 
                        onChange={(e) => setGender(e.target.value)} 
                        name="gender" 
                        required 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Role and Date of Birth - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select 
                          onChange={(e) => setRole(e.target.value)} 
                          name="role" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Role</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                          <option value="patient">Patient</option>
                          <option value="lab">Lab Technician</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input 
                          onChange={(e) => setDateOfBirth(e.target.value)} 
                          type="date" 
                          name="dateOfBirth" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                    </div>

                    {/* Emergency Contact - Three fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                          onChange={(e) => setEmergencyContactName(e.target.value)} 
                          type="text" 
                          name="emergencyContactName" 
                          placeholder="Contact Name" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                        <input 
                          onChange={(e) => setEmergencyContactPhone(e.target.value)} 
                          type="tel" 
                          name="emergencyContactPhone" 
                          placeholder="Contact Phone" 
                          required 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                        <input 
                          onChange={(e) => setEmergencyContactRelationship(e.target.value)} 
                          type="text" 
                          name="emergencyContactRelationship" 
                          placeholder="Relationship" 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        />
                      </div>
                    </div>

                    {/* Doctor-specific fields (conditional) */}
                    {role === 'doctor' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                            <input 
                              onChange={(e) => setSpecialization(e.target.value)} 
                              type="text" 
                              name="specialization" 
                              required 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                            <input 
                              onChange={(e) => setLicenseNumber(e.target.value)} 
                              type="text" 
                              name="licenseNumber" 
                              required 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                            <input 
                              onChange={(e) => setExperience(e.target.value)} 
                              type="number" 
                              name="experience" 
                              required 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <input 
                              onChange={(e) => setDepartment(e.target.value)} 
                              type="text" 
                              name="department" 
                              required 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
                            <input 
                              onChange={(e) => setConsultationFee(e.target.value)} 
                              type="number" 
                              name="consultationFee" 
                              required 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea 
                              onChange={(e) => setBio(e.target.value)} 
                              name="bio" 
                              rows="3" 
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="isAvailableForEmergency" 
                            checked={isAvailableForEmergency} 
                            onChange={(e) => setIsAvailableForEmergency(e.target.checked)} 
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isAvailableForEmergency" className="text-sm text-gray-700">Available for emergency?</label>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setIsOpen(false)} 
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Export Report
            </button>
          </div>
        </div>

        {/* Dynamic Content based on activeTab */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;