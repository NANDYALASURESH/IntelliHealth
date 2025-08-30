import { API_BASE_URL, setAuthSession, apiRequest } from './api';
import Cookies from 'js-cookie';


export const authService = {
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthSession(data.user, data.token);
    return data;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  getCurrentUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },
};
