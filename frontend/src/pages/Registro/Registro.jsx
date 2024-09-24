import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import FormInput from '../../components/FormInput/FormInput';

const Registro = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration attempt with:', formData);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4">Registro</h2>
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Nombre de Usuario"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
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