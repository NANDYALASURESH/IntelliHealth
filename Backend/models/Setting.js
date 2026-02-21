const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    general: {
        systemName: { type: String, default: 'IntelliHealth' },
        systemVersion: { type: String, default: '2.1.0' },
        timezone: { type: String, default: 'UTC' },
        dateFormat: { type: String, default: 'MM/DD/YYYY' },
        timeFormat: { type: String, default: '12h' },
        language: { type: String, default: 'en' },
        maintenanceMode: { type: Boolean, default: false },
        debugMode: { type: Boolean, default: false }
    },
    notifications: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        pushNotifications: { type: Boolean, default: true },
        appointmentReminders: { type: Boolean, default: true },
        labResultNotifications: { type: Boolean, default: true },
        securityAlerts: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: false },
        marketingEmails: { type: Boolean, default: false }
    },
    database: {
        backupFrequency: { type: String, default: 'daily' },
        backupRetention: { type: Number, default: 30 },
        autoBackup: { type: Boolean, default: true },
        backupTime: { type: String, default: '02:00' },
        compressionEnabled: { type: Boolean, default: true },
        encryptionEnabled: { type: Boolean, default: true }
    },
    email: {
        smtpHost: { type: String, default: 'smtp.gmail.com' },
        smtpPort: { type: Number, default: 587 },
        smtpUsername: { type: String, default: 'noreply@intellihealth.com' },
        smtpPassword: { type: String, default: '' },
        smtpSecurity: { type: String, default: 'tls' },
        fromEmail: { type: String, default: 'noreply@intellihealth.com' },
        fromName: { type: String, default: 'IntelliHealth System' },
        replyToEmail: { type: String, default: 'support@intellihealth.com' }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
