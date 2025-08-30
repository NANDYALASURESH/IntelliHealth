// src/services/api.js

const DEFAULT_API_BASE = 'http://localhost:5000/api';
export const API_BASE_URL = import.meta?.env?.VITE_API_URL || DEFAULT_API_BASE;
import Cookies from 'js-cookie';

export function getAuthToken() {
  return Cookies.get('token') || '';
}

export function setAuthSession(user, token) {
  if (token) Cookies.set('token', token);
  if (user) Cookies.set('user', JSON.stringify(user));
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

const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = Cookies.get('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminApi = {
  getDashboardStats: async () => {
    const response = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
    return response.json();
  },

  addUser: async (userData) => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add user');
    }
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    return response.json();
  },
};


