import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import FormInput from '../../components/FormInput/FormInput';

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
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4">Registro</h2>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />
              <FormInput
                label="Apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                error={errors.apellido}
              />
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormInput
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <FormInput
                label="Confirma Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <button type="submit" className="btn btn-primary">Registrarse</button>
            </form>
            <p className="mt-3">
              ¿Ya tienes una cuenta? <Link to="/login">Logeate Aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;