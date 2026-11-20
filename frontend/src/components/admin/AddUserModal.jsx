import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';

const ROLES = ['patient', 'doctor', 'lab', 'admin'];

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'patient',
    gender: '',
    dateOfBirth: '',
    emergencyContact: { name: '', phone: '' },
    // Doctor-specific
    specialization: '',
    licenseNumber: '',
    experience: '',
    department: '',
    consultationFee: '',
    bio: '',
};

const AddUserModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('emergency.')) {
            const field = name.split('.')[1];
            setForm(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, [field]: value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
                gender: form.gender,
                dateOfBirth: form.dateOfBirth || undefined,
                emergencyContact: form.emergencyContact,
            };

            if (form.role === 'doctor') {
                payload.specialization = form.specialization;
                payload.licenseNumber = form.licenseNumber;
                payload.experience = Number(form.experience);
                payload.department = form.department;
                payload.consultationFee = Number(form.consultationFee);
                payload.bio = form.bio;
            }

            await adminApi.addUser(payload);
            toast.success('User created successfully!');
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                name="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min 8 characters"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <select
                                name="role"
                                required
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                name="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Emergency Contact *</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                <input
                                    name="emergency.name"
                                    type="text"
                                    required
                                    value={form.emergencyContact.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                <input
                                    name="emergency.phone"
                                    type="tel"
                                    required
                                    value={form.emergencyContact.phone}
                                    onChange={handleChange}
                                    placeholder="+1-555-000-0000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Doctor-specific fields */}
                    {form.role === 'doctor' && (
                        <div className="border border-blue-100 rounded-xl p-4 bg-blue-50 space-y-4">
                            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Doctor Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                                    <input
                                        name="specialization"
                                        type="text"
                                        required
                                        value={form.specialization}
                                        onChange={handleChange}
                                        placeholder="Cardiology"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                                    <input
                                        name="licenseNumber"
                                        type="text"
                                        required
                                        value={form.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="MD-123456"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                                    <input
                                        name="experience"
                                        type="number"
                                        min="0"
                                        required
                                        value={form.experience}
                                        onChange={handleChange}
                                        placeholder="5"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                    <input
                                        name="department"
                                        type="text"
                                        required
                                        value={form.department}
                                        onChange={handleChange}
                                        placeholder="Cardiology Dept."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($) *</label>
                                    <input
                                        name="consultationFee"
                                        type="number"
                                        min="0"
                                        required
                                        value={form.consultationFee}
                                        onChange={handleChange}
                                        placeholder="150"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={2}
                                    value={form.bio}
                                    onChange={handleChange}
                                    placeholder="Brief professional bio..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
