import React from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import LocationPicker from '../../components/LocationPicker/LocationPicker';
import { useProjectSearch } from '../../hooks/useProjectSearch';
import { useProjectParticipation } from '../../hooks/useProjectParticipation';

const ProjectSearch = () => {
  const { user } = useAuth();
  const { joinProject, loading: joinLoading, error: joinError } = useProjectParticipation();

  const {
    projects,
    loading,
    error,
    handleLocationSelect,
    isAuthenticated,
    manualLocation,
    searchProjects
  } = useProjectSearch();

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div>
      <Navbar />
      <Container className="mt-4">
        <h2>Buscar Proyectos</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {joinError && <Alert variant="danger">{joinError}</Alert>}

        {!isAuthenticated && (
          <div className="mb-4">
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
              onLocationChange={handleLocationChange}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {isAuthenticated && (
              <Alert variant="info">
                Mostrando proyectos dentro de tu radio de trabajo ({user.radioTrabajo}km)
              </Alert>
            )}
            
            {projects.length === 0 ? (
              <Alert variant="warning">
                No se encontraron proyectos {isAuthenticated ? 
                  'en tu área de trabajo' : 
                  manualLocation.latitude ? 'en esta ubicación' : ''}
              </Alert>
            ) : (
              <Row>
                {projects.map(project => (
                  <Col md={6} lg={4} key={project.idProyecto} className="mb-4">
                    <Card>
                      <Card.Body>
                        <Card.Title>{project.nombre}</Card.Title>
                        <Card.Text>
                          <strong>Descripción:</strong> {project.descripcion}<br/>
                          <strong>Ubicación:</strong> {project.localizacion}<br/>
                          <strong>Inicio:</strong> {formatDateTime(project.fechaInicio)}<br/>
                          <strong>Fin:</strong> {formatDateTime(project.fechaFinalizacion)}<br/>
                          <strong>Horario:</strong> {formatDateTime(project.horarioInicio)} - {formatDateTime(project.horarioFinal)}<br/>
                          <strong>Participantes:</strong> {project.cantidadParticipantes}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          {isAuthenticated ? (
                            project.isMember ? (
                              <Button 
                                variant="secondary" 
                                disabled
                              >
                                Ya eres miembro
                              </Button>
                            ) : (
                              <Button 
                                variant="primary"
                                onClick={() => handleJoinProject(project.idProyecto)}
                                disabled={joinLoading}
                              >
                                {joinLoading ? 'Uniéndose...' : 'Unirse al Proyecto'}
                              </Button>
                            )
                          ) : (
                            <Button 
                              variant="primary" 
                              href="/login"
                            >
                              Iniciar sesión para unirse
                            </Button>
                          )}
                          <small className="text-muted">
                            {project.distance ? `${project.distance.toFixed(1)} km` : ''}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ProjectSearch;