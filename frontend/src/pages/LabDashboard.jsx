import React, { useEffect, useState } from 'react';
import { Clock, TestTube, FileText, AlertTriangle, Settings, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { labApi } from '../services/api';
import toast from 'react-hot-toast';
import CompleteTestForm from '../components/CompleteTestForm';
import TestDetailsModal from '../components/TestDetailsModal';
import SpecimenModal from '../components/SpecimenModal';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import { Download, Scan } from 'lucide-react';

const LabDashboard = () => {
    const { user } = useAuth();
    const [labData, setLabData] = useState({
        pendingTests: 0,
        completedToday: 0,
        totalReports: 0,
        urgentTests: 0,
        equipmentStatus: { active: 0, maintenance: 0, offline: 0 },
        dailyCapacity: { current: 0, maximum: 0 }
    });
    const [pendingTests, setPendingTests] = useState([]);
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [viewingReport, setViewingReport] = useState(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showSpecimenModal, setShowSpecimenModal] = useState(false);
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleExportWorklist = () => {
        const data = pendingTests.map(t => ({
            Patient: t.patient?.name,
            Test: t.testType,
            Priority: t.priority,
            Status: t.status,
            Ordered: new Date(t.createdAt).toLocaleString()
        }));
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `worklist_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        toast.success('Worklist exported successfully');
    };

    const filteredWorklist = pendingTests.filter(test =>
        test.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchLabData = async () => {
        try {
            setLoading(true);
            const response = await labApi.getDashboardStats();
            if (response.success) {
                const { labData, pendingTests, recentResults } = response.data;
                setLabData(labData);
                setPendingTests(pendingTests || []);
                setRecentResults(recentResults || []);
            }
        } catch (error) {
            console.error('Error fetching lab data:', error);
            toast.error('Failed to load lab data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabData();
    }, []);

    const handleUpdateStatus = async (testId, status) => {
        if (status === 'collected') {
            const test = pendingTests.find(t => t._id === testId);
            setSelectedTest(test);
            setShowSpecimenModal(true);
            return;
        }

        try {
            const response = await labApi.updateTestStatus(testId, status);
            if (response.success) {
                toast.success(`Status updated to ${status}`);
                fetchLabData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onSpecimenSuccess = async (specimenData) => {
        try {
            const response = await labApi.recordSpecimen(selectedTest._id, specimenData);
            if (response.success) {
                toast.success('Specimen recorded and status updated');
                setShowSpecimenModal(false);
                setSelectedTest(null);
                fetchLabData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleProcessTest = (test) => {
        setSelectedTest(test);
        setShowCompleteModal(true);
    };

    const onCompleteSuccess = () => {
        setShowCompleteModal(false);
        setSelectedTest(null);
        fetchLabData();
    };

    const handleBarcodeSuccess = (test) => {
        setShowScannerModal(false);
        setSelectedTest(test);
        if (test.status === 'ordered') {
            setShowSpecimenModal(true);
        } else if (test.status === 'collected' || test.status === 'processing') {
            setShowCompleteModal(true);
        } else {
            toast.success(`Order ${test.barcode} is ${test.status}`);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    const getRawStatusColor = (status) => {
        switch (status) {
            case 'ordered': return 'text-yellow-600 bg-yellow-50';
            case 'collected': return 'text-blue-600 bg-blue-50';
            case 'processing': return 'text-purple-600 bg-purple-50';
            case 'completed': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    if (loading && !showCompleteModal && !viewingReport) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Laboratory Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user?.name}. Capacity: {labData.dailyCapacity.current}/{labData.dailyCapacity.maximum}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            const next = filteredWorklist.find(t => t.status !== 'completed');
                            if (next) handleProcessTest(next);
                            else toast('Worklist completed!', { icon: '🎉' });
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 flex items-center gap-2 text-xs font-bold uppercase transition-all"
                    >
                        <Plus className="w-4 h-4" /> Process Next Case
                    </button>
                    <button
                        onClick={() => setShowScannerModal(true)}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white shadow-sm flex items-center gap-2 text-xs font-bold uppercase transition-all"
                    >
                        <Scan className="w-4 h-4 text-purple-600" /> Scan Tube
                    </button>
                    <button onClick={handleExportWorklist} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 bg-white shadow-sm flex items-center gap-2 text-xs font-bold uppercase transition-all">
                        <Download className="w-4 h-4 text-blue-600" /> Export List
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 opacity-20" />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{labData.pendingTests}</span>
                    </div>
                    <p className="text-2xl font-bold">Pending</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <TestTube className="w-8 h-8 opacity-20" />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{labData.completedToday}</span>
                    </div>
                    <p className="text-2xl font-bold">Today</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-8 h-8 opacity-20" />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{labData.totalReports}</span>
                    </div>
                    <p className="text-2xl font-bold">Generated</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="w-8 h-8 opacity-20" />
                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{labData.urgentTests}</span>
                    </div>
                    <p className="text-2xl font-bold">Priority</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pending Worklist</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search patient or test..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredWorklist.map((test) => (
                            <div key={test._id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-1 h-12 rounded-full ${test.priority === 'urgent' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 uppercase text-sm">{test.patient?.name || 'Unknown'}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-purple-600">{test.testType}</p>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black ${getRawStatusColor(test.status)}`}>{test.status}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                                            Ordered By: <span className="text-gray-600">Dr. {test.orderedBy?.name || 'Staff'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={test.status}
                                        onChange={(e) => handleUpdateStatus(test._id, e.target.value)}
                                        className="text-[10px] font-bold uppercase bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none"
                                    >
                                        <option value="ordered">Ordered</option>
                                        <option value="collected">Collected</option>
                                        <option value="processing">Processing</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => handleProcessTest(test)}
                                        className="bg-purple-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg shadow-sm hover:bg-purple-700 active:scale-95 transition-all"
                                    >
                                        Finalize
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Lab Capacity</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-black text-gray-900">{labData.dailyCapacity.current}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Tests Run Today</p>
                                </div>
                                <p className="text-xs font-black text-gray-400 uppercase">Limit: {labData.dailyCapacity.maximum}</p>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-1000" style={{ width: `${(labData.dailyCapacity.current / labData.dailyCapacity.maximum) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                            <Settings className="w-4 h-4 mr-2" /> Equip. Monitor
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-[10px] font-black text-green-600 uppercase transition-all">Active</p>
                                <p className="text-xl font-black text-green-900">{labData.equipmentStatus.active}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <p className="text-[10px] font-black text-yellow-600 uppercase transition-all">Maint.</p>
                                <p className="text-xl font-black text-yellow-900">{labData.equipmentStatus.maintenance}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100 col-span-2">
                                <p className="text-[10px] font-black text-red-600 uppercase transition-all">Offline Units</p>
                                <p className="text-xl font-black text-red-900">{labData.equipmentStatus.offline}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" /> Recent Activity
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                <th className="text-left pb-4 px-4">Patient</th>
                                <th className="text-left pb-4 px-4">Test</th>
                                <th className="text-left pb-4 px-4">Result</th>
                                <th className="text-right pb-4 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentResults.map((result) => (
                                <tr key={result._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-gray-900 text-sm">{result.patient?.name || 'Unknown'}</td>
                                    <td className="py-4 px-4 font-bold text-gray-500 text-xs">{result.testType}</td>
                                    <td className="py-4 px-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${result.overallResult === 'normal' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                            {result.overallResult || 'COMPLETED'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button onClick={() => setViewingReport(result)} className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCompleteModal && selectedTest && (
                <CompleteTestForm test={selectedTest} onClose={() => { setShowCompleteModal(false); setSelectedTest(null); }} onSuccess={onCompleteSuccess} />
            )}
            {showSpecimenModal && selectedTest && (
                <SpecimenModal test={selectedTest} onClose={() => { setShowSpecimenModal(false); setSelectedTest(null); }} onSuccess={onSpecimenSuccess} />
            )}
            {viewingReport && (
                <TestDetailsModal result={viewingReport} onClose={() => setViewingReport(null)} />
            )}
            {showScannerModal && (
                <BarcodeScannerModal
                    onClose={() => setShowScannerModal(false)}
                    onScanSuccess={handleBarcodeSuccess}
                />
            )}
        </div>
    );
};

export default LabDashboard;