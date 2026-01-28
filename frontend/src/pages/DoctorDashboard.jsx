import React, { useEffect, useState } from 'react';
import { Calendar, Users, Activity, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [statsRes, appointmentsRes, patientsRes] = await Promise.all([
          doctorApi.getDashboardStats(),
          doctorApi.getAppointments(),
          doctorApi.getPatients()
        ]);

        if (statsRes.success) {
          setStats(statsRes.data.stats);
          setLabResults(statsRes.data.recentLabResults || []);
        }

        if (appointmentsRes.success) {
          setAppointments(appointmentsRes.data.appointments);
        }

        if (patientsRes.success) {
          setPatients(patientsRes.data.patients);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
              <div key={appointment._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {appointment.patient?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'NA'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient?.name || 'Unknown Patient'}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.scheduledTime}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Lab Results */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            Recent Lab Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labResults.map((result) => (
              <div
                key={result._id}
                onClick={() => navigate('/doctor/patients', { state: { selectedPatientId: result.patient?._id } })}
                className="p-4 bg-purple-50 rounded-xl border border-purple-100 cursor-pointer hover:bg-purple-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-gray-900 group-hover:text-purple-900">{result.patient?.name}</p>
                  <span className="text-[10px] bg-white text-purple-600 px-2 py-0.5 rounded-full font-bold border border-purple-200 uppercase">New Report</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{result.testType}</p>
                <div className="mt-2 text-[10px] text-gray-500 font-medium flex justify-between">
                  <span>Result: <span className={result.overallResult === 'normal' ? 'text-green-600' : 'text-red-600'}>{result.overallResult?.toUpperCase() || 'COMPLETED'}</span></span>
                  <span>{new Date(result.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {labResults.length === 0 && (
              <p className="text-gray-500 italic py-4">No new lab results this week.</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Recent Patients
          </h2>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => navigate('/doctor/patients', { state: { selectedPatientId: patient._id } })}
                className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.lastAppointment?.status || 'default')}`}>
                    {patient.lastAppointment?.status || 'No visits'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{patient.email}</p>
                <p className="text-xs text-gray-400">
                  Last visit: {patient.lastAppointment ? new Date(patient.lastAppointment.scheduledDate).toLocaleDateString() : 'Never'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;