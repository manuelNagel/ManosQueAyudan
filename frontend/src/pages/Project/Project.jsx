import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert,Tab,Tabs } from 'react-bootstrap';
import axios from 'axios';

import ProjectForm from '../../components/ProjectForm/ProjectForm';
import ActividadList from '../../components/ActividadList/ActividadList';
import ActividadForm from '../../components/ActividadForm/ActividadForm';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantList from '../../components/ParticipantList/ParticipantList';
import ShareButton from '../../components/ShareButton/ShareButton';
import StatsContainer from '../../components/StatsContainer/StatsContainer';
import { AlignLeft } from 'lucide-react';

const Project = () => {
  const [project, setProject] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinalizacion: '',
    horarioInicio: '',
    horarioFinal: '',
    localizacion: '',
    latitud: -34.603722,
    longitud: -58.381592,
    cantidadParticipantes: 0,
    habilitado: false,
    actividades: []
  });

  const [newActivity, setNewActivity] = useState({ nombre: '', descripcion: '', estado: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); 
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = location.pathname.includes('/projects/joined/');

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${id}`);
      const fetchedProject = response.data;
      setProject({
        ...fetchedProject,
        fechaInicio: fetchedProject.fechaInicio ? fetchedProject.fechaInicio.split('T')[0] : '',
        fechaFinalizacion: fetchedProject.fechaFinalizacion ? fetchedProject.fechaFinalizacion.split('T')[0] : '',
        horarioInicio: fetchedProject.horarioInicio ? new Date(fetchedProject.horarioInicio).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        horarioFinal: fetchedProject.horarioFinal ? new Date(fetchedProject.horarioFinal).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''
      });
    } catch (error) {
      setError('Error al cargar el proyecto: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (location) => {
    setProject(prev => ({
      ...prev,
      latitud: location.latitud,
      longitud: location.longitud,
      localizacion: location.localizacion
    }));
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
    if (!isViewMode) {
      const newActivityWithId = {
        ...newActivity,
        NumeroActividad: project.actividades.length > 0 
          ? Math.max(...project.actividades.map(a => a.NumeroActividad || 0)) + 1 
          : 1
      };

      setProject(prev => ({
        ...prev,
        actividades: [...prev.actividades, newActivityWithId],
        habilitado: true
      }));
      setNewActivity({ nombre: '', descripcion: '', estado: false });
    }
  };

  const editActivity = (activityId, updatedActivity) => {
    if (!isViewMode) {
      setProject(prev => ({
        ...prev,
        actividades: prev.actividades.map(act => 
          (act.NumeroActividad || act.id) === activityId 
            ? { ...act, ...updatedActivity }
            : act
        )
      }));
    }
  };

  const deleteActivity = (activityId) => {
    if (!isViewMode) {
      setProject(prev => ({
        ...prev,
        actividades: prev.actividades.filter(act => 
          (act.NumeroActividad || act.id) !== activityId
        )
      }));
    }
  };

  const formatDateForBackend = (dateString, timeString = '') => {
    if (!dateString) return null;
    
    const [hours, minutes] = timeString ? timeString.split(':') : ['00', '00'];
    const date = new Date(dateString);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    try {
      const formattedProject = {
        ...project,
        fechaInicio: formatDateForBackend(project.fechaInicio),
        fechaFinalizacion: formatDateForBackend(project.fechaFinalizacion),
        horarioInicio: formatDateForBackend(project.fechaInicio, project.horarioInicio),
        horarioFinal: formatDateForBackend(project.fechaInicio, project.horarioFinal),
        cantidadParticipantes: parseInt(project.cantidadParticipantes, 10)
      };

      if (id) {
        await axios.put(`/api/projects/${id}`, formattedProject);
      } else {
        const response = await axios.post('/api/projects', formattedProject);
        console.log("Server response:", response.data);
      }
      navigate('/projects');
    } catch (error) {
      setError('Error al guardar el proyecto: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <Container>
        <Navbar />
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Container>
    );
  }

  const renderProjectForm = () => (
    <>
      <ProjectForm 
        project={project} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit}
        handleLocationChange={handleLocationChange}
        isEditing={!isViewMode && !!id}
        readOnly={isViewMode}
      />
      
      {!isViewMode && (
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
      )}
    </>
  );

  const renderActivities = () => (
    <>
      <ActividadList 
        activities={project.actividades} 
        editActivity={!isViewMode ? editActivity : undefined}
        deleteActivity={!isViewMode ? deleteActivity : undefined}
      />
      {!isViewMode && (
        <>
          <h3 className="mt-4">Agregar Nueva Actividad</h3>
          <ActividadForm 
            newActivity={newActivity} 
            handleActivityChange={handleActivityChange} 
            addActivity={addActivity}
          />
        </>
      )}
    </>
  );

  return (
    <Container>
      <Navbar />
      <h1 className="mb-4">
        {isViewMode ? 'Ver Proyecto' : id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
      </h1>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {id ? (
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="details" title="Detalles">
            {renderProjectForm()}
          </Tab>
          
          <Tab eventKey="activities" title="Actividades">
            {renderActivities()}
          </Tab>
          
          <Tab eventKey="participants" title="Participantes">
            <ParticipantList projectId={id} />
          </Tab>

          {isViewMode && (
            <Tab eventKey="stats" title="Estadísticas">
              <StatsContainer type="project" id={id} />
            </Tab>
          )}
        </Tabs>
      ) : (
        // Show only the form for new projects
        renderProjectForm()
      )}
    </Container>
  );
};

export default Project;