import React, { useState } from 'react';
import { Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import LocationPicker from '../../components/LocationPicker/LocationPicker';
import { useProjectSearch } from '../../hooks/useProjectSearch';
import { useProjectParticipation } from '../../hooks/useProjectParticipation';
import DenunciaModal from '../../components/DenunciaModal/DenunciaModal';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import styles from './ProjectSearch.module.css';

const ProjectSearch = () => {
  const { user } = useAuth();
  const { joinProject, loading: joinLoading, error: joinError } = useProjectParticipation();
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const {
    projects,
    loading,
    error,
    handleLocationSelect,
    isAuthenticated,
    manualLocation,
    searchProjects
  } = useProjectSearch();

  const handleJoinProject = async (projectId) => {
    try {
      const success = await joinProject(projectId);
      if (success) {
        await searchProjects();
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  const handleLocationChange = (location) => {
    if (location && location.latitud && location.longitud) {
      handleLocationSelect({
        lat: location.latitud,
        lng: location.longitud
      });
    }
  };

  const handleReportProject = (project) => {
    setSelectedProject(project);
    setShowDenunciaModal(true);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container className={styles.contentContainer}>
        <div className={styles.header}>
          <h2>Buscar Proyectos</h2>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {joinError && <Alert variant="danger">{joinError}</Alert>}

        {!isAuthenticated && (
          <div className={styles.locationPickerSection}>
            <Alert variant="info">
              Para ver proyectos, primero selecciona una ubicación.
              {!manualLocation.latitude && 
                ' Los proyectos se mostrarán en un radio de 20km desde el punto seleccionado.'}
            </Alert>
            <LocationPicker
              initialLocation={manualLocation.latitude ? {
                lat: manualLocation.latitude,
                lng: manualLocation.longitude
              } : undefined}
              initialLocalizacion=""
              onLocationChange={handleLocationChange}
            />
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {isAuthenticated && (
              <Alert variant="info" className={styles.radiusAlert}>
                Mostrando proyectos dentro de tu radio de trabajo ({user.radioTrabajo}km)
              </Alert>
            )}
            
            {projects.length === 0 ? (
              <Alert variant="warning" className={styles.noProjectsAlert}>
                No se encontraron proyectos {isAuthenticated ? 
                  'en tu área de trabajo' : 
                  manualLocation.latitude ? 'en esta ubicación' : ''}
              </Alert>
            ) : (
              <Row className={styles.projectGrid}>
                {projects.map(project => (
                  <Col md={6} lg={4} key={project.idProyecto} className={styles.projectColumn}>
                    <ProjectCard
                      project={project}
                      onJoin={handleJoinProject}
                      onReport={() => handleReportProject(project)}
                      isAuthenticated={isAuthenticated}
                      loading={joinLoading}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}

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

export default ProjectSearch;