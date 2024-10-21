import React, { useState } from 'react';
import { ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import './ActividadList.module.css'

const ActividadList = ({ activities, editActivity, deleteActivity }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', descripcion: '', estado: false });

  const handleEdit = (activity) => {
    setEditingId(activity.id);
    setEditForm(activity);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: name === 'estado' ? e.target.checked : value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editActivity(editingId, editForm);
    setEditingId(null);
  };

  return (
    <ListGroup>
      {activities.map((actividad) => (
        <ListGroup.Item key={actividad.id} className="py-3">
          {editingId === actividad.id ? (
            <Form onSubmit={handleEditSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      type="text"
                      name="descripcion"
                      value={editForm.descripcion}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mt-4">
                    <Form.Check
                      type="checkbox"
                      name="estado"
                      checked={editForm.estado}
                      onChange={handleEditChange}
                      label="Completado"
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end justify-content-end">
                  <Button type="submit" variant="success" size="sm" className="me-2">Guardar</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancelar</Button>
                </Col>
              </Row>
            </Form>
          ) : (
            <Row className="align-items-center">
              <Col md={10}>
                <strong>{actividad.nombre}</strong> - {actividad.descripcion}
                {actividad.estado && <span className="ms-2 text-success">(Completado)</span>}
              </Col>
              <Col md={2} className="text-end">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(actividad)}>Editar</Button>
                <Button variant="outline-danger" size="sm" onClick={() => deleteActivity(actividad.id)}>Eliminar</Button>
              </Col>
            </Row>
          )}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ActividadList;