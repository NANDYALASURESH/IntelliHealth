# Admin Dashboard - IntelliHealth

## Overview

The Admin Dashboard provides comprehensive system management capabilities for healthcare administrators. It includes five main sections accessible through tab-based navigation.

## Features

### 1. Overview Tab
- **System Statistics**: View key metrics including total doctors, patients, lab reports, and system health
- **Recent Activity**: Monitor system activities and user actions
- **System Alerts**: View important system notifications and warnings

### 2. User Management Tab
- **User List**: View all system users with search and filtering capabilities
- **Add Users**: Create new user accounts with role-based permissions
- **Edit Users**: Modify existing user information and settings
- **Delete Users**: Remove user accounts from the system
- **Role Management**: Manage user roles (Admin, Doctor, Patient, Lab)

### 3. System Security Tab
- **Security Overview**: Monitor system security status and active threats
- **Password Policy**: Configure password requirements and complexity rules
- **Session Management**: Set session duration, idle timeouts, and concurrent session limits
- **Access Control**: Configure MFA, failed login attempts, and lockout policies
- **Security Logs**: View recent security events and suspicious activities

### 4. System Settings Tab
- **General Settings**: Configure system name, timezone, date/time formats, and language
- **Notification Preferences**: Manage email, SMS, and push notification settings
- **Database Configuration**: Set backup schedules, retention policies, and encryption
- **Email Settings**: Configure SMTP settings for system notifications

### 5. System Logs Tab
- **Log Monitoring**: View system logs with filtering by level, type, and time range
- **Search & Filter**: Advanced search capabilities across log messages and details
- **Export Functionality**: Download logs in CSV format for analysis
- **Log Details**: View detailed information for each log entry

## Navigation

The dashboard uses URL-based tab navigation:
- `/dashboard` - Overview tab (default)
- `/dashboard?tab=users` - User Management
- `/dashboard?tab=security` - System Security
- `/dashboard?tab=settings` - System Settings
- `/dashboard?tab=logs` - System Logs

## Technical Details

### Components
- `AdminDashboard.jsx` - Main dashboard with tab navigation
- `UserManagement.jsx` - User management functionality
- `SystemSecurity.jsx` - Security configuration and monitoring
- `SystemSettings.jsx` - System preferences and configuration
- `SystemLogs.jsx` - Log viewing and analysis

### Dependencies
- React Router DOM for navigation
- Lucide React for icons
- React Hot Toast for notifications
- JS Cookie for token management

### API Integration
All components are designed to integrate with the backend API endpoints:
- User management: `/api/admin/users`
- Security settings: `/api/admin/security`
- System settings: `/api/admin/settings`
- System logs: `/api/admin/logs`

## Usage

1. **Access**: Navigate to `/dashboard` as an admin user
2. **Tab Navigation**: Click on tabs to switch between different sections
3. **Data Management**: Use the interface to view, create, edit, and delete records
4. **Settings Configuration**: Modify system settings and security policies
5. **Monitoring**: Keep track of system activity and security events

## Security Features

- Role-based access control
- Secure token-based authentication
- Audit logging for all administrative actions
- Configurable security policies
- Real-time security monitoring

## Future Enhancements

- Advanced analytics and reporting
- Real-time notifications
- Bulk operations for user management
- Advanced log analysis tools
- Integration with external security services
