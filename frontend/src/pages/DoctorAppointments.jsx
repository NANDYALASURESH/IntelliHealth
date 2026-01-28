import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await doctorApi.getAppointments();
            if (res.success) {
                setAppointments(res.data.appointments);
            }
        } catch (error) {
            toast.error('Failed to load appointments');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await doctorApi.updateAppointmentStatus(id, newStatus);
            if (res.success) {
                toast.success(`Appointment ${newStatus}`);
                fetchAppointments(); // Refresh list
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const otherAppointments = appointments.filter(a => a.status !== 'pending');

    const filteredAppointments = filter === 'pending' ? pendingAppointments
        : filter === 'today' ? appointments.filter(a => {
            const today = new Date().toISOString().split('T')[0];
            return a.scheduledDate.startsWith(today);
        })
            : otherAppointments;

    if (loading) {
        return <div className="p-6 text-center">Loading appointments...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-600">Manage your patient schedule</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                    >
                        Confirmed
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border'}`}
                    >
                        <span>Pending Requests</span>
                        {pendingAppointments.length > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingAppointments.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Pending Requests Section */}
            {filter !== 'today' && pendingAppointments.length > 0 && (filter === 'all' || filter === 'pending') && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Pending Appointment Requests
                    </h2>
                    <div className="grid gap-4">
                        {pendingAppointments.map(appt => (
                            <div key={appt._id} className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100 flex flex-col md:flex-row justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{appt.patient?.name || 'Unknown Patient'}</h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(appt.scheduledDate).toLocaleDateString()}</span>
                                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {appt.scheduledTime}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Reason: {appt.reasonForVisit}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-3 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Decline
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">
                    {filter === 'pending' ? 'Pending Requests' : 'Upcoming & Past Appointments'}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(filter === 'pending' ? pendingAppointments : otherAppointments).map((appt) => (
                                <tr key={appt._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{appt.patient?.name}</div>
                                                <div className="text-sm text-gray-500">{appt.patient?.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{new Date(appt.scheduledDate).toLocaleDateString()}</div>
                                        <div className="text-sm text-gray-500">{appt.scheduledTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {appt.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                    appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {appt.status === 'confirmed' && (
                                            <button onClick={() => handleStatusUpdate(appt._id, 'completed')} className="text-blue-600 hover:text-blue-900 mr-3">Complete</button>
                                        )}
                                        {appt.status !== 'cancelled' && (
                                            <button onClick={() => handleStatusUpdate(appt._id, 'cancelled')} className="text-red-600 hover:text-red-900">Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(filter === 'pending' ? pendingAppointments : otherAppointments).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorAppointments;
