import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import LocationPicker from '../LocationPicker/LocationPicker';

const ProfileForm = ({ user, onSubmit, onCancel }) => {
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        activo: user.activo,
        localizacion: user.Localizacion,
        radioTrabajo: user.radioTrabajo,
        latitud: user.Latitud || -34.603722,
        longitud: user.Longitud || -58.381592,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location) => {
    setEditedUser(prev => ({
      ...prev,
      latitud: location.latitud,
      longitud: location.longitud,
      localizacion: location.localizacion,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userToSubmit = {
      ...editedUser,
      latitud: parseFloat(editedUser.latitud),
      longitud: parseFloat(editedUser.longitud),
      radioTrabajo: parseInt(editedUser.radioTrabajo, 10)
    };
    onSubmit(userToSubmit);
    setIsEditing(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"  
          value={editedUser.nombre || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="apellido"  
          value={editedUser.apellido || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"  
          value={editedUser.email || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      
      {isEditing && (
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <LocationPicker
            initialLocation={{
              lat: editedUser.latitud,
              lng: editedUser.longitud
            }}
            initialLocalizacion={editedUser.localizacion}
            onLocationChange={handleLocationChange}
            radioTrabajo={parseInt(editedUser.radioTrabajo, 10)}
          />
        </Form.Group>
      )}
      
      
      <Form.Group className="mb-3">
        <Form.Label>Radio de Trabajo (km)</Form.Label>
        <Form.Control
          type="number"
          name="radioTrabajo"  
          value={editedUser.radioTrabajo || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      
      {isEditing ? (
        <>
          <Button variant="primary" type="submit">Guardar Cambios</Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              setIsEditing(false);
              setEditedUser(user);
              onCancel();
            }} 
            className="ms-2"
          >
            Cancelar
          </Button>
        </>
      ) : (
        <Button variant="primary" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
      )}
    </Form>
  );
};

export default ProfileForm;