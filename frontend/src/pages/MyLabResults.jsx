import React, { useState, useEffect } from 'react';
import { Activity, Download, Calendar, User, TrendingUp, AlertCircle } from 'lucide-react';
import { apiRequest } from '../services/api';
import toast from 'react-hot-toast';

const MyLabResults = () => {
    const [labResults, setLabResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    useEffect(() => {
        fetchLabResults();
    }, []);

    const fetchLabResults = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/patient/lab-results');
            if (response.success) {
                setLabResults(response.data?.items || []);
            }
        } catch (error) {
            toast.error('Failed to load lab results');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = labResults.filter(result => {
        if (filter === 'all') return true;
        const isPending = ['ordered', 'collected', 'processing'].includes(result.status);
        if (filter === 'pending') return isPending;
        if (filter === 'completed') return result.status === 'completed';
        return true;
    });

    const getStatusColor = (status) => {
        const colors = {
            ordered: 'bg-yellow-100 text-yellow-800',
            collected: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getFlagColor = (flag) => {
        const colors = {
            normal: 'text-green-600',
            high: 'text-red-600',
            low: 'text-blue-600',
            critical: 'text-red-700 font-bold'
        };
        return colors[flag] || 'text-gray-600';
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
                    <h1 className="text-3xl font-bold text-gray-800">My Lab Results</h1>
                    <p className="text-gray-600">View your test results and reports</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Results</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Lab Results List */}
            <div className="space-y-4">
                {filteredResults.map((result) => (
                    <div
                        key={result._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Result Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{result.testType}</h3>
                                    <p className="text-sm text-gray-500">
                                        Ordered by: Dr. {result.orderedBy?.name || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                                    {result.status}
                                </span>
                                {result.status === 'completed' && (
                                    <button
                                        onClick={() => window.print()}
                                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors print:hidden"
                                        title="Download report"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Result Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Ordered: {new Date(result.createdAt).toLocaleDateString()}</span>
                            </div>
                            {result.reportDate && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Completed: {new Date(result.reportDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <span>Priority: {result.priority || 'routine'}</span>
                            </div>
                        </div>

                        {/* Test Parameters */}
                        {result.status === 'completed' && result.testParameters && result.testParameters.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Test Parameters</h4>
                                <div className="space-y-2">
                                    {result.testParameters.map((param, index) => (
                                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900">{param.parameter}</h5>
                                                    <p className="text-sm text-gray-500">Normal Range: {param.normalRange}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${getFlagColor(param.flag)}`}>
                                                        {param.value} {param.unit}
                                                    </p>
                                                    <span className={`text-xs font-semibold ${getFlagColor(param.flag)}`}>
                                                        {param.flag?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overall Result */}
                        {result.overallResult && (
                            <div className={`mt-4 rounded-lg p-3 ${result.overallResult === 'normal' ? 'bg-green-50' :
                                result.overallResult === 'abnormal' ? 'bg-red-50' : 'bg-yellow-50'
                                }`}>
                                <p className={`text-sm font-medium ${result.overallResult === 'normal' ? 'text-green-900' :
                                    result.overallResult === 'abnormal' ? 'text-red-900' : 'text-yellow-900'
                                    }`}>
                                    Overall Result: {result.overallResult.toUpperCase()}
                                </p>
                            </div>
                        )}

                        {/* Interpretation */}
                        {result.interpretation && (
                            <div className="mt-4 bg-blue-50 rounded-lg p-3">
                                <p className="text-sm text-blue-900">
                                    <span className="font-medium">Interpretation:</span> {result.interpretation}
                                </p>
                            </div>
                        )}

                        {/* Specimen Info */}
                        {result.specimen && (
                            <div className="mt-4 text-sm text-gray-600">
                                <span className="font-medium">Specimen:</span> {result.specimen.type} collected on{' '}
                                {new Date(result.specimen.collectionDate).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredResults.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No lab results found</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{labResults.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {labResults.filter(r => ['ordered', 'collected', 'processing'].includes(r.status)).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {labResults.filter(r => r.status === 'completed').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyLabResults;
