import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { useActividades } from '../../hooks/useActividades';

// Tipos de elementos para drag and drop
const ItemTypes = {
  ACTIVITY: 'activity'
};

// Componente para una actividad individual
const Activity = ({ activity, moveActivity, removeActivity }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: {
      id: activity.id,
      estado: activity.estado
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ACTIVITY,
    drop: (draggedItem) => {
      // Solo permitir mover si no está en la misma columna y el estado es válido
      if (draggedItem.id !== activity.id && draggedItem.estado !== activity.estado) {
        moveActivity(draggedItem.id, draggedItem.estado, activity.estado);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <Card
      ref={(node) => drag(drop(node))}
      className={`mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Text>{activity.nombre}</Card.Text>
          <small className="text-muted">
            Estado: {getStatusLabel(activity.estado)}
          </small>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => removeActivity(activity.numeroActividad)}
        >
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

// Función para obtener etiqueta de estado
const getStatusLabel = (status) => {
  switch (status) {
    case 0: return 'Nuevo';
    case 1: return 'En Proceso';
    case 2: return 'Terminado';
    default: return 'Desconocido';
  }
};

const Kanban = ({ projectId }) => {
  const { actividades, updateActividad, removeActividad, fetchActividades } = useActividades(projectId);
  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    nombre: '',
    estado: 0
  });

  // Agrupar actividades por estado
  const groupedActivities = actividades.reduce((acc, activity) => {
    if (!acc[activity.estado]) acc[activity.estado] = [];
    acc[activity.estado].push(activity);
    return acc;
  }, { 0: [], 1: [], 2: [] });

  const removeActivity = async (actividadId) => {
    try {
      await removeActividad(actividadId);
    } catch (error) {
      // Manejar errores si es necesario
      console.error("Error al eliminar actividad:", error);
    }
  };

  const moveActivity = async (activityId, fromStatus, toStatus) => {
    // Encontrar la actividad que se está moviendo
    const movingActivity = actividades.find(a => a.id === activityId);

    if (movingActivity) {
      // Crear nuevo objeto de actividad con estado actualizado
      const updatedActivity = {
        ...movingActivity,
        estado: toStatus
      };

      // Usar el hook para actualizar la actividad
      await updateActividad(updatedActivity);
    }
  };

  const addActivity = async () => {
    if (!newActivity.nombre.trim()) return;

    try {
      // Modificar la llamada para enviar los datos correctamente
      await axios.post(`/api/projects/${projectId}/actividades`, {
        nombre: newActivity.nombre,
        estado: newActivity.estado,
        projectId: projectId  // Asegúrate de enviar el projectId si es necesario
      });
      
      // Usar fetchActividades para recargar la lista
      await fetchActividades();
      
      // Cerrar modal y resetear formulario
      setNewActivity({ nombre: '', estado: 0 });
      setShowModal(false);
    } catch (error) {
      console.error("Error al añadir actividad:", error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowModal(true)}
        >
          Nueva Actividad
        </Button>

        <Row>
          {[0, 1, 2].map((status) => (
            <Col key={status}>
              <Card>
                <Card.Header>
                  {getStatusLabel(status)}
                </Card.Header>
                <Card.Body>
                  {groupedActivities[status]?.map((activity) => (
                    <Activity
                      key={activity.id}
                      activity={activity}
                      moveActivity={moveActivity}
                      // Add this line to pass removeActivity
                      removeActivity={removeActivity}
                    />
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Actividad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Nombre de la Actividad</Form.Label>
                <Form.Control
                  type="text"
                  value={newActivity.nombre}
                  onChange={(e) => setNewActivity(prev => ({
                    ...prev,
                    nombre: e.target.value
                  }))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  value={newActivity.estado}
                  onChange={(e) => setNewActivity(prev => ({
                    ...prev,
                    estado: parseInt(e.target.value)
                  }))}
                >
                  <option value={0}>Nuevo</option>
                  <option value={1}>En Proceso</option>
                  <option value={2}>Terminado</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={addActivity}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DndProvider>
  );
};

export default Kanban;