import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import styles from './Kanban.module.css';
import { useActividades } from '../../hooks/useActividades';

// Tipos de elementos para drag and drop
const ItemTypes = {
  ACTIVITY: 'activity'
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

// Componente para una actividad individual
const Activity = ({ activity, moveActivity, removeActivity, isAdmin }) => { // Add isAdmin prop
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { 
      id: activity.numeroActividad, 
      estado: activity.estado 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <Card
      ref={drag}
      className={`${styles.activityCard} ${isDragging ? styles.dragging : ''}`}
    >
      <Card.Body className={styles.activityContent}>
        <div>
          <Card.Text className={styles.activityText}>{activity.nombre}</Card.Text>
          <small className={styles.activityStatus}>
            Estado: {getStatusLabel(activity.estado)}
          </small>
        </div>
        {isAdmin && ( 
          <Button
            variant="danger"
            size="sm"
            className={styles.removeBtn}
            onClick={() => removeActivity(activity.numeroActividad)}
          >
            Eliminar
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

const Kanban = ({ projectId, onStateChange,isAdmin }) => {
  const { actividades, updateActividad, removeActividad, fetchActividades } = 
    useActividades(projectId, onStateChange);
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

  // Componente de columna de estado con drop target
  const StatusColumn = ({ status }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.ACTIVITY,
      drop: (draggedItem) => {
        if (draggedItem.estado !== status) {
          moveActivity(draggedItem.id, draggedItem.estado, status);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    });

    return (
      <Col>
        <Card 
          ref={drop} 
          className={`${styles.column} ${
            status === 0 
              ? styles.columnNew 
              : status === 1 
              ? styles.columnInProgress 
              : styles.columnCompleted
          }`}
        >
          <Card.Header className={styles.columnHeader}>
            {getStatusLabel(status)}
          </Card.Header>
          <Card.Body className={styles.columnBody}>
            {groupedActivities[status]?.map((activity) => (
              <Activity
                key={activity.numeroActividad}
                activity={activity}
                moveActivity={moveActivity}
                removeActivity={removeActivity}
                isAdmin={isAdmin} 
              />
            ))}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const removeActivity = async (actividadId) => {
    try {
      await removeActividad(actividadId);
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  const moveActivity = async (activityId, fromStatus, toStatus) => {
    const movingActivity = actividades.find(a => a.numeroActividad === activityId);
  
    if (movingActivity) {
      const updatedActivity = {
        ...movingActivity,
        estado: toStatus
      };
  
      try {
        await updateActividad(updatedActivity);
      } catch (error) {
        console.error("Error al mover actividad:", error);
      }
    }
  };

  

  const addActivity = async () => {
    if (!newActivity.nombre.trim()) return;

    try {
      await axios.post(`/api/projects/${projectId}/actividades`, {
        nombre: newActivity.nombre,
        estado: newActivity.estado,
        projectId: projectId
      });
      
      await fetchActividades();
      
      setNewActivity({ nombre: '', estado: 0 });
      setShowModal(false);
    } catch (error) {
      console.error("Error al añadir actividad:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <Container fluid className={styles.container}>
      <Button
        variant="primary"
        className={styles.newActivityBtn}
        onClick={() => setShowModal(true)}
      >
        Nueva Actividad
      </Button>

      <Row className={styles.columnRow}>
        {[0, 1, 2].map((status) => (
          <StatusColumn key={status} status={status} />
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} className={styles.modal}>
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