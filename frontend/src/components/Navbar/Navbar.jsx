import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

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
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Show these items only when user is logged in */}
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