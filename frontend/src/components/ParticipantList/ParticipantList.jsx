import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ParticipantList = ({ projectId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleRemoveParticipant = async (participantId) => {
    if (!isAdmin) return;
    
    if (!window.confirm('¿Estás seguro que deseas remover a este participante?')) {
      return;
    }

    try {
      await axios.delete(`/api/projects/${projectId}/participants/${participantId}`);
      await fetchParticipants(); // Refresh list
    } catch (error) {
      setError('Error al remover participante: ' + 
        (error.response?.data?.error || error.message));
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
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Fecha de Ingreso</th>
          {isAdmin && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {participants.map((participant) => (
          <tr key={participant.idUsuario}>
            <td>{`${participant.nombre} ${participant.apellido}`}</td>
            <td>{participant.email}</td>
            <td>{participant.rolNombre}</td>
            <td>{new Date(participant.fechaInicio).toLocaleDateString('es-AR')}</td>
            {isAdmin && participant.idUsuario !== user.id && (
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveParticipant(participant.idUsuario)}
                >
                  Remover
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ParticipantList;