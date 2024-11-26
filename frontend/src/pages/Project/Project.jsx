import React, { useState, useEffect ,useCallback} from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert,Tab,Tabs } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import ActividadList from '../../components/ActividadList/ActividadList';
import ActividadForm from '../../components/ActividadForm/ActividadForm';
import Navbar from '../../components/Navbar/Navbar';
import ParticipantList from '../../components/ParticipantList/ParticipantList';
import ShareButton from '../../components/ShareButton/ShareButton';
import StatsContainer from '../../components/StatsContainer/StatsContainer';
import { AlignLeft } from 'lucide-react';

import Kanban from '../../components/Kanban/Kanban';

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
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = location.pathname.includes('/projects/joined/');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadProjectData = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          
          // Fetch project data
          const projectResponse = await axios.get(`/api/projects/${id}`);
          const fetchedProject = projectResponse.data;
          setProject({
            ...fetchedProject,
            actividades: fetchedProject.actividades || [], 
            fechaInicio: fetchedProject.fechaInicio ? fetchedProject.fechaInicio.split('T')[0] : '',
            fechaFinalizacion: fetchedProject.fechaFinalizacion ? fetchedProject.fechaFinalizacion.split('T')[0] : '',
            horarioInicio: fetchedProject.horarioInicio ? new Date(fetchedProject.horarioInicio).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
            horarioFinal: fetchedProject.horarioFinal ? new Date(fetchedProject.horarioFinal).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''
          });
  
          // Check admin status
          if (user) {
            const adminResponse = await axios.get(`/api/projects/${id}/admin`);
            const adminUser = adminResponse.data;
            setIsAdmin(adminUser?.id === user.id);
          }
        } catch (error) {
          setError('Error al cargar el proyecto: ' + (error.response?.data?.error || error.message));
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    loadProjectData();
  }, [id, user?.id]);

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

  const handleActivitiesChange = useCallback((updatedActivities) => {
    setProject(prev => ({
      ...prev,
      actividades: updatedActivities
    }));
  }, []);

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const addActivity = () => {
    if (!isViewMode) {
      const highestActivityNumber = project.actividades.reduce((max, activity) => {
        const currentNumber = activity.NumeroActividad || activity.numeroActividad || 0;
        return currentNumber > max ? currentNumber : max;
      }, 0);
  
      const newActivityWithId = {
        ...newActivity,
        NumeroActividad: highestActivityNumber + 1
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
    <div className="mt-4">
      <h2>Actividades</h2>
      <ActividadList 
        activities={project?.actividades || []}
        editActivity={!isViewMode ? editActivity : undefined}
        deleteActivity={!isViewMode ? deleteActivity : undefined}
        isAdmin={isAdmin}
      />
      <Kanban 
        projectId={id} 
        isAdmin={isAdmin}
        onStateChange={handleActivitiesChange}
      />
    </div>
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
        renderProjectForm()
      )}
    </Container>
  );
};

export default Project;