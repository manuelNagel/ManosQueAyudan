import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import DenunciaModal from '../DenunciaModal/DenunciaModal';
import styles from './ProjectList.module.css';

const ProjectList = ({ mode = 'owned' }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [mode]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
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

  const handleLeaveProject = async () => {
    if (!selectedProject) return;
    
    try {
      await axios.post(`/api/projects/${selectedProject.idProyecto}/leave`);
      setShowLeaveModal(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      setError('Error al abandonar el proyecto: ' + 
        (error.response?.data?.error || error.message));
    }
  };

  const LeaveProjectModal = () => (
    <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Abandonar Proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro que deseas abandonar el proyecto "{selectedProject?.nombre}"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleLeaveProject}>
          Abandonar
        </Button>
      </Modal.Footer>
    </Modal>
  );



  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            {mode === 'joined' ? 'Proyectos Unidos' : 'Mis Proyectos'}
          </h1>
          {mode === 'owned' && (
            <Link to="/projects/new">
              <Button className={styles.createButton}>
                Crear Nuevo Proyecto
              </Button>
            </Link>
          )}
        </div>

        {error && <Alert className={styles.errorAlert}>{error}</Alert>}

        {projects.length === 0 ? (
          <Alert className={styles.emptyAlert}>
            {mode === 'joined' 
              ? 'No te has unido a ningún proyecto aún.'
              : 'No has creado ningún proyecto aún.'}
          </Alert>
        ) : (
          <div className={styles.tableContainer}>
            <Table responsive className={styles.table}>
              <thead className={styles.tableHeader}>
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
                  <tr key={project.idProyecto} className={styles.tableRow}>
                    <td className={styles.tableCell}>{project.nombre}</td>
                    <td className={styles.tableCell}>{formatDate(project.fechaInicio)}</td>
                    <td className={styles.tableCell}>{formatDate(project.fechaFinalizacion)}</td>
                    <td className={styles.tableCell}>{project.localizacion}</td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.badge} ${project.habilitado ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {project.habilitado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {mode === 'joined' && (
                      <td className={styles.tableCell}>
                        <span className={`${styles.badge} ${project.userRole === 'Administrador' ? styles.badgeAdmin : styles.badgeParticipant}`}>
                          {project.userRole}
                        </span>
                      </td>
                    )}
                    <td className={styles.tableCell}>
                      <div className={styles.actions}>
                        <Link to={`/projects/${mode === 'joined' ? 'joined/' : 'edit/'}${project.idProyecto}`}>
                          <Button className={`${styles.actionButton} ${styles.editButton}`}>
                            {mode === 'joined' ? 'Ver' : 'Editar'}
                          </Button>
                        </Link>
                        {mode === 'owned' ? (
                          <Button 
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(project.idProyecto)}
                          >
                            Eliminar
                          </Button>
                        ) : (
                          <>
                            <Button
                              className={`${styles.actionButton} ${styles.reportButton}`}
                              onClick={() => {
                                setSelectedProject(project);
                                setShowDenunciaModal(true);
                              }}
                            >
                              Reportar
                            </Button>
                            {project.userRole !== 'Administrador' && (
                              <Button
                                className={`${styles.actionButton} ${styles.leaveButton}`}
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowLeaveModal(true);
                                }}
                              >
                                Abandonar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)} className={styles.modal}>
          <Modal.Header closeButton>
            <Modal.Title>Abandonar Proyecto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro que deseas abandonar el proyecto "{selectedProject?.nombre}"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
              Cancelar
            </Button>
            <Button className={styles.leaveButton} onClick={handleLeaveProject}>
              Abandonar
            </Button>
          </Modal.Footer>
        </Modal>
        
        <DenunciaModal
          show={showDenunciaModal}
          handleClose={() => {
            setShowDenunciaModal(false);
            setSelectedProject(null);
          }}
          tipo="Proyecto"
          targetId={selectedProject?.idProyecto}
          targetName={selectedProject?.nombre}
        />
      </Container>
    </div>
  );
};


export default ProjectList;