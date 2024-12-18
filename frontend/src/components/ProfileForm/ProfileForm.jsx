import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import LocationPicker from '../LocationPicker/LocationPicker';
import ComboBox from '../ComboBox/ComboBox';
import useCountries from '../../hooks/useCountries';
import styles from './ProfileForm.module.css';


const ProfileForm = ({ user, onSubmit, onCancel }) => {
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { countries, loading, error } = useCountries();

  useEffect(() => {
    if (user) {
      setEditedUser({
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        activo: user.activo || false,
        pais: user.pais || '',
        localizacion: user.localizacion || '',
        radioTrabajo: user.radioTrabajo || '',
        latitud: user.Latitud || -34.603722,
        longitud: user.Longitud || -58.381592,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleComboBoxChange = (value) => {
    setEditedUser(prevUser => ({
      ...prevUser,
      pais: value
    }));
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

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        activo: user.activo || false,
        pais: user.pais || '',
        localizacion: user.localizacion || '',
        radioTrabajo: user.radioTrabajo || '',
        latitud: user.Latitud || -34.603722,
        longitud: user.Longitud || -58.381592,
      });
    }
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Información Personal</h3>
        
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={editedUser.nombre || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            value={editedUser.apellido || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={editedUser.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.formControl}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>País</Form.Label>
          <div className={styles.formControl}>
            <ComboBox
              options={countries}
              defaultTitle="Elige un País"
              value={editedUser.pais}
              onChange={handleComboBoxChange}
              disabled={!isEditing}
            />
          </div>
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Radio de Trabajo (km)</Form.Label>
          <Form.Control
            type="number"
            name="radioTrabajo"
            value={editedUser.radioTrabajo || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.formControl}
          />
        </Form.Group>
      </div>
      
      {isEditing && (
        <div className={styles.locationSection}>
          <h3 className={styles.sectionTitle}>Ubicación</h3>
          <LocationPicker
            initialLocation={{
              lat: editedUser.latitud,
              lng: editedUser.longitud
            }}
            initialLocalizacion={editedUser.localizacion}
            onLocationChange={handleLocationChange}
          />
        </div>
      )}

        {isEditing ? (
          <>
            <Button type="submit" className={styles.saveButton}>
              Guardar Cambios
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button 
            variant="primary" 
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            Editar Perfil
          </Button>
        )}
      
    </Form>
  );
};

export default ProfileForm;