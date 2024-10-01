import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import { Card, Alert } from 'react-bootstrap';

const Perfil = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  const handleSubmit = async (updatedUserData) => {
    setError('');
    setSuccess('');
    try {
      await updateUserProfile(updatedUserData);
      setSuccess('Perfil actualizado con éxito');
    } catch (err) {
      setError('Error al actualizar el perfil: ' + err.message);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Perfil de Usuario</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Card>
          <Card.Body>
            <ProfileForm 
              user={user} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;