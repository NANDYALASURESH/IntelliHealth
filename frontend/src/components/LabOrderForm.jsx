import React, { useState } from 'react';
import { X, TestTube, AlertCircle } from 'lucide-react';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';

const LabOrderForm = ({ patientId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        testType: '',
        testCategory: 'blood',
        priority: 'routine',
        notes: ''
    });

    const testCategories = [
        { value: 'blood', label: 'Blood Test' },
        { value: 'urine', label: 'Urine Analysis' },
        { value: 'imaging', label: 'Imaging (X-Ray/CT/MRI)' },
        { value: 'biopsy', label: 'Biopsy' },
        { value: 'culture', label: 'Culture' },
        { value: 'genetic', label: 'Genetic Testing' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.testType.trim()) {
            toast.error('Please specify the test type');
            return;
        }

        try {
            setLoading(true);
            const response = await doctorApi.orderLabTest({
                patientId,
                ...formData
            });

            if (response.success) {
                toast.success('Lab test ordered successfully');
                // Could trigger a notification to lab here via socket in future
                onSuccess?.();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to order lab test');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <TestTube className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Order Lab Test</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Category</label>
                        <select
                            value={formData.testCategory}
                            onChange={(e) => setFormData({ ...formData, testCategory: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            {testCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Name/Type</label>
                        <input
                            type="text"
                            value={formData.testType}
                            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="e.g. Complete Blood Count (CBC)"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <div className="flex gap-4">
                            {['routine', 'urgent', 'stat'].map((priority) => (
                                <label key={priority} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={priority}
                                        checked={formData.priority === priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 capitalize">
                                        {priority === 'stat' ? 'STAT (Emergency)' : priority}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes / Instructions</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="Any specific instructions for the lab..."
                        />
                    </div>

                    {formData.priority !== 'routine' && (
                        <div className="bg-amber-50 p-3 rounded-lg flex items-start gap-2 text-sm text-amber-800 border border-amber-200">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>Urgent/STAT requests will be flagged for immediate attention by the laboratory.</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium flex items-center shadow-md hover:shadow-lg transform active:scale-95 duration-200"
                        >
                            {loading ? 'Ordering...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LabOrderForm;
