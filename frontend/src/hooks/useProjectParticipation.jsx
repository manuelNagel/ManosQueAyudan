import { useState, useCallback } from 'react';
import axios from 'axios';

export const useProjectParticipation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const joinProject = useCallback(async (projectId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(`/api/projects/${projectId}/join`);
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al unirse al proyecto');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const leaveProject = useCallback(async (projectId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(`/api/projects/${projectId}/leave`);
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al abandonar el proyecto');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getParticipants = useCallback(async (projectId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/projects/${projectId}/participants`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al obtener participantes');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        joinProject,
        leaveProject,
        getParticipants,
        loading,
        error
    };
};