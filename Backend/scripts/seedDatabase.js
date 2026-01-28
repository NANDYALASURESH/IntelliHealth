// scripts/seedDatabase.js - Database Seeding Script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const LabResult = require('../models/LabResult');

const connectDB = require('../config/database');

// Sample data
const sampleUsers = {
  admin: {
    name: 'Admin User',
    email: 'admin@intellihealth.com',
    password: 'Admin123!',
    role: 'admin',
    gender: 'male',
    isActive: true,
    isEmailVerified: true
  },

  doctors: [
    {
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@intellihealth.com',
      password: 'Doctor123!',
      role: 'doctor',
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
      name: 'Dr. Mike Johnson',
      email: 'mike.johnson@intellihealth.com',
      password: 'Doctor123!',
      role: 'doctor',
      gender: 'male',
      specialization: 'Dermatology',
      licenseNumber: 'MD001235',
      experience: 12,
      consultationFee: 180,
      department: 'Dermatology',
      workingHours: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '18:00', available: true },
        saturday: { start: '', end: '', available: false },
        sunday: { start: '', end: '', available: false }
      },
      isActive: true,
      isEmailVerified: true
    },
    {
      name: 'Dr. Emily Davis',
      email: 'emily.davis@intellihealth.com',
      password: 'Doctor123!',
      role: 'doctor',
      gender: 'female',
      specialization: 'General Medicine',
      licenseNumber: 'MD001236',
      experience: 6,
      consultationFee: 150,
      department: 'General Medicine',
      workingHours: {
        monday: { start: '08:00', end: '16:00', available: true },
        tuesday: { start: '08:00', end: '16:00', available: true },
        wednesday: { start: '08:00', end: '16:00', available: true },
        thursday: { start: '08:00', end: '16:00', available: true },
        friday: { start: '08:00', end: '16:00', available: true },
        saturday: { start: '08:00', end: '12:00', available: true },
        sunday: { start: '', end: '', available: false }
      },
      isActive: true,
      isEmailVerified: true
    }
  ],

  patients: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Patient123!',
      role: 'patient',
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
      vitalSigns: {
        height: 175,
        weight: 70,
        bloodPressure: { systolic: 120, diastolic: 80, recordedAt: new Date() },
        heartRate: 72,
        temperature: 36.5,
        lastUpdated: new Date()
      },
      isActive: true,
      isEmailVerified: true
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'Patient123!',
      role: 'patient',
      phone: '+1234567892',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'female',
      bloodGroup: 'A+',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      },
      emergencyContact: {
        name: 'Robert Smith',
        relationship: 'Father',
        phone: '+1234567893'
      },
      vitalSigns: {
        height: 165,
        weight: 60,
        bloodPressure: { systolic: 115, diastolic: 75, recordedAt: new Date() },
        heartRate: 68,
        temperature: 36.3,
        lastUpdated: new Date()
      },
      isActive: true,
      isEmailVerified: true
    }
  ],

  labTechnician: {
    name: 'Lab Technician',
    email: 'lab@intellihealth.com',
    password: 'Lab123!',
    role: 'lab',
    gender: 'male',
    isActive: true,
    isEmailVerified: true
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalRecord.deleteMany({}),
      LabResult.deleteMany({})
    ]);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User(sampleUsers.admin);
    await adminUser.save();

    // Create doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctors = [];
    for (const doctorData of sampleUsers.doctors) {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      doctors.push(doctor);
    }

    // Create patients
    console.log('🤒 Creating patients...');
    const patients = [];
    for (const patientData of sampleUsers.patients) {
      const patient = new Patient(patientData);
      await patient.save();
      patients.push(patient);
    }

    // Create lab technician
    console.log('🔬 Creating lab technician...');
    const labUser = new User(sampleUsers.labTechnician);
    await labUser.save();

    // Create sample appointments
    console.log('📅 Creating sample appointments...');
    const appointments = [
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id, // Dr. Sarah Wilson
        scheduledDate: new Date(), // TODAY
        scheduledTime: '11:00',
        type: 'consultation',
        status: 'confirmed',
        reasonForVisit: 'Emergency heart palpitations'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[0]._id, // Dr. Sarah Wilson
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        scheduledTime: '09:00',
        type: 'check-up',
        status: 'pending', // Pending request
        reasonForVisit: 'General check-up request'
      },
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        scheduledTime: '10:00',
        type: 'consultation',
        status: 'scheduled',
        reasonForVisit: 'Regular check-up for heart condition'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        scheduledTime: '14:30',
        type: 'consultation',
        status: 'confirmed',
        reasonForVisit: 'Skin allergy consultation'
      },
      {
        patient: patients[0]._id,
        doctor: doctors[2]._id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        scheduledTime: '09:00',
        type: 'follow-up',
        status: 'scheduled',
        reasonForVisit: 'Follow-up for previous diagnosis'
      }
    ];

    for (const appointmentData of appointments) {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
    }

    // Create sample lab results
    console.log('🧪 Creating sample lab results...');
    const labResults = [
      {
        patient: patients[0]._id,
        orderedBy: doctors[0]._id,
        testType: 'Complete Blood Count',
        testCategory: 'blood',
        specimen: {
          type: 'blood',
          collectionDate: new Date(),
          collectionTime: '08:00',
          collectedBy: 'Lab Tech A'
        },
        testParameters: [
          {
            parameter: 'Hemoglobin',
            value: '14.5',
            unit: 'g/dL',
            normalRange: '12.0-16.0',
            flag: 'normal'
          },
          {
            parameter: 'White Blood Cells',
            value: '7.2',
            unit: '10^3/uL',
            normalRange: '4.0-10.0',
            flag: 'normal'
          }
        ],
        overallResult: 'normal',
        status: 'completed',
        priority: 'routine',
        reportDate: new Date()
      }
    ];

    for (const labData of labResults) {
      const labResult = new LabResult(labData);
      await labResult.save();
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Created:');
    console.log(`   - 1 Admin user`);
    console.log(`   - ${doctors.length} Doctors`);
    console.log(`   - ${patients.length} Patients`);
    console.log(`   - 1 Lab technician`);
    console.log(`   - ${appointments.length} Appointments`);
    console.log(`   - ${labResults.length} Lab results`);

    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@intellihealth.com / Admin123!');
    console.log('   Doctor: sarah.wilson@intellihealth.com / Doctor123!');
    console.log('   Patient: john.doe@example.com / Patient123!');
    console.log('   Lab: lab@intellihealth.com / Lab123!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;