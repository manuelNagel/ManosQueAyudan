import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import RemoveParticipantModal from '../RemoveParticipantModal/RemoveParticipantModal';
import DenunciaModal from '../DenunciaModal/DenunciaModal';

const ParticipantList = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
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
      <div className="text-center p-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (participants.length === 0) {
    return <Alert variant="info">No hay participantes en este proyecto.</Alert>;
  }

  return (
    <>
      <Table responsive striped bordered hover>
        <thead>
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
            <tr key={participant.idUsuario}>
              <td>{`${participant.nombre} ${participant.apellido}`}</td>
              <td>{participant.email}</td>
              <td>{participant.rolNombre}</td>
              <td>{new Date(participant.fechaInicio).toLocaleDateString('es-AR')}</td>
              {(isAdmin || user) && (
                <td>
                  <div className="d-flex gap-2">
                    {isAdmin && participant.idUsuario !== user.id && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowRemoveModal(true);
                        }}
                      >
                        Remover
                      </Button>
                    )}
                    {participant.idUsuario !== user.id && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDenunciaModal(true);
                        }}
                      >
                        Reportar
                      </Button>
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
    </>
  );
};

export default ParticipantList;