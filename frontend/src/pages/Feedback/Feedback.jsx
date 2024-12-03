import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../hooks/useFeedback';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Feedback.module.css';

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
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  const ReceivedFeedbackContent = () => (
    <>
      <div className={styles.statsCard}>
        <Card.Title className={styles.statsTitle}>Resumen General</Card.Title>
        <div className={styles.statsFlex}>
          <div>
            <div className={styles.scoreValue}>
              {(feedbackStats?.averageScore || 0).toFixed(1)}
              <small className={styles.scoreLabel}> / 5.0</small>
            </div>
            <p className={styles.scoreLabel}>Puntuación promedio</p>
          </div>
          <div>
            <div className={styles.scoreValue}>{feedbackStats?.totalFeedbacks || 0}</div>
            <p className={styles.scoreLabel}>Total de feedbacks recibidos</p>
          </div>
        </div>
      </div>

      <h2 className={styles.statsTitle}>Feedback por Proyecto</h2>
      {feedbackStats?.projectStats && feedbackStats.projectStats.length > 0 ? (
        feedbackStats.projectStats.map((projectStat) => (
          <div key={projectStat.projectId} className={styles.feedbackCard}>
            <h3 className={styles.projectTitle}>{projectStat.projectName}</h3>
            <p className={styles.userInfo}>Rol: {projectStat.role || 'No especificado'}</p>
            <div className={styles.statsFlex}>
              <div>
                <span className={styles.scoreBadge}>
                  {(projectStat.averageScore || 0).toFixed(1)} / 5.0
                </span>
                <span className={styles.dateText}>
                  ({projectStat.feedbackCount || 0} feedbacks)
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Alert variant="info" className={styles.emptyAlert}>
          No has recibido ningún feedback aún.
        </Alert>
      )}
    </>
  );

  const GivenFeedbackContent = () => (
    <>
      <h2 className={styles.statsTitle}>Feedback Otorgado</h2>
      {givenFeedback && givenFeedback.length > 0 ? (
        givenFeedback.map((feedback) => (
          <div key={feedback.idFeedback} className={styles.feedbackCard}>
            <h3 className={styles.projectTitle}>{feedback.proyectoNombre}</h3>
            <p className={styles.userInfo}>
              Para: {feedback.destinatarioNombre} {feedback.destinatarioApellido}
            </p>
            <div className={styles.statsFlex}>
              <span className={styles.scoreBadge}>
                {feedback.puntuacion} / 5
              </span>
              <span className={styles.dateText}>
                {new Date(feedback.fecha).toLocaleDateString()}
              </span>
            </div>
            {feedback.descripcion && (
              <div className={styles.feedbackComment}>
                {feedback.descripcion}
              </div>
            )}
          </div>
        ))
      ) : (
        <Alert variant="info" className={styles.emptyAlert}>
          No has dado ningún feedback aún.
        </Alert>
      )}
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <Container>
          <h1 className={styles.headerTitle}>Mi Feedback</h1>
        </Container>
      </div>

      <Container>
        {error ? (
          <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>
        ) : (
          <div className={styles.tabsContainer}>
            <Tabs
              defaultActiveKey="received"
              className={styles.customTabs}
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
          </div>
        )}
      </Container>
    </div>
  );
};

export default Feedback;