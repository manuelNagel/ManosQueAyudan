import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ActividadList = ({ activities, editActivity, deleteActivity }) => {
  const isEditable = !!editActivity && !!deleteActivity;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          {isEditable && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => {
          const key = activity.NumeroActividad || activity.id || `${activity.nombre}-${activity.descripcion}`;
          
          return (
            <tr key={key}>
              <td>{activity.nombre}</td>
              <td>{activity.descripcion}</td>
              <td>
                <span className={`badge ${activity.estado ? 'bg-success' : 'bg-warning'}`}>
                  {activity.estado ? 'Completada' : 'Pendiente'}
                </span>
              </td>
              {isEditable && (
                <td>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => editActivity(activity.NumeroActividad || activity.id, activity)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => deleteActivity(activity.NumeroActividad || activity.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default ActividadList;