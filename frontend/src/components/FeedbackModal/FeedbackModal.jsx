import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useFeedback } from '../../hooks/useFeedback';

const FeedbackModal = ({ show, handleClose, recipient, projectId }) => {
  const { createFeedback, loading, error, clearError } = useFeedback();
  const [feedback, setFeedback] = useState({
    puntuacion: 5,
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await createFeedback({
      idProyecto: parseInt(projectId, 10), 
      idDestinatario: recipient.idUsuario,
      puntuacion: parseInt(feedback.puntuacion),
      descripcion: feedback.descripcion || null
    });

    if (result.success) {
      handleClose();
      setFeedback({ puntuacion: 5, descripcion: '' });
    }
    };

  const handleModalClose = () => {
    clearError();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dar Feedback a {recipient?.nombre} {recipient?.apellido}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Puntuación</Form.Label>
            <Form.Select
              value={feedback.puntuacion}
              onChange={(e) => setFeedback(prev => ({ ...prev, puntuacion: e.target.value }))}
            >
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Muy Bueno</option>
              <option value="3">3 - Bueno</option>
              <option value="2">2 - Regular</option>
              <option value="1">1 - Malo</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentario (Opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedback.descripcion}
              onChange={(e) => setFeedback(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Escribe un comentario sobre tu experiencia..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Feedback'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;