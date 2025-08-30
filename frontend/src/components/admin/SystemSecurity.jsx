import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Key, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SystemSecurity = () => {
  const { user } = useAuth();
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90
    },
    sessionPolicy: {
      maxSessionDuration: 8,
      idleTimeout: 30,
      maxConcurrentSessions: 3
    },
    accessControl: {
      mfaEnabled: true,
      ipWhitelist: [],
      failedLoginAttempts: 5,
      lockoutDuration: 15
    }
  });
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Mock data - replace with actual API calls
      setSecurityLogs([
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          event: 'Failed login attempt',
          user: 'john.doe@example.com',
          ip: '192.168.1.100',
          severity: 'medium',
          details: 'Invalid password for user account'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          event: 'Successful login',
          user: 'admin@intellihealth.com',
          ip: '192.168.1.50',
          severity: 'low',
          details: 'User logged in successfully'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          event: 'Suspicious activity detected',
          user: 'unknown',
          ip: '203.0.113.45',
          severity: 'high',
          details: 'Multiple failed login attempts from suspicious IP'
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordPolicyChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }));
  };

  const handleSessionPolicyChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      sessionPolicy: {
        ...prev.sessionPolicy,
        [field]: value
      }
    }));
  };

  const handleAccessControlChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        [field]: value
      }
    }));
  };

  const saveSecuritySettings = async () => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings updated successfully');
    } catch (error) {
      toast.error('Failed to update security settings');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" />
            System Security
          </h1>
          <p className="text-gray-600 mt-1">Monitor and configure system security settings</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchSecurityData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={saveSecuritySettings}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
                  <dd className="text-lg font-medium text-gray-900">Secure</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Threats</dt>
                  <dd className="text-lg font-medium text-gray-900">1</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">MFA Enabled</dt>
                  <dd className="text-lg font-medium text-gray-900">Yes</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Last Audit</dt>
                  <dd className="text-lg font-medium text-gray-900">2h ago</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Security Overview', icon: Shield },
              { id: 'password', label: 'Password Policy', icon: Lock },
              { id: 'session', label: 'Session Management', icon: Key },
              { id: 'access', label: 'Access Control', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Security Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Security Events</h3>
                  <div className="space-y-3">
                    {securityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getSeverityIcon(log.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{log.event}</p>
                          <p className="text-xs text-gray-500">by {log.user} from {log.ip}</p>
                          <p className="text-xs text-gray-400">{log.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Recommendations</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-blue-800">Enable Two-Factor Authentication</h4>
                          <p className="text-sm text-blue-700 mt-1">All admin accounts should have 2FA enabled</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">Review Failed Login Attempts</h4>
                          <p className="text-sm text-yellow-700 mt-1">Multiple failed attempts detected from suspicious IPs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Policy Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Password Policy Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={securitySettings.passwordPolicy.minLength}
                    onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Password Age (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={securitySettings.passwordPolicy.maxAge}
                    onChange={(e) => handlePasswordPolicyChange('maxAge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireUppercase"
                      checked={securitySettings.passwordPolicy.requireUppercase}
                      onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-900">
                      Require uppercase letters
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireLowercase"
                      checked={securitySettings.passwordPolicy.requireLowercase}
                      onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireLowercase" className="ml-2 block text-sm text-gray-900">
                      Require lowercase letters
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireNumbers"
                      checked={securitySettings.passwordPolicy.requireNumbers}
                      onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-900">
                      Require numbers
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireSpecialChars"
                      checked={securitySettings.passwordPolicy.requireSpecialChars}
                      onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-900">
                      Require special characters
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Management Tab */}
          {activeTab === 'session' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Session Management Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Session Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={securitySettings.sessionPolicy.maxSessionDuration}
                    onChange={(e) => handleSessionPolicyChange('maxSessionDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idle Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={securitySettings.sessionPolicy.idleTimeout}
                    onChange={(e) => handleSessionPolicyChange('idleTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Concurrent Sessions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={securitySettings.sessionPolicy.maxConcurrentSessions}
                    onChange={(e) => handleSessionPolicyChange('maxConcurrentSessions', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Access Control Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Failed Login Attempts Before Lockout
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.accessControl.failedLoginAttempts}
                    onChange={(e) => handleAccessControlChange('failedLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={securitySettings.accessControl.lockoutDuration}
                    onChange={(e) => handleAccessControlChange('lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mfaEnabled"
                      checked={securitySettings.accessControl.mfaEnabled}
                      onChange={(e) => handleAccessControlChange('mfaEnabled', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="mfaEnabled" className="ml-2 block text-sm text-gray-900">
                      Enable Multi-Factor Authentication for all users
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSecurity;
