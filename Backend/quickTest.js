// Quick test script to create test users and verify API
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
require('dotenv').config();

const connectDB = require('./config/database');

async function quickTest() {
    try {
        console.log('🧪 Starting quick test...');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = new User({
            name: 'Admin User',
            email: 'admin@intellihealth.com',
            password: 'Admin123!',
            role: 'admin',
            gender: 'male',
            isActive: true,
            isEmailVerified: true
        });
        await admin.save();
        console.log('✅ Admin created');

        // Create doctor
        console.log('👨‍⚕️ Creating doctor...');
        const doctor = new Doctor({
            name: 'Dr. Sarah Wilson',
            email: 'doctor@intellihealth.com',
            password: 'Doctor123!',
            role: 'doctor',
            gender: 'female',
            specialization: 'Cardiology',
            licenseNumber: 'MD001234',
            experience: 8,
            consultationFee: 200,
            department: 'Cardiology',
            isActive: true,
            isEmailVerified: true
        });
        await doctor.save();
        console.log('✅ Doctor created');

        // Create patient
        console.log('🤒 Creating patient...');
        const patient = new Patient({
            name: 'John Doe',
            email: 'patient@intellihealth.com',
            password: 'Patient123!',
            role: 'patient',
            gender: 'male',
            dateOfBirth: new Date('1990-01-01'),
            bloodGroup: 'O+',
            emergencyContact: {
                name: 'Jane Doe',
                relationship: 'Spouse',
                phone: '+1234567890'
            },
            isActive: true,
            isEmailVerified: true
        });
        await patient.save();
        console.log('✅ Patient created');

        // Create lab user
        console.log('🔬 Creating lab user...');
        const lab = new User({
            name: 'Lab Technician',
            email: 'lab@intellihealth.com',
            password: 'Lab123!',
            role: 'lab',
            gender: 'male',
            isActive: true,
            isEmailVerified: true
        });
        await lab.save();
        console.log('✅ Lab user created');

        console.log('\n✅ Test users created successfully!');
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@intellihealth.com / Admin123!');
        console.log('   Doctor: doctor@intellihealth.com / Doctor123!');
        console.log('   Patient: patient@intellihealth.com / Patient123!');
        console.log('   Lab: lab@intellihealth.com / Lab123!');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

quickTest();
