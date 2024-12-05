import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import FormInput from '../../components/FormInput/FormInput';
import styles from  './Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
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
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/perfil');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during login' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Container className={styles.contentContainer}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Iniciar Sesión</h2>
          
          {errors.general && (
            <Alert variant="danger" className={styles.errorAlert}>
              {errors.general}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
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

            <Button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </Button>
          </Form>

          <div className={styles.linkContainer}>
            <Link to="/register" className={styles.link}>
              ¿No tienes cuenta? Regístrate aquí
            </Link>
            <span className={styles.separator}>•</span>
            <Link to="/passwordReset" className={styles.link}>
              Olvidé mi contraseña
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;