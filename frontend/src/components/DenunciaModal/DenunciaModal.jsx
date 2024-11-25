import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useDenuncia } from '../../hooks/useDenuncia';

const DenunciaModal = ({ 
  show, 
  handleClose, 
  tipo, 
  targetId, 
  targetName 
}) => {
  const [descripcion, setDescripcion] = useState('');
  const { createDenuncia, loading, error } = useDenuncia();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await createDenuncia({
      descripcion,
      tipo,
      targetId
    });

    if (success) {
      handleClose();
      setDescripcion('');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Reportar {tipo === 'Usuario' ? 'Usuario' : 'Proyecto'}: {targetName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Motivo de la denuncia</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el motivo de la denuncia..."
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit} 
          disabled={loading || !descripcion.trim()}
        >
          {loading ? 'Enviando...' : 'Enviar Denuncia'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DenunciaModal;