import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const ProfileForm = ({ user, onSubmit, onCancel }) => {
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedUser);
    setIsEditing(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="Nombre"
          value={editedUser.Nombre || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="Apellido"
          value={editedUser.Apellido || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="Email"
          value={editedUser.Email || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control
          type="text"
          name="Ciudad"
          value={editedUser.Ciudad || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Radio de Trabajo (km)</Form.Label>
        <Form.Control
          type="number"
          name="RadioTrabajo"
          value={editedUser.RadioTrabajo || ''}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </Form.Group>
      {isEditing ? (
        <>
          <Button variant="primary" type="submit">Guardar Cambios</Button>
          <Button variant="secondary" onClick={() => {
            setIsEditing(false);
            onCancel();
          }} className="ml-2">Cancelar</Button>
        </>
      ) : (
        <Button variant="primary" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
      )}
    </Form>
  );
};

export default ProfileForm;