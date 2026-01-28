import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DiagnosisForm from '../components/DiagnosisForm';
import LabOrderForm from '../components/LabOrderForm';
import { Search, User, Calendar, FileText, Activity, X, Eye, PlusCircle, Stethoscope, TestTube } from 'lucide-react';
import { doctorApi } from '../services/api';
import toast from 'react-hot-toast';
import PrescriptionForm from '../components/PrescriptionForm';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
    const [showLabOrderForm, setShowLabOrderForm] = useState(false);
    const location = useLocation();

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (location.state?.selectedPatientId && patients.length > 0) {
            const patient = patients.find(p => p._id === location.state.selectedPatientId);
            if (patient) {
                viewPatientDetails(patient);
            }
        }
    }, [patients, location.state]);

    useEffect(() => {
        filterPatients();
    }, [searchTerm, patients]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await doctorApi.getPatients();
            if (response.success) {
                setPatients(response.data.patients || []);
            }
        } catch (error) {
            toast.error('Failed to fetch patients');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        if (!searchTerm) {
            setFilteredPatients(patients);
            return;
        }

        const filtered = patients.filter(patient =>
            patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone?.includes(searchTerm)
        );

        setFilteredPatients(filtered);
    };

    const viewPatientDetails = async (patient) => {
        try {
            const [historyRes, prescriptionsRes] = await Promise.all([
                doctorApi.getPatientHistory(patient._id),
                doctorApi.getPatientPrescriptions(patient._id)
            ]);

            if (historyRes.success) {
                const { records, appointments, labResults } = historyRes.data;
                const prescriptions = prescriptionsRes.success ? (prescriptionsRes.data.prescriptions || []) : [];

                const patientRes = await doctorApi.getPatientById(patient._id);

                const fullPatient = {
                    ...(patientRes.success ? patientRes.data.patient : patient),
                    medicalRecords: records || [],
                    appointments: appointments || [],
                    labResults: labResults || [],
                    prescriptions: prescriptions
                };

                setSelectedPatient(fullPatient);
                setShowDetailsModal(true);
            }
        } catch (error) {
            toast.error('Failed to load patient details');
            console.error(error);
        }
    };

    const getBloodGroupColor = (bloodGroup) => {
        const colors = {
            'A+': 'bg-red-100 text-red-800',
            'A-': 'bg-red-100 text-red-800',
            'B+': 'bg-blue-100 text-blue-800',
            'B-': 'bg-blue-100 text-blue-800',
            'AB+': 'bg-purple-100 text-purple-800',
            'AB-': 'bg-purple-100 text-purple-800',
            'O+': 'bg-green-100 text-green-800',
            'O-': 'bg-green-100 text-green-800'
        };
        return colors[bloodGroup] || 'bg-gray-100 text-gray-800';
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
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Patients</h1>
                    <p className="text-gray-600">Manage and view your patient information</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search patients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <div key={patient._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {patient.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-gray-500">{patient.gender}</p>
                                </div>
                            </div>
                            {patient.bloodGroup && (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBloodGroupColor(patient.bloodGroup)}`}>
                                    {patient.bloodGroup}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center"><User className="w-4 h-4 mr-2" /><span>{patient.email}</span></div>
                            {patient.phone && <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /><span>{patient.phone}</span></div>}
                        </div>
                        <button onClick={() => viewPatientDetails(patient)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" /> View Details
                        </button>
                    </div>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
                    <User className="w-16 h-16 mx-auto mb-4" /><p>No patients found</p>
                </div>
            )}

            {showDetailsModal && selectedPatient && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                                <p className="text-gray-600">{selectedPatient.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowPrescriptionForm(true)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"><PlusCircle className="w-4 h-4" />Prescribe</button>
                                <button onClick={() => setShowDiagnosisForm(true)} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"><Stethoscope className="w-4 h-4" />Diagnose</button>
                                <button onClick={() => setShowLabOrderForm(true)} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2"><TestTube className="w-4 h-4" />Order Test</button>
                                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <p className="text-sm text-blue-600">Heart Rate</p>
                                        <p className="text-2xl font-bold text-blue-900">{selectedPatient.vitalSigns?.heartRate || '--'} <span className="text-xs font-normal">bpm</span></p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl">
                                        <p className="text-sm text-red-600">Blood Pressure</p>
                                        <p className="text-2xl font-bold text-red-900">{selectedPatient.vitalSigns?.bloodPressure ? `${selectedPatient.vitalSigns.bloodPressure.systolic}/${selectedPatient.vitalSigns.bloodPressure.diastolic}` : '--'}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <p className="text-sm text-green-600">Temperature</p>
                                        <p className="text-2xl font-bold text-green-900">{selectedPatient.vitalSigns?.temperature || '--'} <span className="text-xs font-normal">°C</span></p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-xl">
                                        <p className="text-sm text-purple-600">Weight</p>
                                        <p className="text-2xl font-bold text-purple-900">{selectedPatient.vitalSigns?.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Prescriptions</h4>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {selectedPatient.prescriptions?.length > 0 ? selectedPatient.prescriptions.map(pres => (
                                            <div key={pres._id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex justify-between text-xs mb-1 font-medium"><span>{new Date(pres.createdAt).toLocaleDateString()}</span><span className="text-green-600 uppercase">{pres.status}</span></div>
                                                <p className="text-sm text-gray-900">{pres.medications?.map(m => m.name).join(', ')}</p>
                                            </div>
                                        )) : <p className="text-sm text-gray-500 italic text-center py-4">No prescriptions</p>}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TestTube className="w-4 h-4 text-purple-500" /> Lab Results
                                    </h4>
                                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                        {selectedPatient.labResults?.length > 0 ? selectedPatient.labResults.map(result => (
                                            <div key={result._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:border-purple-200 transition-all">
                                                {/* Test Header */}
                                                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">{result.testType}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium font-sans">ORDERED: {new Date(result.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter ${result.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {result.status}
                                                    </span>
                                                </div>

                                                {/* Test Content */}
                                                <div className="p-4">
                                                    {result.status === 'completed' && result.testParameters?.length > 0 ? (
                                                        <div className="space-y-3">
                                                            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2 mb-2">
                                                                <div className="col-span-6">Parameter</div>
                                                                <div className="col-span-4 text-center">Value</div>
                                                                <div className="col-span-2 text-right">Flag</div>
                                                            </div>
                                                            {result.testParameters.map((param, idx) => (
                                                                <div key={idx} className="grid grid-cols-12 gap-2 items-center hover:bg-gray-50 p-1 rounded-md transition-colors">
                                                                    <div className="col-span-6 text-sm font-medium text-gray-700">{param.parameter}</div>
                                                                    <div className="col-span-4 text-center">
                                                                        <span className="text-sm font-bold text-gray-900">{param.value}</span>
                                                                        <span className="text-[10px] text-gray-400 ml-1 font-medium">{param.unit}</span>
                                                                    </div>
                                                                    <div className="col-span-2 text-right">
                                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded leading-none ${param.flag === 'normal' ? 'bg-gray-100 text-gray-500' :
                                                                                param.flag === 'critical' ? 'bg-red-500 text-white shadow-sm shadow-red-200' :
                                                                                    'bg-orange-100 text-orange-700'
                                                                            }`}>
                                                                            {param.flag === 'normal' ? '—' : param.flag.toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {result.interpretation && (
                                                                <div className="mt-4 p-3 bg-purple-50/50 rounded-lg border border-purple-100/50">
                                                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Interpretation</p>
                                                                    <p className="text-xs text-purple-900 italic font-medium leading-relaxed">"{result.interpretation}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : result.status === 'completed' ? (
                                                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                                                            <p className="text-xs text-gray-400 font-medium">No parameter data available.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                                                            <Clock className="w-8 h-8 mb-2 opacity-20" />
                                                            <p className="text-xs font-medium">Test is currently being processed by the laboratory.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                                                <TestTube className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400 font-medium italic">No clinical laboratory records found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
                                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> Clinical Notes</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedPatient.medicalRecords?.length > 0 ? selectedPatient.medicalRecords.map(record => (
                                            <div key={record._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>{new Date(record.createdAt).toLocaleDateString()}</span><span className="uppercase text-blue-600">{record.recordType}</span></div>
                                                <p className="text-sm font-bold text-gray-900 mb-1">{record.diagnosis?.primary || 'Note'}</p>
                                                <p className="text-xs text-gray-600 line-clamp-2">{record.treatmentPlan || record.notes}</p>
                                            </div>
                                        )) : <p className="text-sm text-gray-500 italic py-4 text-center w-full lg:col-span-2">No clinical notes</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPrescriptionForm && <PrescriptionForm patientId={selectedPatient?._id} onClose={() => setShowPrescriptionForm(false)} onSuccess={() => { setShowPrescriptionForm(false); viewPatientDetails(selectedPatient); }} />}
            {showDiagnosisForm && <DiagnosisForm patientId={selectedPatient?._id} onClose={() => setShowDiagnosisForm(false)} onSuccess={() => { setShowDiagnosisForm(false); viewPatientDetails(selectedPatient); }} />}
            {showLabOrderForm && <LabOrderForm patientId={selectedPatient?._id} onClose={() => setShowLabOrderForm(false)} onSuccess={() => { setShowLabOrderForm(false); viewPatientDetails(selectedPatient); }} />}
        </div>
    );
};

export default DoctorPatients;
