import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Heart, Clock, User, FileText, Activity, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../services/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    recentTests: 0,
    healthScore: 0,
    nextAppointment: null,
    vitalSigns: {
      heartRate: 0,
      bloodPressure: '',
      temperature: 0,
      weight: 0
    }
  });

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [booking, setBooking] = useState({
    doctor: '',
    scheduledDate: '',
    scheduledTime: '',
    type: 'consultation',
    reasonForVisit: ''
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [dashboardRes, doctorsRes] = await Promise.all([
          apiRequest('/patient/dashboard-stats'),
          apiRequest('/patient/doctors')
        ]);
        const res = dashboardRes;
        const payload = res?.data || res;

        if (payload?.healthData) setHealthData(payload.healthData);
        if (payload?.appointments) setAppointments(payload.appointments);
        if (payload?.prescriptions) setPrescriptions(payload.prescriptions);
        if (payload?.labResults) setLabResults(payload.labResults);

        const doctorsData = doctorsRes?.data || doctorsRes;
        if (doctorsData?.doctors) setDoctors(doctorsData.doctors);
      } catch (error) {
        toast.error(error.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleOpenBook = () => setShowBookModal(true);
  const handleCloseBook = () => {
    setShowBookModal(false);
    setBooking({ doctor: '', scheduledDate: '', scheduledTime: '', type: 'consultation', reasonForVisit: '' });
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!booking.doctor || !booking.scheduledDate || !booking.scheduledTime || !booking.type || !booking.reasonForVisit) {
      toast.error('Please fill all fields');
      return;
    }
    setBookingSubmitting(true);
    try {
      await apiRequest('/patient/appointments', {
        method: 'POST',
        body: JSON.stringify(booking),
      });
      toast.success('Appointment booked');
      handleCloseBook();
      // Refresh dashboard data
      setLoading(true);
      const [dashboardRes, doctorsRes] = await Promise.all([
        apiRequest('/patient/dashboard-stats'),
        apiRequest('/patient/doctors')
      ]);
      const res = dashboardRes;
      const payload = res?.data || res;
      if (payload?.healthData) setHealthData(payload.healthData);
      if (payload?.appointments) setAppointments(payload.appointments);
      if (payload?.prescriptions) setPrescriptions(payload.prescriptions);
      if (payload?.labResults) setLabResults(payload.labResults);

      const doctorsData = doctorsRes?.data || doctorsRes;
      if (doctorsData?.doctors) setDoctors(doctorsData.doctors);
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
      setBookingSubmitting(false);
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

  // Add this inside your PatientDashboard.jsx or in a separate file and import it

  const StatCard = ({ icon, label, count, badge }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{count}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {badge && (
            <span className="inline-block mt-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </div>
    );
  };
  const VitalSignsCard = ({ vitals }) => {
    const bp = vitals?.bloodPressure;
    const bpText = typeof bp === 'object' && bp !== null
      ? `${bp?.systolic ?? '-'} / ${bp?.diastolic ?? '-'}`
      : (bp ?? '—');

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Heart Rate:</strong> {vitals?.heartRate ?? '—'} BPM</li>
          <li><strong>Blood Pressure:</strong> {bpText}</li>
          <li><strong>Temperature:</strong> {vitals?.temperature ?? '—'}</li>
          <li><strong>Weight:</strong> {vitals?.weight ?? '—'}</li>
        </ul>
      </div>
    );
  };
  const QuickActions = () => {
    const navigate = useNavigate();
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <button
          onClick={() => navigate('/patient/prescriptions')}
          className="w-full py-2 px-4 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Request Prescription Refill
        </button>
        <button
          onClick={() => navigate('/messages')}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Contact Doctor
        </button>
      </div>
    );
  };


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Health Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your health overview.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleOpenBook} className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Emergency Contact
          </button>
        </div>
      </div>
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Book Appointment</h3>
              <button onClick={handleCloseBook} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitBooking} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                <select name="doctor" value={booking.doctor} onChange={handleBookChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="scheduledDate" value={booking.scheduledDate} onChange={handleBookChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" name="scheduledTime" value={booking.scheduledTime} onChange={handleBookChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" value={booking.type} onChange={handleBookChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="check-up">Check-up</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                <textarea name="reasonForVisit" value={booking.reasonForVisit} onChange={handleBookChange} rows={3} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Describe your symptoms or purpose" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={handleCloseBook} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={bookingSubmitting} className={`px-4 py-2 rounded-lg text-white ${bookingSubmitting ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}>{bookingSubmitting ? 'Booking...' : 'Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEALTH SCORE & NEXT APPOINTMENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Overall</span>
          </div>
          <p className="text-3xl font-bold mb-1">{healthData.healthScore}%</p>
          <p className="text-emerald-100">Health Score</p>
          <div className="mt-3 w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${healthData.healthScore}%` }}></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Next Appointment
          </h3>
          {healthData.nextAppointment ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {typeof healthData.nextAppointment.doctor === 'object'
                      ? `Dr. ${healthData.nextAppointment.doctor?.name}`
                      : healthData.nextAppointment.doctor}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(healthData.nextAppointment.scheduledDate).toLocaleDateString()} at {healthData.nextAppointment.scheduledTime}
                  </p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">View Details</button>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Calendar className="text-blue-600" />} label="Appointments" count={healthData.upcomingAppointments} badge="Upcoming" />
        <StatCard icon={<FileText className="text-green-600" />} label="Prescriptions" count={healthData.activePrescriptions} badge="Active" />
        <StatCard icon={<Activity className="text-purple-600" />} label="Lab Results" count={healthData.recentTests} badge="Recent" />
        <StatCard icon={<Heart className="text-red-600" />} label="Heart Rate" count={`${healthData.vitalSigns.heartRate} BPM`} badge="Vitals" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Appointments
          </h2>
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dr. {a.doctor?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{a.doctor?.specialization || 'General'} • {a.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{new Date(a.scheduledDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{a.scheduledTime}</p>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Recent Lab Results */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            Recent Lab Reports
          </h2>
          <div className="space-y-4">
            {labResults.map((result) => (
              <div key={result._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{result.testType}</p>
                    <p className="text-sm text-gray-500">Ordered by Dr. {result.orderedBy?.name || 'Physician'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${result.overallResult === 'normal' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.overallResult?.toUpperCase() || 'COMPLETED'}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(result.reportDate || result.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {labResults.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent lab reports</p>
            )}
          </div>
        </div>

        {/* Right Panel: Vitals and Quick Actions */}
        <div className="space-y-6">
          <VitalSignsCard vitals={healthData.vitalSigns} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;




