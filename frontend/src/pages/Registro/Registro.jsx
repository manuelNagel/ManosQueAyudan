import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import styles from './Registro.module.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/perfil');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during registration' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container className={styles.contentContainer}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Registro</h2>
          
          {errors.general && (
            <Alert variant="danger" className={styles.errorAlert}>
              {errors.general}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={styles.formControl}
                isInvalid={!!errors.nombre}
                placeholder="Ingresa tu nombre"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={styles.formControl}
                isInvalid={!!errors.apellido}
                placeholder="Ingresa tu apellido"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.apellido}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formControl}
                isInvalid={!!errors.email}
                placeholder="Ingresa tu email"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formControl}
                isInvalid={!!errors.password}
                placeholder="Ingresa tu contraseña"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={styles.formGroup}>
              <Form.Label className={styles.formLabel}>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.formControl}
                isInvalid={!!errors.confirmPassword}
                placeholder="Confirma tu contraseña"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className={styles.submitButton}>
              Registrarse
            </Button>
          </Form>

          <div className={styles.linkContainer}>
            <Link to="/login" className={styles.link}>
              ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Registro;