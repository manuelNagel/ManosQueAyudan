import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useProjectSearch = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState({
    latitude: null,
    longitude: null
  });

  const searchProjects = async (latitude = null, longitude = null) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/projects/search';
      
      // Only append coordinates for non-authenticated users
      if (!user && latitude && longitude) {
        url += `?lat=${latitude}&lon=${longitude}`;
      }

      const response = await axios.get(url);
      
      if (response.data.projects) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error al buscar proyectos');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    // Check if location has valid coordinates
    if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
      setManualLocation({
        latitude: location.lat,
        longitude: location.lng
      });

      if (!user) {
        // Only search with coordinates for non-authenticated users
        await searchProjects(location.lat, location.lng);
      }
    } else {
      setError('Ubicación inválida seleccionada');
    }
  };

  // Initial search when component mounts
  useEffect(() => {
    if (user) {
      // For authenticated users, just search without coordinates
      searchProjects();
    } else if (manualLocation.latitude && manualLocation.longitude) {
      // For non-authenticated users, search with coordinates
      searchProjects(manualLocation.latitude, manualLocation.longitude);
    }
  }, [user]);

  return {
    projects,
    loading,
    error,
    searchProjects,
    handleLocationSelect,
    isAuthenticated: !!user,
    manualLocation
  };
};