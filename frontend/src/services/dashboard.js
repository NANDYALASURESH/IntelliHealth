import Cookies from "js-cookie";
const BASE_URL = 'http://localhost:5000/api';

export const dashboardAPI = {
  getStats: async () => {
    const token = Cookies.get('token');
    const response = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  },

  // Add more dashboard-related API calls here
};
