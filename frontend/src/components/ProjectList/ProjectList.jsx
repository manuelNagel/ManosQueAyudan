import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar'

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        // Refresh the project list after deletion
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <Container>
         <Navbar></Navbar>
      <h1>Mis Proyectos</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de Inicio</th>
            <th>Localización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.idProyecto}>
              <td>{project.nombre}</td>
              <td>{new Date(project.fechaInicio).toLocaleDateString()}</td>
              <td>{project.localizacion}</td>
              <td>
                <Link to={`/projects/edit/${project.idProyecto}`}>
                  <Button variant="primary" size="sm" className="me-2">Editar</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(project.idProyecto)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProjectList;