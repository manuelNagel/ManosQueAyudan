import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const RemoveParticipantModal = ({ 
  show, 
  handleClose, 
  participant, 
  onRemove,
  isLoading 
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Debes proporcionar una razón para la expulsión');
      return;
    }
    try {
      await onRemove(participant.idUsuario, reason);
      handleClose();
      setReason('');
      setError('');
    } catch (err) {
      setError(err.message || 'Error al remover participante');
    }
  };

  const onHide = () => {
    setReason('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Remover Participante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <p>
          ¿Estás seguro que deseas remover a{' '}
          <strong>{participant?.nombre} {participant?.apellido}</strong>?
        </p>
        
        <Form.Group className="mb-3">
          <Form.Label>Razón de la expulsión</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ingresa la razón de la expulsión..."
            required
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
          disabled={isLoading || !reason.trim()}
        >
          {isLoading ? 'Removiendo...' : 'Remover'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveParticipantModal;