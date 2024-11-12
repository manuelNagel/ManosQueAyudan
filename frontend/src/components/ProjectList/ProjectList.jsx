// components/ProjectList/ProjectList.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const ProjectList = ({ mode = 'owned' }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [mode]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use different endpoints based on mode
      const endpoint = mode === 'joined' ? '/api/projects/joined' : '/api/projects';
      const response = await axios.get(endpoint);
      
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error al cargar proyectos: ' + 
        (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (mode !== 'owned') return;
    
    if (window.confirm('¿Estás seguro que deseas eliminar este proyecto?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        setError('Error al eliminar proyecto: ' + 
          (error.response?.data?.error || error.message));
      }
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Navbar />
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h1>{mode === 'joined' ? 'Proyectos Unidos' : 'Mis Proyectos'}</h1>
        {mode === 'owned' && (
          <Link to="/projects/new">
            <Button variant="primary">Crear Nuevo Proyecto</Button>
          </Link>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {projects.length === 0 ? (
        <Alert variant="info">
          {mode === 'joined' 
            ? 'No te has unido a ningún proyecto aún.'
            : 'No has creado ningún proyecto aún.'}
        </Alert>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Localización</th>
              <th>Estado</th>
              {mode === 'joined' && <th>Rol</th>}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.idProyecto}>
                <td>{project.nombre}</td>
                <td>{formatDate(project.fechaInicio)}</td>
                <td>{formatDate(project.fechaFinalizacion)}</td>
                <td>{project.localizacion}</td>
                <td>
                  <span className={`badge ${project.habilitado ? 'bg-success' : 'bg-warning'}`}>
                    {project.habilitado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {mode === 'joined' && (
                  <td>
                    <span className={`badge ${
                      project.userRole === 'Administrador' ? 'bg-primary' : 'bg-info'
                    }`}>
                      {project.userRole}
                    </span>
                  </td>
                )}
                <td>
                  <Link to={`/projects/${mode === 'joined' ? 'joined/' : 'edit/'}${project.idProyecto}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="me-2"
                    >
                      {mode === 'joined' ? 'Ver' : 'Editar'}
                    </Button>
                  </Link>
                  {mode === 'owned' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(project.idProyecto)}
                    >
                      Eliminar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProjectList;