import React, { useMemo } from 'react';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, onJoin, onReport, isAuthenticated, loading }) => {
  const { completionRate, activityStats } = useMemo(() => {
    const activities = project.actividades || [];
    if (activities.length === 0) {
      return {
        completionRate: 0,
        activityStats: { new: 0, inProgress: 0, completed: 0, total: 0 }
      };
    }

    const stats = {
      new: activities.filter(act => act.estado === 0).length,
      inProgress: activities.filter(act => act.estado === 1).length,
      completed: activities.filter(act => act.estado === 2).length,
      total: activities.length
    };

    const rate = (stats.completed / stats.total) * 100;

    return { completionRate: rate, activityStats: stats };
  }, [project.actividades]);

  const getProgressVariant = (rate) => {
    if (rate >= 75) return 'success';
    if (rate >= 50) return 'info';
    if (rate >= 25) return 'warning';
    return 'danger';
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.cardBody}>
        <h3 className={styles.title}>{project.nombre}</h3>
        <p className={styles.description}>{project.descripcion}</p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <i className="bi bi-geo-alt"></i>
            {project.localizacion}
          </div>
          <div className={styles.detailItem}>
            <i className="bi bi-calendar"></i>
            Fecha: {formatDateOnly(project.fechaInicio)}
          </div>
          <div className={styles.detailItem}>
            <i className="bi bi-clock"></i>
            Horario: {formatTimeOnly(project.horarioInicio)} - {formatTimeOnly(project.horarioFinal)}
          </div>
          <div className={styles.detailItem}>
            <i className="bi bi-calendar-check"></i>
            Finaliza: {formatDateOnly(project.fechaFinalizacion)}
          </div>
          <div className={styles.detailItem}>
            <i className="bi bi-people"></i>
            Participantes: {project.cantidadParticipantes}
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Progreso del Proyecto</span>
            <span>{completionRate.toFixed(1)}%</span>
          </div>
          <ProgressBar 
            variant={getProgressVariant(completionRate)}
            now={completionRate} 
            className={styles.progressBar}
          />
          <div className={styles.activitySummary}>
            {activityStats.total === 0 ? (
              <small>Sin actividades registradas</small>
            ) : (
              <>
                <small>
                  {activityStats.completed} terminadas, {activityStats.inProgress} en proceso,{' '}
                  {activityStats.new} nuevas
                </small>
                <div className="mt-1">
                  <small>Total: {activityStats.total} actividades</small>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.actions}>
            {isAuthenticated ? (
              project.isMember ? (
                <Button variant="secondary" disabled>
                  Ya eres miembro
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => onJoin(project.idProyecto)}
                    disabled={loading}
                  >
                    {loading ? 'Uniéndose...' : 'Unirse al Proyecto'}
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => onReport(project)}
                  >
                    Reportar
                  </Button>
                </>
              )
            ) : (
              <Button variant="primary" href="/login">
                Iniciar sesión para unirse
              </Button>
            )}
          </div>
          {project.distance && (
            <span className={styles.distance}>
              {project.distance.toFixed(1)} km
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;