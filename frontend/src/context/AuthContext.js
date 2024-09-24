import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await axios.get('/api/current-user', { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/login', { email, password }, { withCredentials: true });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.error };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/register', userData, { withCredentials: true });
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);