import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import PatientDashboard from "./pages/PatientDashboard";
import MyPrescriptions from "./pages/MyPrescriptions";
import Messaging from './pages/Messaging';
import MyLabResults from "./pages/MyLabResults";
import MyAppointments from "./pages/MyAppointments";
import MedicalRecords from "./pages/MedicalRecords";
import PatientProfile from "./pages/PatientProfile";
import LabDashboard from "./pages/LabDashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />

          {/* Generic Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "doctor", "patient", "lab"]}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Role-specific Dashboard Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MainLayout>
                  <DoctorDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MainLayout>
                  <DoctorAppointments />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MainLayout>
                  <DoctorPatients />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <MainLayout>
                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Under Development</h2>
                    <p className="text-gray-600">This feature will be available soon</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <PatientDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <MyAppointments />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/records"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <MedicalRecords />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <MyPrescriptions />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/lab-results"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <MyLabResults />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <PatientProfile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute allowedRoles={["doctor", "patient"]}>
                <MainLayout>
                  <Messaging />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lab/dashboard"
            element={
              <ProtectedRoute allowedRoles={["lab"]}>
                <MainLayout>
                  <LabDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
