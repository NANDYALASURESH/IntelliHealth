# 🏥 IntelliHealth - Advanced Healthcare Management Platform

IntelliHealth is a premium, full-stack healthcare platform designed to streamline communication and data management between patients, doctors, lab technicians, and administrators. Built with a focus on real-time interactivity, security, and a modern user experience.

---

## 🚀 Key Features

### 👤 Patient Experience
- **Interactive Dashboard**: Health scores, vital signs monitoring, and quick action shortcuts.
- **Secure Messaging**: Direct, conversational communication with assigned doctors.
- **Appointment Management**: Real-time booking with collision detection to prevent double-booking.
- **Prescription Tracking**: View active medications and "Request Refill" with automatic availability checks.
- **Lab results**: Instant access to completed lab reports and history.

### 🩺 Doctor Portal
- **Patient Management**: Complete access to patient histories, medical records, and vitals.
- **Appointment Scheduling**: Manage daily schedules and consult patients.
- **Prescription System**: Issue digital prescriptions and authorize refill requests.
- **Communication Hub**: Centralized messaging with patients for better care coordination.

### 🧪 Laboratory Suite
- **Worklist Management**: Track pending tests by priority (Urgent, High, Routine).
- **Barcode Workflow**: Unique barcode generation (`LAB-XXXXXXXX`) and "Scan Tube" lookup for specimen tracking.
- **Electronic Result Entry**: Digital entry of test parameters with automatic abnormal/critical flag detection.

### 🛡️ Admin Core
- **System monitoring**: Real-time audit logs of all user actions across the platform.
- **Configuration Engine**: Persistent system-wide settings for notifications, database, and email.
- **User Management**: Oversight of all roles and access control.

---

## 🛠️ Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Real-time**: Socket.IO for live notifications and logs
- **Security**: JWT Authentication, Role-Based Access Control (RBAC), Helmet security headers
- **State Management**: React Context API
- **API**: RESTful architecture with custom response formatting

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js >= 16.x
- MongoDB (Local or Atlas)
- npm or yarn

### 2. Backend Installation
```bash
cd Backend
npm install
cp .env.example .env  # Update with your MongoDB URI and JWT Secret
npm run seed          # Optional: Seed with demo accounts
npm run dev           # Runs on http://localhost:5000
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev           # Runs on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@intellihealth.com | admin123 |
| **Doctor** | doctor@intellihealth.com | doctor123 |
| **Patient** | patient@intellihealth.com | patient123 |
| **Lab** | lab@intellihealth.com | lab123 |

---

## 📁 Project Architecture

```
IntelliHealth/
├── Backend/
│   ├── controllers/    # Business logic & Route handlers
│   ├── models/         # Mongoose schemas (Message, LabResult, Appointment, etc.)
│   ├── routes/         # Express API endpoints
│   ├── middleware/     # Auth & validation layers
│   └── services/       # Persistent utility services
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI atoms & modules
    │   ├── pages/      # Feature-specific views
    │   ├── services/   # Centralized API layer (api.js)
    │   └── context/    # Global Auth & State
```

---

## 📝 Recent Implementation (Feb 2026)
- **Feature 4**: Patient "Request Refill" with automated backend logic.
- **Feature 5**: Secure Patient-Doctor basic messaging service.
- **Feature 6**: Lab specimen barcode scanner simulation & lookup.
- **Feature 7**: Backend appointment collision & overlap detection.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
