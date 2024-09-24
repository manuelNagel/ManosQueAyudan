import React from 'react';
//import { useAuth } from '../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import { Card, ListGroup } from 'react-bootstrap';

const Perfil = () => {
    const defaultUser = {
        IdUsuario: 1,
        Nombre: "John",
        Apellido: "Doe",
        Email: "john.doe@example.com",
        Activo: true,
        Ciudad: "Ciudad Ejemplo",
        RadioTrabajo: 10
      };
  //const { user } = useAuth();
  const user = defaultUser;

  /*if (!user) {
    return <div>Cargando...</div>;
  }*/

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Perfil de Usuario</h2>
        <Card>
          <Card.Body>
            <Card.Title>{user.Nombre} {user.Apellido}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">ID: {user.IdUsuario}</Card.Subtitle>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Email:</strong> {user.Email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Estado:</strong> {user.Activo ? 'Activo' : 'Inactivo'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Ciudad:</strong> {user.Ciudad}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Radio de Trabajo:</strong> {user.RadioTrabajo} km
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;