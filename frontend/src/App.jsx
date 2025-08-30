import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import LabDashboard from "./pages/LabDashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Routes>
          {/* Public Route */}
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
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MainLayout>
                  <PatientDashboard />
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
