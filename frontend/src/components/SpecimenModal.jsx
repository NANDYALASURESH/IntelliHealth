import React, { useState } from 'react';
import { X, Beaker, User, Weight, Activity } from 'lucide-react';

const SpecimenModal = ({ test, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        type: '',
        volume: '',
        condition: 'Good',
        collectedBy: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        onSuccess(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Beaker className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Record Specimen</h2>
                            <p className="text-xs text-gray-500 font-bold uppercase">{test.testType}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Specimen Type</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold"
                                placeholder="e.g. Whole Blood, Urine"
                            />
                            <Beaker className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Volume</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.volume}
                                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold"
                                    placeholder="5ml"
                                />
                                <Weight className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Condition</label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold"
                            >
                                <option value="Good">Good</option>
                                <option value="Hemolyzed">Hemolyzed</option>
                                <option value="Clotted">Clotted</option>
                                <option value="Insufficient">Insufficient</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Collected By</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={formData.collectedBy}
                                onChange={(e) => setFormData({ ...formData, collectedBy: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold"
                                placeholder="Technician Name"
                            />
                            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all mt-4"
                    >
                        Save & Mark Collected
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SpecimenModal;
