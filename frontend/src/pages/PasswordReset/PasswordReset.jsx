import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import FormInput from '../../components/FormInput/FormInput';

import axios from 'axios';

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llamada a la API de Golang para enviar el correo de restablecimiento
      const response = await axios.post('/api/reset-password', { email });
      setStatusMessage(response.data.message); // Mensaje de éxito o error desde el backend
    } catch (error) {
      setStatusMessage("Error al enviar el correo. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4">Restablecer Contraseña</h2>
           {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            <form onSubmit={handleSubmit}>

              <label>
                Ingresa tu correo electrónico:
                <FormInput
                // label="Email"
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              </label>
              <button type="submit" className="btn btn-primary">Reestablecer Contraseña</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
          </div>
        </div>
      </div>
    </div>

  );
};

export default PasswordReset;