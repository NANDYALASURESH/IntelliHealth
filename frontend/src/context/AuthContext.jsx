// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthSession, API_BASE_URL } from '../services/api';
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data from cookies', error);
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      const payload = res?.data || res; // backend uses { success, message, data }
      
      // Set auth session (this sets token and user cookies)
      setAuthSession(payload.user, payload.token);
      
      // Also set role cookie for easy access
      Cookies.set('role', payload.user.role);
      
      // Update local state
      setUser(payload.user);
      
      return payload;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('role');
    setAuthSession(null, null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};