import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useActividades = (projectId) => {
  const [actividades, setActividades] = useState([]);

  // Envuelve fetchActividades con useCallback
  const fetchActividades = useCallback(async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setActividades(response.data.actividades || []);
    } catch (error) {
      console.error("Error al cargar actividades:", error);
    }
  }, [projectId]); // Dependencia de projectId

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
  }, [fetchActividades]); // Ahora incluye fetchActividades en las dependencias

  return { 
    actividades, 
    fetchActividades, 
    updateActividad, 
    removeActividad 
  };
};