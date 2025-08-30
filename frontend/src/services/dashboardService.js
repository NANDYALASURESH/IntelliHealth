// src/services/dashboardService.js
import { apiRequest } from './api';

export const dashboardService = {
  async getRoleStats(role) {
    return apiRequest(`/dashboard/${role}`);
  },

  async getAppointments(role, userId) {
    return apiRequest(`/appointments?role=${role}&userId=${userId}`);
  },

  async getPatients(doctorId) {
    return apiRequest(`/patients?doctorId=${doctorId}`);
  },

  async getLabTests(status = 'all') {
    return apiRequest(`/lab/tests?status=${status}`);
  }
};