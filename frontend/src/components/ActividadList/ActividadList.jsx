import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import styles from './ActividadList.module.css';

const ActividadList = ({ activities, editActivity, deleteActivity, isAdmin }) => {
  if (!activities) {
    return (
      <Alert variant="info" className={styles.noActivities}>
        No hay actividades disponibles
      </Alert>
    );
  }

  const ActividadList = Array.isArray(activities) ? activities : [];

  if (ActividadList.length === 0) {
    return (
      <Alert variant="info" className={styles.noActivities}>
        No hay actividades registradas para este proyecto
      </Alert>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <Table responsive striped bordered hover className={styles.customTable}>
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
                <Badge
                  bg={
                    (activity.Estado || activity.estado) === 2 ? 'success' : 
                    (activity.Estado || activity.estado) === 1 ? 'primary' : 
                    'warning'
                  }
                  className={styles.customBadge}
                >
                  {(activity.Estado || activity.estado) === 2 ? 'Terminado' : 
                   (activity.Estado || activity.estado) === 1 ? 'En Proceso' : 
                   'Pendiente'}
                </Badge>
              </td>
              {(editActivity || deleteActivity) && (
                <td>
                  <div className="d-flex gap-2">
                    {editActivity && (
                      <Button
                        variant="primary"
                        size="sm"
                        className={styles.actionButton}
                        onClick={() => editActivity(activity.NumeroActividad || activity.numeroActividad, activity)}
                      >
                        Editar
                      </Button>
                    )}
                    {deleteActivity && isAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        className={styles.actionButton}
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
    </div>
  );
};

export default ActividadList;