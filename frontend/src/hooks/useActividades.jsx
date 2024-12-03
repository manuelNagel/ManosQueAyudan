import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useActividades = (projectId,onStateChange) => {
  const [actividades, setActividades] = useState([]);

  const fetchActividades = useCallback(async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      const newActividades = response.data.actividades || [];
      setActividades(newActividades);
      if (onStateChange && JSON.stringify(newActividades) !== JSON.stringify(actividades)) {
        onStateChange(newActividades);
      }
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    }
  }, [projectId, onStateChange, actividades]);

  const updateActividad = async (actividad) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}/actividades`, actividad);
      await fetchActividades();
      return response.data;
    } catch (error) {
      console.error("Error al actualizar actividad:", error);
      throw error;
    }
  };

  // Añadir función para eliminar actividad
  const removeActividad = async (actividadId) => {
    try {
      await axios.delete(`/api/projects/${projectId}/actividades/${actividadId}`);
      await fetchActividades(); // Recargar actividades después de eliminar
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchActividades();
  }, [projectId]); 

  return { 
    actividades, 
    fetchActividades, 
    updateActividad, 
    removeActividad 
  };
};