import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';

const ActividadList = ({ activities, editActivity, deleteActivity }) => {
  // Defensive check for null/undefined activities
  if (!activities) {
    return (
      <Alert variant="info">
        No hay actividades disponibles
      </Alert>
    );
  }

  // Ensure activities is treated as an array
  const ActividadList = Array.isArray(activities) ? activities : [];

  if (ActividadList.length === 0) {
    return (
      <Alert variant="info">
        No hay actividades registradas para este proyecto
      </Alert>
    );
  }

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          {(editActivity || deleteActivity) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {ActividadList.map((activity) => (
          <tr key={activity.NumeroActividad || activity.numeroActividad}>
            <td>{activity.NumeroActividad || activity.numeroActividad}</td>
            <td>{activity.Nombre || activity.nombre}</td>
            <td>{activity.Descripcion || activity.descripcion}</td>
            <td>
              <Badge bg={activity.Estado || activity.estado ? 'success' : 'warning'}>
                {(activity.Estado || activity.estado) ? 'Completada' : 'Pendiente'}
              </Badge>
            </td>
            {(editActivity || deleteActivity) && (
              <td>
                <div className="d-flex gap-2">
                  {editActivity && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => editActivity(activity.NumeroActividad || activity.numeroActividad, activity)}
                    >
                      Editar
                    </Button>
                  )}
                  {deleteActivity && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteActivity(activity.NumeroActividad || activity.numeroActividad)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ActividadList;