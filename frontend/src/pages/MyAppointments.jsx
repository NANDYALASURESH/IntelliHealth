import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, MapPin, Phone, Mail, Filter, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../services/api';

const MyAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/patient/appointments');
            const data = response?.data || response;
            setAppointments(data?.appointments || []);
        } catch (error) {
            toast.error(error.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            scheduled: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filterAppointments = () => {
        const now = new Date();
        return appointments.filter(apt => {
            const aptDate = new Date(apt.scheduledDate);

            switch (filter) {
                case 'upcoming':
                    return aptDate >= now && ['scheduled', 'confirmed'].includes(apt.status);
                case 'past':
                    return aptDate < now || apt.status === 'completed';
                case 'cancelled':
                    return apt.status === 'cancelled';
                default:
                    return true;
            }
        });
    };

    const filteredAppointments = filterAppointments();

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
                    <p className="text-gray-600 mt-1">View and manage your appointments</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex space-x-2">
                        {['all', 'upcoming', 'past', 'cancelled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? "You don't have any appointments yet."
                                : `No ${filter} appointments found.`}
                        </p>
                    </div>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <div
                            key={appointment._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Doctor Avatar */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <User className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Dr. {appointment.doctor?.name || 'Unknown'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {appointment.doctor?.specialization || 'General Physician'}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                                                {new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                                                {appointment.scheduledTime}
                                            </div>
                                        </div>

                                        {appointment.reasonForVisit && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Reason:</span> {appointment.reasonForVisit}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-3 flex items-center space-x-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {appointment.type?.charAt(0).toUpperCase() + appointment.type?.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
