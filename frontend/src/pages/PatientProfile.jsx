import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, MapPin, Heart, Save, Edit2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../services/api';

const PatientProfile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        bloodGroup: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'Not provided',
                bloodGroup: user.bloodGroup || 'Not provided',
                address: user.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                },
                emergencyContact: user.emergencyContact || {
                    name: 'Not provided',
                    relationship: '',
                    phone: ''
                }
            });
        }
    }, [user]);

    const DataField = ({ label, value, icon: Icon }) => (
        <div className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {Icon && <Icon className="w-3 h-3 mr-1" />}
                {label}
            </div>
            <div className="text-gray-900 font-medium">
                {value || '—'}
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {profileData.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
                        <p className="text-gray-500 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {profileData.email}
                        </p>
                    </div>
                </div>
                <div className="hidden md:block">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                        Active Patient Account
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DataField label="Full Name" value={profileData.name} />
                    <DataField label="Email Address" value={profileData.email} />
                    <DataField label="Phone Number" value={profileData.phone} />
                    <DataField label="Date of Birth" value={profileData.dateOfBirth} icon={Calendar} />
                    <DataField label="Blood Group" value={profileData.bloodGroup} icon={Heart} />
                </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    Resident Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <DataField label="Street Address" value={profileData.address.street} />
                    </div>
                    <DataField label="City" value={profileData.address.city} />
                    <DataField label="State / Province" value={profileData.address.state} />
                    <DataField label="ZIP / Postal Code" value={profileData.address.zipCode} />
                    <DataField label="Country" value={profileData.address.country} />
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                    Emergency Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DataField label="Contact Name" value={profileData.emergencyContact.name} />
                    <DataField label="Relationship" value={profileData.emergencyContact.relationship} />
                    <DataField label="Contact Phone" value={profileData.emergencyContact.phone} />
                </div>
            </div>

            <div className="text-center text-sm text-gray-400 mt-8">
                To update your profile information, please contact the hospital administration.
            </div>
        </div>
    );
};

export default PatientProfile;
