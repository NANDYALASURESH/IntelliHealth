import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';

const PrescriptionForm = ({ patientId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [medications, setMedications] = useState([{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    }]);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    const handleMedicationChange = (index, field, value) => {
        const newMedications = [...medications];
        newMedications[index][field] = value;
        setMedications(newMedications);
    };

    const addMedication = () => {
        setMedications([...medications, {
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        }]);
    };

    const removeMedication = (index) => {
        if (medications.length > 1) {
            const newMedications = medications.filter((_, i) => i !== index);
            setMedications(newMedications);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await doctorApi.createPrescription({
                patientId,
                medications,
                diagnosis,
                instructions: notes
            });

            if (response.success) {
                toast.success('Prescription created successfully');
                onSuccess?.();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">Write Prescription</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Acute Bronchitis"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Medications</label>
                            <button
                                type="button"
                                onClick={addMedication}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Drug
                            </button>
                        </div>

                        {medications.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3 relative group">
                                {medications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMedication(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        placeholder="Drug Name"
                                        value={med.name}
                                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        placeholder="Dosage (e.g. 500mg)"
                                        value={med.dosage}
                                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        placeholder="Frequency (e.g. 1-0-1)"
                                        value={med.frequency}
                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        placeholder="Duration (e.g. 5 days)"
                                        value={med.duration}
                                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <input
                                    placeholder="Instructions (e.g. After food)"
                                    value={med.instructions}
                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dietary restrictions, lifestyle advice, etc."
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
                            {loading ? 'Creating...' : 'Create Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionForm;
