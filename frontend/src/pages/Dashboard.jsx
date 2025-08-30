import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import LabDashboard from "./LabDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "patient":
      return <PatientDashboard />;
    case "lab":
      return <LabDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
};

export default Dashboard;
