import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../hooks/useFeedback';
import Navbar from '../../components/Navbar/Navbar';

const Feedback = () => {
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [givenFeedback, setGivenFeedback] = useState(null);
  const { user } = useAuth();
  const { getUserFeedbackStats, getUserGivenFeedback, loading, error } = useFeedback();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const [stats, given] = await Promise.all([
          getUserFeedbackStats(user.id),
          getUserGivenFeedback(user.id)
        ]);
        
        if (stats) setFeedbackStats(stats);
        if (given) setGivenFeedback(given);
      }
    };

    fetchData();
  }, [user, getUserFeedbackStats, getUserGivenFeedback]);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  const ReceivedFeedbackContent = () => (
    <>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Resumen General</Card.Title>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>
                {(feedbackStats?.averageScore || 0).toFixed(1)}
                <small className="text-muted"> / 5.0</small>
              </h3>
              <p className="text-muted">Puntuación promedio</p>
            </div>
            <div>
              <h3>{feedbackStats?.totalFeedbacks || 0}</h3>
              <p className="text-muted">Total de feedbacks recibidos</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <h2>Feedback por Proyecto</h2>
        {feedbackStats?.projectStats && feedbackStats.projectStats.length > 0 ? (
          feedbackStats.projectStats.map((projectStat) => (
            <Card key={projectStat.projectId} className="mb-3">
              <Card.Body>
                <Card.Title>{projectStat.projectName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Rol: {projectStat.role || 'No especificado'}
                </Card.Subtitle>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <Badge bg="primary" className="me-2">
                      {(projectStat.averageScore || 0).toFixed(1)} / 5.0
                    </Badge>
                    <small className="text-muted">
                      ({projectStat.feedbackCount || 0} feedbacks)
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Alert variant="info">
            No has recibido ningún feedback aún.
          </Alert>
        )}
      </div>
    </>
  );

  const GivenFeedbackContent = () => (
    <div className="mt-4">
      <h2>Feedback Otorgado</h2>
      {givenFeedback && givenFeedback.length > 0 ? (
        givenFeedback.map((feedback) => (
          <Card key={feedback.idFeedback} className="mb-3">
            <Card.Body>
              <Card.Title>{feedback.proyectoNombre}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Para: {feedback.destinatarioNombre} {feedback.destinatarioApellido}
              </Card.Subtitle>
              <div className="mt-3">
                <Badge bg="primary" className="me-2">
                  {feedback.puntuacion} / 5
                </Badge>
                <small className="text-muted">
                  {new Date(feedback.fecha).toLocaleDateString()}
                </small>
              </div>
              {feedback.descripcion && (
                <div className="mt-3">
                  <p className="text-muted mb-0">{feedback.descripcion}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">
          No has dado ningún feedback aún.
        </Alert>
      )}
    </div>
  );

  return (
    <Container>
      <Navbar />
      <h1 className="my-4">Mi Feedback</h1>

      {error ? (
        <Alert variant="danger" className="mt-4">{error}</Alert>
      ) : (
        <Tabs
          defaultActiveKey="received"
          className="mb-4"
        >
          <Tab eventKey="received" title="Feedback Recibido">
            <div className="pt-4">
              <ReceivedFeedbackContent />
            </div>
          </Tab>
          <Tab eventKey="given" title="Feedback Otorgado">
            <div className="pt-4">
              <GivenFeedbackContent />
            </div>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default Feedback;