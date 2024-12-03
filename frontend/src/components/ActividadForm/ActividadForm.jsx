import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ActividadForm = ({ newActivity, handleActivityChange, addActivity }) => {
  return (
    <Row>
      <Col>
        <Form.Group>
          <Form.Label>Nueva Actividad - Nombre</Form.Label>
          <Form.Control 
            type="text" 
            name="nombre" 
            value={newActivity.nombre} 
            onChange={handleActivityChange} 
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <Form.Label>Nueva Actividad - Descripción</Form.Label>
          <Form.Control 
            type="text" 
            name="descripcion" 
            value={newActivity.descripcion} 
            onChange={handleActivityChange} 
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Check 
            type="checkbox" 
            name="estado" 
            checked={newActivity.estado} 
            onChange={(e) => handleActivityChange({ target: { name: 'estado', value: e.target.checked } })} 
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default ActividadForm;