import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

import ProjectForm from '../../components/ProjectForm/ProjectForm';
import ActividadList from '../../components/ActividadList/ActividadList';
import ActividadForm from '../../components/ActividadForm/ActividadForm';
import Navbar from '../../components/Navbar/Navbar'

const Project = () => {
  const [project, setProject] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinalizacion: '',
    localizacion: '',
    cantidadParticipantes: 0,
    horario: '',
    habilitado: false,
    actividades: []
  });

  const [newActivity, setNewActivity] = useState({ nombre: '', descripcion: '', estado: false });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      const fetchedProject = response.data;
      setProject({
        ...fetchedProject,
        fechaInicio: fetchedProject.fechaInicio.split('T')[0],
        fechaFinalizacion: fetchedProject.fechaFinalizacion.split('T')[0],
        horario: new Date(fetchedProject.horario).toTimeString().slice(0,5)
      });
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const addActivity = () => {
    setProject(prev => ({
      ...prev,
      actividades: [...prev.actividades, { ...newActivity, id: Date.now() }],
      habilitado: true
    }));
    setNewActivity({ nombre: '', descripcion: '', estado: false });
  };

  const editActivity = (activityId, updatedActivity) => {
    setProject(prev => ({
      ...prev,
      actividades: prev.actividades.map(act => 
        act.id === activityId ? { ...act, ...updatedActivity } : act
      )
    }));
  };

  const deleteActivity = (activityId) => {
    setProject(prev => ({
      ...prev,
      actividades: prev.actividades.filter(act => act.id !== activityId)
    }));
  };

  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + "T00:00:00Z";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedProject = {
      ...project,
      fechaInicio: formatDateForBackend(project.fechaInicio),
      fechaFinalizacion: formatDateForBackend(project.fechaFinalizacion),
      horario: new Date(`1970-01-01T${project.horario}:00Z`).toISOString(),
      cantidadParticipantes: parseInt(project.cantidadParticipantes, 10)
    };
    console.log("Formatted project data being sent:", formattedProject);
    try {
      if (id) {
        await axios.put(`/api/projects/${id}`, formattedProject);
      } else {
        const response = await axios.post('/api/projects', formattedProject);
        console.log("Server response:", response.data);
      }
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error.response?.data || error.message);
      console.error('Full error object:', error);
    }
  };

  return (
    <Container>
        <Navbar></Navbar>
      <h1>{id ? 'Edit Project' : 'Create New Project'}</h1>
      <ProjectForm 
        project={project} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit}
        isEditing={!!id}
      />
      
      <h2>Actividades</h2>
      <ActividadList 
        activities={project.actividades} 
        editActivity={editActivity}
        deleteActivity={deleteActivity}
      />
      <ActividadForm 
        newActivity={newActivity} 
        handleActivityChange={handleActivityChange} 
        addActivity={addActivity}
      />

      <Form.Group className="mt-3">
        <Form.Check 
          type="checkbox" 
          label="Habilitado" 
          name="habilitado" 
          checked={project.habilitado} 
          onChange={(e) => setProject(prev => ({ ...prev, habilitado: e.target.checked }))}
          disabled={project.actividades.length === 0}
        />
      </Form.Group>
    </Container>
  );
};

export default Project;