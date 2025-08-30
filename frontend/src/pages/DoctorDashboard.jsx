// src/components/dashboards/DoctorDashboard.js
import React, { useEffect, useState } from 'react';
import { Calendar, Users, Activity, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingDiagnoses: 0,
    completedToday: 0,
    weeklyStats: { appointments: 0, diagnoses: 0 },
    urgentCases: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          todayAppointments: 8,
          totalPatients: 156,
          pendingDiagnoses: 5,
          completedToday: 3,
          weeklyStats: { appointments: 45, diagnoses: 32 },
          urgentCases: 2
        });
        setAppointments([
          { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Consultation', status: 'confirmed' },
          { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'pending' },
          { id: 3, patient: 'Mike Johnson', time: '02:00 PM', type: 'Emergency', status: 'urgent' },
          { id: 4, patient: 'Sarah Wilson', time: '03:30 PM', type: 'Consultation', status: 'confirmed' }
        ]);
        setPatients([
          { id: 1, name: 'Emma Davis', condition: 'Diabetes', lastVisit: '2024-01-15', status: 'stable' },
          { id: 2, name: 'Robert Brown', condition: 'Hypertension', lastVisit: '2024-01-10', status: 'monitoring' },
          { id: 3, name: 'Lisa Anderson', condition: 'Asthma', lastVisit: '2024-01-08', status: 'critical' }
        ]);
      } catch (error) {
        toast.error('Failed to load doctor dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'stable': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, Dr. {user?.name}. You have {stats.todayAppointments} appointments today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-blue-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-700 transition-all duration-200 shadow-lg">
            New Diagnosis
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            View Calendar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Today</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.todayAppointments}</p>
          <p className="text-blue-100">Appointments</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalPatients}</p>
          <p className="text-green-100">Patients</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.pendingDiagnoses}</p>
          <p className="text-amber-100">Diagnoses</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Completed</span>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.completedToday}</p>
          <p className="text-purple-100">Today</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Today's Appointments
          </h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {appointment.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Recent Patients
          </h2>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{patient.condition}</p>
                <p className="text-xs text-gray-400">Last visit: {patient.lastVisit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;