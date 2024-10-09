import React from 'react';
import { ListGroup } from 'react-bootstrap';

const ActividadList = ({ activities }) => {
  return (
    <ListGroup>
      {activities.map((actividad, index) => (
        <ListGroup.Item key={index}>
          {actividad.nombre} - {actividad.descripcion}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ActividadList;