import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, User, Pill, Clock, RefreshCw } from 'lucide-react';
import { prescriptionApi } from '../services/api';
import toast from 'react-hot-toast';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const [requestingRefill, setRequestingRefill] = useState(null); // id of prescription being refilled

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await prescriptionApi.listMy();
            if (response.success) {
                setPrescriptions(response.data?.prescriptions || []);
            }
        } catch (error) {
            toast.error('Failed to load prescriptions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestRefill = async (id) => {
        try {
            setRequestingRefill(id);
            const response = await prescriptionApi.requestRefill(id);
            if (response.success) {
                toast.success(response.message || 'Refill request processed');
                fetchPrescriptions(); // Refresh list to see updated refill counts
            }
        } catch (error) {
            toast.error('Failed to request refill');
            console.error(error);
        } finally {
            setRequestingRefill(null);
        }
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        if (filter === 'all') return true;
        if (filter === 'active') return prescription.status === 'active';
        if (filter === 'completed') return prescription.status === 'completed';
        return true;
    });

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
                    <p className="text-gray-600">View and manage your prescriptions</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Prescriptions</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                    <div
                        key={prescription._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Prescription Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Pill className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Prescription #{prescription._id?.slice(-6)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Dr. {prescription.doctor?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                                    {prescription.status}
                                </span>
                                <button
                                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Download prescription"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                {prescription.status === 'active' && (
                                    <button
                                        onClick={() => handleRequestRefill(prescription._id)}
                                        disabled={requestingRefill === prescription._id}
                                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${requestingRefill === prescription._id
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                            }`}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${requestingRefill === prescription._id ? 'animate-spin' : ''}`} />
                                        <span>{requestingRefill === prescription._id ? 'Processing...' : 'Request Refill'}</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Prescription Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Prescribed: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                            </div>
                            {prescription.appointment && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>Appointment: {new Date(prescription.appointment.scheduledDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Medications */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Medications</h4>
                            <div className="space-y-3">
                                {prescription.medications?.map((med, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium text-gray-900">{med.name}</h5>
                                            <span className="text-sm text-gray-600">{med.dosage}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Frequency:</span> {med.frequency}
                                            </div>
                                            <div>
                                                <span className="font-medium">Duration:</span> {med.duration}
                                            </div>
                                        </div>
                                        {med.instructions && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <span className="font-medium">Instructions:</span> {med.instructions}
                                            </p>
                                        )}
                                        <div className="mt-2 text-xs font-medium text-blue-600">
                                            Refills Remaining: {med.refills || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {prescription.notes && (
                            <div className="mt-4 bg-blue-50 rounded-lg p-3">
                                <p className="text-sm text-blue-900">
                                    <span className="font-medium">Doctor's Notes:</span> {prescription.notes}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredPrescriptions.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions found</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Prescriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active Prescriptions</p>
                    <p className="text-2xl font-bold text-green-600">
                        {prescriptions.filter(p => p.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-600">
                        {prescriptions.filter(p => p.status === 'completed').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyPrescriptions;
