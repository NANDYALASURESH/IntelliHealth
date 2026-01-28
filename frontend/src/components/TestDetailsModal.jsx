import React from 'react';
import { X, FileText, Activity, Layers, Calendar, User } from 'lucide-react';

const TestDetailsModal = ({ result, onClose }) => {
    if (!result) return null;

    const getFlagColor = (flag) => {
        switch (flag) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'low': return 'text-blue-600 bg-blue-50';
            case 'critical': return 'text-white bg-red-500 shadow-sm';
            default: return 'text-green-600 bg-green-50';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{result.testType} Report</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">ID: {result._id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Patient & Doctor Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Patient</p>
                                <p className="font-bold text-gray-900">{result.patient?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{result.patient?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Dates</p>
                                <p className="text-sm font-medium text-gray-900">Ordered: {new Date(result.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm font-medium text-green-600">Completed: {new Date(result.reportDate || result.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-purple-500" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase">Clinical Findings</h3>
                        </div>
                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Parameter</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center">Result</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">Reference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(result.testParameters || []).map((param, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-gray-900">{param.parameter}</p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black text-gray-900">{param.value} {param.unit}</span>
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black mt-1 ${getFlagColor(param.flag)}`}>
                                                        {param.flag}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <p className="text-xs text-gray-400 font-medium">{param.normalRange || 'N/A'}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Interpretation */}
                    {result.interpretation && (
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-4 h-4 text-blue-500" />
                                <h4 className="text-[10px] font-bold text-blue-500 uppercase">Medical Interpretation</h4>
                            </div>
                            <p className="text-sm text-blue-900 leading-relaxed italic">"{result.interpretation}"</p>
                        </div>
                    )}

                    {/* Footer / Status */}
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                        <span>Technician: Lab Tech A1</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Officially Summarized</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestDetailsModal;
