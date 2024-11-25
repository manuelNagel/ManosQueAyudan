import { useState, useCallback } from 'react';
import axios from 'axios';

export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserFeedbackStats = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/feedback/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cargar estadísticas de feedback');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserGivenFeedback = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/feedback/users/${userId}/given`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cargar feedback otorgado');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = useCallback(async (feedbackData) => {
    setLoading(true);
    setError(null);
    try {
      const formattedData = {
        ...feedbackData,
        idProyecto: parseInt(feedbackData.idProyecto, 10),
        idDestinatario: parseInt(feedbackData.idDestinatario, 10),
        puntuacion: parseInt(feedbackData.puntuacion, 10)
      };

      const response = await axios.post('/api/feedback', formattedData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al crear feedback';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
    getUserFeedbackStats,
    getUserGivenFeedback,
    createFeedback,
    clearError,
  };
};