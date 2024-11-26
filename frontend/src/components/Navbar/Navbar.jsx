import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';
import Notificaciones from '../Notificaciones/Notificaciones';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
          ManosQueAyudan
        </Link>
        <Nav className="ml-auto">
        {user && ( <Notificaciones />)} 
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Quiero...
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {user && (
                <>
                  <Dropdown.Item as={Link} to="/projects/new">Crear Proyecto</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/projects">Mis Proyectos</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/projects/joined">Proyectos Unidos</Dropdown.Item>

                </>
              )}
              {/* This item is always visible */}
              <Dropdown.Item as={Link} to="/projects/search">Buscar Proyectos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-user">
              {user ? user.nombre || 'Usuario' : 'Usuario'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {user ? (
                <>
                  <Dropdown.Item as={Link} to="/perfil">Ver Perfil</Dropdown.Item>
<<<<<<< HEAD
<<<<<<< HEAD
                  <Dropdown.Item as={Link} to="/feedback">Mi Feedback</Dropdown.Item>
=======
                  <Dropdown.Item as={Link} to="/Habilidades">Mis Habilidades</Dropdown.Item>
>>>>>>> 689d91835f42de093e0069509f0a31ce6678657d
=======
                  <Dropdown.Item as={Link} to="/feedback">Mi Feedback</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/Habilidades">Mis Habilidades</Dropdown.Item>
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </nav>
  );
};

export default Navbar;