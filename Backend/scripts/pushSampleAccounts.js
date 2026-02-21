// scripts/pushSampleAccounts.js - Push sample accounts from Login.jsx to Database
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const sampleAccounts = [
    {
        name: 'Admin User',
        role: 'admin',
        email: 'admin@intellihealth.com',
        password: 'Admin123!',
        gender: 'male',
        isActive: true,
        isEmailVerified: true
    },
    {
        name: 'Dr. Sarah Wilson',
        role: 'doctor',
        email: 'sarah.wilson@intellihealth.com',
        password: 'Doctor123!',
        gender: 'female',
        specialization: 'Cardiology',
        licenseNumber: 'MD001234',
        experience: 8,
        consultationFee: 200,
        department: 'Cardiology',
        workingHours: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '09:00', end: '13:00', available: true },
            sunday: { start: '', end: '', available: false }
        },
        isActive: true,
        isEmailVerified: true
    },
    {
        name: 'John Doe',
        role: 'patient',
        email: 'john.doe@example.com',
        password: 'Patient123!',
        phone: '+1234567890',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'male',
        bloodGroup: 'O+',
        address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        },
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1234567891'
        },
        isActive: true,
        isEmailVerified: true
    },
    {
        name: 'Lab Technician',
        role: 'lab',
        email: 'lab@intellihealth.com',
        password: 'Lab123!',
        gender: 'male',
        isActive: true,
        isEmailVerified: true
    }
];

const pushSamples = async () => {
    try {
        console.log('🚀 Starting to push sample accounts to database...');

        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/intellihealth';
        console.log(`📡 Connecting to MongoDB: ${mongoURI}`);

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        for (const account of sampleAccounts) {
            console.log(`👤 Processing ${account.role}: ${account.email}...`);

            // Check if user exists
            let user = await User.findOne({ email: account.email });

            if (user) {
                console.log(`   - User already exists, updating...`);
                // Update password if needed (will be hashed by pre-save)
                user.password = account.password;
                user.name = account.name;
                user.role = account.role;
                user.gender = account.gender;
                user.isActive = account.isActive;
                user.isEmailVerified = account.isEmailVerified;
                await user.save();
            } else {
                console.log(`   - Creating new user...`);
                if (account.role === 'doctor') {
                    user = new Doctor(account);
                } else if (account.role === 'patient') {
                    user = new Patient(account);
                } else {
                    user = new User(account);
                }
                await user.save();
            }
            console.log(`   ✅ ${account.role} pushed successfully.`);
        }

        console.log('\n✨ All sample accounts pushed successfully!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error pushing samples:', error.message);
        console.error(error);
        process.exit(1);
    }
};

pushSamples();
