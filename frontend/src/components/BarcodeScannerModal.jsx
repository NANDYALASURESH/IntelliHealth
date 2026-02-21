import React, { useState } from 'react';
import { X, Scan, Search, AlertCircle } from 'lucide-react';
import { labApi } from '../services/api';
import toast from 'react-hot-toast';

const BarcodeScannerModal = ({ onClose, onScanSuccess }) => {
    const [barcode, setBarcode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        try {
            setLoading(true);
            setError('');
            const response = await labApi.getByBarcode(barcode.trim());

            if (response.success) {
                toast.success('Order found!');
                onScanSuccess(response.data.result);
            } else {
                setError(response.message || 'No lab order found for this barcode');
            }
        } catch (err) {
            setError('Error searching for barcode. Please try again.');
            console.error('Barcode scan error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
                            <Scan className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Specimen Scanner</h2>
                            <p className="text-xs text-gray-500 font-medium">Scan or enter tube barcode</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <div className="inline-block p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-4">
                            <div className="w-48 h-12 bg-white rounded border border-gray-300 flex items-center justify-center space-x-1 px-4">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-8 bg-gray-800"
                                        style={{ width: `${Math.random() * 3 + 1}px` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Align the barcode with the scanner beam or enter the ID manually below.
                        </p>
                    </div>

                    <form onSubmit={handleScan} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Barcode ID
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    placeholder="e.g. LAB-12345678"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono"
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !barcode.trim()}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg transition-all active:scale-[0.98] ${loading || !barcode.trim()
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-200'
                                }`}
                        >
                            {loading ? 'Searching...' : 'Find Order'}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center">
                    Scanner System v2.4.0 Active • Secure Connection
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerModal;
