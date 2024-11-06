import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  /**
   * Metodo que verifica el usuario loggeado
   */
  const checkUserLoggedIn = async () => {
    try {
      const res = await axios.get('/api/current-user', { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      console.error('Error checking user login status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * metodo para loggearse
   * @param {M} email 
   * @param {*} password 
   * @returns 
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/login', { email, password }, { withCredentials: true });
      setUser(res.data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'An error occurred during login' };
    }
  };

  /**
   * Metodo que refresca el usuario en las páginas
   */
  const refreshUser = async () => {
    await checkUserLoggedIn();
  };

  /**
   * Metodo para deslogearse
   */
  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Metodo para updater datos del usuario
   * @param {*} updatedUserData 
   * @returns 
   */
  const updateUserProfile = async (updatedUserData) => {
    try {
      const response = await axios.put('/api/update-profile', updatedUserData, { withCredentials: true });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.response?.data?.error || 'An error occurred while updating the profile' };
    }
  };
  /**
   * Metodo que registra un usuario
   * @param {*} userData 
   * @returns 
   */
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/register', userData, { withCredentials: true });
      setUser(res.data);
      return { success: true, user: res.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.error || 'An error occurred during registration' };
    }
  };

  /**
   * Metodo para updater datos del usuario
   * @param {*} updatedUserData 
   * @returns 
   */
  const resetPassword = async (email) => {
    try {
      const response = await axios.put('/api/reset-password', { email }, { withCredentials: false });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error al resetear la contaseña:', error);
      return { success: false, error: error.response?.data?.error || 'An error occurred while updating the profile' };
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading,updateUserProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);