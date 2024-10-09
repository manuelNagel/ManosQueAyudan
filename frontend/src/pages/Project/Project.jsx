import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';

import ProjectForm from '../../components/ProjectForm/ProjectForm';
import ActividadList from '../../components/ActividadList/ActividadList';
import ActividadForm from '../../components/ActividadForm/ActividadForm';

const Project = () => {
  const [project, setProject] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinalizacion: '', // Add this field
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
        fechaInicio: fetchedProject.fechaInicio.split('T')[0], // Format date for input
        fechaFinalizacion: fetchedProject.fechaFinalizacion.split('T')[0], // Format date for input
        horario: new Date(fetchedProject.horario).toTimeString().slice(0,5) // Format time as HH:MM
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
      actividades: [...prev.actividades, newActivity],
      habilitado: true
    }));
    setNewActivity({ nombre: '', descripcion: '', estado: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedProject = {
      ...project,
      fechaInicio: new Date(project.fechaInicio).toISOString(),
      fechaFinalizacion: new Date(project.fechaFinalizacion).toISOString(),
      horario: `${project.horario}:00`, // Append seconds to match Time format
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
      <h1>{id ? 'Edit Project' : 'Create New Project'}</h1>
      <ProjectForm project={project} handleChange={handleChange} handleSubmit={handleSubmit} />
      
      <h2>Actividades</h2>
      <ActividadList activities={project.actividades} />
      <ActividadForm newActivity={newActivity} handleActivityChange={handleActivityChange} addActivity={addActivity} />

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