import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import RemoveParticipantModal from '../RemoveParticipantModal/RemoveParticipantModal';
import DenunciaModal from '../DenunciaModal/DenunciaModal';
import FeedbackModal from '../FeedbackModal/FeedbackModal';
import styles from './ParticipantList.module.css';


const ParticipantList = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [projectId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/projects/${projectId}/participants`);
      
      const participantsList = response.data;
      setParticipants(participantsList);
      
      if (user) {
        const currentUserParticipant = participantsList.find(
          p => p.idUsuario === user.id
        );
        setIsAdmin(currentUserParticipant?.rolId === 1);
      }
    } catch (error) {
      setError('Error al cargar participantes: ' + 
        (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId, reason) => {
    setRemoveLoading(true);
    try {
      await axios.delete(`/api/projects/${projectId}/participants/${participantId}`, {
        data: { reason }
      });
      await fetchParticipants();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error al remover participante');
    } finally {
      setRemoveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>;
  }

  if (participants.length === 0) {
    return <Alert variant="info" className={styles.emptyAlert}>No hay participantes en este proyecto.</Alert>;
  }

  return (
    <div className={styles.listContainer}>
    <Table responsive hover className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Fecha de Ingreso</th>
          {(isAdmin || user) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {participants.map((participant) => (
          <tr key={participant.idUsuario} className={styles.tableRow}>
            <td className={styles.tableCell}>{`${participant.nombre} ${participant.apellido}`}</td>
            <td className={styles.tableCell}>{participant.email}</td>
            <td className={styles.tableCell}>
              <span className={`${styles.rolBadge} ${participant.rolNombre === 'Administrador' ? styles.rolAdmin : styles.rolParticipant}`}>
                {participant.rolNombre}
              </span>
            </td>
            <td className={styles.tableCell}>
              {new Date(participant.fechaInicio).toLocaleDateString('es-AR')}
            </td>
            {(isAdmin || user) && (
              <td className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  {participant.idUsuario !== user.id && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        className={`${styles.actionButton} ${styles.feedbackButton}`}
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowFeedbackModal(true);
                        }}
                      >
                        Feedback
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="danger"
                          size="sm"
                          className={`${styles.actionButton} ${styles.removeButton}`}
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setShowRemoveModal(true);
                          }}
                        >
                          Remover
                        </Button>
                      )}
                      <Button
                        variant="warning"
                        size="sm"
                        className={`${styles.actionButton} ${styles.reportButton}`}
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDenunciaModal(true);
                        }}
                      >
                        Reportar
                      </Button>
                    </>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>

    <RemoveParticipantModal
      show={showRemoveModal}
      handleClose={() => {
        setShowRemoveModal(false);
        setSelectedParticipant(null);
      }}
      participant={selectedParticipant}
      onRemove={handleRemoveParticipant}
      isLoading={removeLoading}
    />

    <DenunciaModal
      show={showDenunciaModal}
      handleClose={() => {
        setShowDenunciaModal(false);
        setSelectedParticipant(null);
      }}
      tipo="Usuario"
      targetId={selectedParticipant?.idUsuario}
      targetName={selectedParticipant ? 
        `${selectedParticipant.nombre} ${selectedParticipant.apellido}` : 
        ''}
    />

    <FeedbackModal
      show={showFeedbackModal}
      handleClose={() => {
        setShowFeedbackModal(false);
        setSelectedParticipant(null);
      }}
      recipient={selectedParticipant}
      projectId={projectId}
    />
  </div>
);
};

export default ParticipantList;