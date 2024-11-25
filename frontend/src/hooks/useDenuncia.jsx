import { useState, useCallback } from 'react';
import axios from 'axios';

export const useDenuncia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDenuncia = useCallback(async ({ descripcion, tipo, targetId }) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/denuncias', {
        descripcion,
        tipo,
        targetId
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear la denuncia');
      return false;
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
    createDenuncia,
    clearError
  };
};