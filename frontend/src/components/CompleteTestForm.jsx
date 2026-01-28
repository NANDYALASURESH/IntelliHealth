import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { labApi } from '../services/api';
import toast from 'react-hot-toast';

const CompleteTestForm = ({ test, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        overallResult: 'normal',
        interpretation: '',
        isAbnormal: false,
        isCritical: false,
        testParameters: [
            { parameter: '', value: '', unit: '', normalRange: '', flag: 'normal' }
        ]
    });

    const handleParamChange = (index, field, value) => {
        const newParams = [...formData.testParameters];
        newParams[index][field] = value;
        setFormData({ ...formData, testParameters: newParams });
    };

    const addParameter = () => {
        setFormData({
            ...formData,
            testParameters: [
                ...formData.testParameters,
                { parameter: '', value: '', unit: '', normalRange: '', flag: 'normal' }
            ]
        });
    };

    const removeParameter = (index) => {
        if (formData.testParameters.length === 1) return;
        const newParams = formData.testParameters.filter((_, i) => i !== index);
        setFormData({ ...formData, testParameters: newParams });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.testParameters.some(p => !p.parameter || !p.value)) {
            toast.error('Please fill in all parameter names and values');
            return;
        }

        try {
            setLoading(true);
            const response = await labApi.completeLabTest(test._id, formData);

            if (response.success) {
                toast.success('Lab test results recorded successfully');
                onSuccess?.();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to complete test');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Enter Test Results</h2>
                            <p className="text-xs text-gray-500">{test.testType} - {test.patient?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Parameters Table */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Test Parameters</h3>
                            <button
                                type="button"
                                onClick={addParameter}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Parameter
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.testParameters.map((param, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-xl relative group">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Parameter</label>
                                        <input
                                            type="text"
                                            value={param.parameter}
                                            onChange={(e) => handleParamChange(index, 'parameter', e.target.value)}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                                            placeholder="e.g. Hemoglobin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Value</label>
                                        <input
                                            type="text"
                                            value={param.value}
                                            onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                                            placeholder="14.5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unit</label>
                                        <input
                                            type="text"
                                            value={param.unit}
                                            onChange={(e) => handleParamChange(index, 'unit', e.target.value)}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                                            placeholder="g/dL"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Flag</label>
                                        <select
                                            value={param.flag}
                                            onChange={(e) => handleParamChange(index, 'flag', e.target.value)}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                            <option value="low">Low</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeParameter(index)}
                                            className="p-2 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                                            title="Remove parameter"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overall Result</label>
                            <select
                                value={formData.overallResult}
                                onChange={(e) => setFormData({ ...formData, overallResult: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="normal">Normal</option>
                                <option value="abnormal">Abnormal</option>
                                <option value="critical">Critical</option>
                                <option value="inconclusive">Inconclusive</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-6 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAbnormal}
                                    onChange={(e) => setFormData({ ...formData, isAbnormal: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Flag Abnormal</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isCritical}
                                    onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-600"
                                />
                                <span className="text-sm font-medium text-gray-700">Flag Critical</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interpretation / Technician Notes</label>
                        <textarea
                            value={formData.interpretation}
                            onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Clinical interpretation of findings..."
                        />
                    </div>

                    {formData.isCritical && (
                        <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-900">Critical Result Notification</p>
                                <p className="text-xs text-red-700">Marking this as critical will trigger an immediate alert to the ordering physician.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Complete & Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteTestForm;
