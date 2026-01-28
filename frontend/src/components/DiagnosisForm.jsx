import React, { useState } from 'react';
import { X } from 'lucide-react';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';

const DiagnosisForm = ({ patientId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        recordType: 'diagnosis',
        diagnosis: { primary: '' },
        treatmentPlan: '',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await doctorApi.createMedicalRecord({
                patientId,
                ...formData
            });

            if (response.success) {
                toast.success('Diagnosis added successfully');
                onSuccess?.();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add diagnosis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add Diagnosis</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                        <select
                            value={formData.recordType}
                            onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="diagnosis">Diagnosis</option>
                            <option value="consultation">Consultation</option>
                            <option value="lab-result">Lab Result</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                        <input
                            type="text"
                            value={formData.diagnosis.primary}
                            onChange={(e) => setFormData({
                                ...formData,
                                diagnosis: { ...formData.diagnosis, primary: e.target.value }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Hypertension"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                        <textarea
                            value={formData.treatmentPlan}
                            onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the treatment plan..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any additional observations..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                        >
                            {loading ? 'Saving...' : 'Save Diagnosis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiagnosisForm;
