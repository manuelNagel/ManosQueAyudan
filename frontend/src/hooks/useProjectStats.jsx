import { useState, useCallback } from 'react';
import axios from 'axios';

export const useProjectStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserStats = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/reports/users/${userId}/stats`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar estadísticas del usuario');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectStats = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/reports/projects/${projectId}/stats`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar estadísticas del proyecto');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getUserStats,
    getProjectStats,
    clearError
  };
};