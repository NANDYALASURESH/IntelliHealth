import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Eye, Calendar, User, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../services/api';

const MedicalRecords = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/medical-records/my');
            const data = response?.data || response;
            setRecords(data?.records || []);
        } catch (error) {
            toast.error(error.message || 'Failed to load medical records');
        } finally {
            setLoading(false);
        }
    };

    const getRecordTypeColor = (type) => {
        const colors = {
            diagnosis: 'bg-red-100 text-red-800',
            prescription: 'bg-blue-100 text-blue-800',
            'lab-result': 'bg-green-100 text-green-800',
            consultation: 'bg-purple-100 text-purple-800',
            imaging: 'bg-yellow-100 text-yellow-800',
            vaccination: 'bg-pink-100 text-pink-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const filterRecords = () => {
        if (filter === 'all') return records;
        return records.filter(record => record.recordType === filter);
    };

    const filteredRecords = filterRecords();

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
                <p className="text-gray-600 mt-1">Access your complete medical history</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                        {['all', 'diagnosis', 'prescription', 'lab-result', 'consultation', 'imaging'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No records found</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? "You don't have any medical records yet."
                                : `No ${filter} records found.`}
                        </p>
                    </div>
                ) : (
                    filteredRecords.map((record) => (
                        <div
                            key={record._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {/* Icon */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Record Details */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {record.title || 'Medical Record'}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {record.description || 'No description available'}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.recordType)}`}>
                                                {record.recordType?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </span>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                                                {new Date(record.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            {record.doctor && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <User className="w-4 h-4 mr-2 text-indigo-600" />
                                                    Dr. {record.doctor.name}
                                                </div>
                                            )}
                                        </div>

                                        {record.notes && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700">{record.notes}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center space-x-3">
                                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </button>
                                            {record.attachments && record.attachments.length > 0 && (
                                                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </button>
                                            )}
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

export default MedicalRecords;
