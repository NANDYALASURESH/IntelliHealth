// src/components/dashboards/LabDashboard.js
import React, { useEffect, useState } from 'react';
import { Clock, TestTube, FileText, AlertTriangle ,Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LabDashboard = () => {
  const { user } = useAuth();
  const [labData, setLabData] = useState({
    pendingTests: 0,
    completedToday: 0,
    totalReports: 0,
    urgentTests: 0,
    equipmentStatus: { active: 0, maintenance: 0, offline: 0 },
    dailyCapacity: { current: 0, maximum: 0 }
  });
  const [pendingTests, setPendingTests] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLabData({
          pendingTests: 23,
          completedToday: 18,
          totalReports: 156,
          urgentTests: 4,
          equipmentStatus: { active: 12, maintenance: 2, offline: 1 },
          dailyCapacity: { current: 85, maximum: 120 }
        });
        setPendingTests([
          { id: 1, patient: 'John Doe', test: 'Complete Blood Count', priority: 'urgent', ordered: '2024-01-18 08:30', doctor: 'Dr. Wilson' },
          { id: 2, patient: 'Jane Smith', test: 'Lipid Panel', priority: 'normal', ordered: '2024-01-18 09:15', doctor: 'Dr. Johnson' },
          { id: 3, patient: 'Mike Brown', test: 'Thyroid Function', priority: 'high', ordered: '2024-01-18 10:00', doctor: 'Dr. Davis' },
          { id: 4, patient: 'Sarah Wilson', test: 'Glucose Test', priority: 'urgent', ordered: '2024-01-18 10:30', doctor: 'Dr. Miller' }
        ]);
        setRecentResults([
          { id: 1, patient: 'Emma Davis', test: 'Blood Chemistry', completed: '2024-01-18 11:00', status: 'completed', technician: 'Tech A' },
          { id: 2, patient: 'Robert Lee', test: 'Urinalysis', completed: '2024-01-18 10:45', status: 'reviewed', technician: 'Tech B' },
          { id: 3, patient: 'Lisa Chen', test: 'Microbiology', completed: '2024-01-18 10:30', status: 'pending_review', technician: 'Tech C' }
        ]);
        setEquipment([
          { id: 1, name: 'Hematology Analyzer', status: 'active', lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10' },
          { id: 2, name: 'Chemistry Analyzer', status: 'maintenance', lastMaintenance: '2024-01-15', nextMaintenance: '2024-01-18' },
          { id: 3, name: 'Microscope Station 1', status: 'active', lastMaintenance: '2024-01-08', nextMaintenance: '2024-02-08' },
          { id: 4, name: 'Centrifuge Unit 2', status: 'offline', lastMaintenance: '2024-01-12', nextMaintenance: '2024-01-19' }
        ]);
      } catch (error) {
        toast.error('Failed to load lab data');
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Laboratory Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}. Current lab capacity: {labData.dailyCapacity.current}/{labData.dailyCapacity.maximum}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
           
            <span>Process Test</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Equipment Status
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold mb-1">{labData.pendingTests}</p>
          <p className="text-amber-100">Tests in Queue</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TestTube className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">{labData.completedToday}</p>
          <p className="text-green-100">Completed Tests</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{labData.totalReports}</p>
          <p className="text-blue-100">Reports Generated</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Urgent</span>
          </div>
          <p className="text-3xl font-bold mb-1">{labData.urgentTests}</p>
          <p className="text-red-100">Priority Tests</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tests */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-purple-600" />
            Pending Tests
          </h2>
          <div className="space-y-4">
            {pendingTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    test.priority === 'urgent' ? 'bg-red-500 animate-pulse' :
                    test.priority === 'high' ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{test.patient}</p>
                    <p className="text-sm text-gray-600">{test.test}</p>
                    <p className="text-xs text-gray-400">Ordered by {test.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(test.priority)}`}>
                    {test.priority}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{test.ordered}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              Equipment Status
            </h3>
            <div className="space-y-3">
              {equipment.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Next: {item.nextMaintenance}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active Equipment</span>
                <span className="font-medium text-green-600">{labData.equipmentStatus.active}/15</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Capacity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Load</span>
                <span className="font-medium">{labData.dailyCapacity.current}/{labData.dailyCapacity.maximum}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(labData.dailyCapacity.current / labData.dailyCapacity.maximum) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{Math.round((labData.dailyCapacity.current / labData.dailyCapacity.maximum) * 100)}%</span>
                <span>{labData.dailyCapacity.maximum}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-600" />
          Recent Test Results
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Test Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Technician</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{result.patient}</td>
                  <td className="py-3 px-4 text-gray-600">{result.test}</td>
                  <td className="py-3 px-4 text-gray-600">{result.completed}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(result.status)}`}>
                      {result.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{result.technician}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;