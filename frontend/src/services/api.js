// src/services/api.js
import Cookies from 'js-cookie';

const DEFAULT_API_BASE = 'http://localhost:5000/api';
export const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || DEFAULT_API_BASE;

export function getAuthToken() {
  return Cookies.get('token') || '';
}

export function setAuthSession(user, token) {
  if (token) Cookies.set('token', token);
  if (user) Cookies.set('user', JSON.stringify(user));
}

const getHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper to handle 401 and redirect
function handleAuthError() {
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('role');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && !path.includes('/auth/login')) {
    handleAuthError();
    throw new Error('Session expired');
  }

  let data;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const adminApi = {
  getDashboardStats: () => apiRequest('/admin/dashboard-stats'),
  addUser: (userData) => apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
  getUsers: () => apiRequest('/admin/users'),
  getSettings: () => apiRequest('/admin/settings'),
  updateSettings: (settings) => apiRequest('/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) }),
  getLogs: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/logs?${queryString}`);
  },
};

export const doctorApi = {
  getDashboardStats: () => apiRequest('/doctor/dashboard-stats'),
  getPatients: () => apiRequest('/doctor/patients'),
  getPatientById: (id) => apiRequest(`/doctor/patients/${id}`),
  getAppointments: () => apiRequest('/doctor/appointments'),
  updateAppointmentStatus: (id, status) => apiRequest(`/doctor/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  createPrescription: (data) => apiRequest('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  createMedicalRecord: (data) => apiRequest('/medical-records', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getPatientPrescriptions: (patientId) => apiRequest(`/prescriptions/patient/${patientId}`),
  getPatientPrescriptions: (patientId) => apiRequest(`/prescriptions/patient/${patientId}`),
  getPatientRecords: (patientId) => apiRequest(`/medical-records/patient/${patientId}`),
  getPatientHistory: (patientId) => apiRequest(`/doctor/patients/${patientId}/history`),
  orderLabTest: (data) => apiRequest('/doctor/lab-orders', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const labApi = {
  getDashboardStats: () => apiRequest('/lab/dashboard-stats'),
  getTestResults: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/lab/test-results?${queryString}`);
  },
  updateTestStatus: (id, status) => apiRequest(`/lab/test-results/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  uploadTestResult: (id, reportUrl) => apiRequest(`/lab/test-results/${id}/upload`, {
    method: 'POST',
    body: JSON.stringify({ reportUrl })
  }),
  getPendingTests: () => apiRequest('/lab/pending-tests'),
  getEquipmentStatus: () => apiRequest('/lab/equipment-status'),
  completeLabTest: (id, data) => apiRequest(`/lab/test-results/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  recordSpecimen: (id, data) => apiRequest(`/lab/test-results/${id}/specimen`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  getByBarcode: (barcode) => apiRequest(`/lab/barcode/${barcode}`)
};
export const notificationApi = {
  list: () => apiRequest('/notifications'),
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'PATCH' }),
  delete: (id) => apiRequest(`/notifications/${id}`, { method: 'DELETE' })
};

export const prescriptionApi = {
  listMy: () => apiRequest('/prescriptions/my'),
  getById: (id) => apiRequest(`/prescriptions/${id}`),
  requestRefill: (id) => apiRequest(`/prescriptions/${id}/refill`, { method: 'POST' })
};

export const messageApi = {
  getInbox: () => apiRequest('/messages/inbox'),
  getConversation: (userId) => apiRequest(`/messages/conversation/${userId}`),
  sendMessage: (data) => apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};
