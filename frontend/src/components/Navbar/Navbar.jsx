import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import logo from '../../assets/images/logo.png'
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
          ManosQueAyudan
        </Link>
        <div className="navbar-nav ml-auto">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/action1">Crear Proyecto</Dropdown.Item>
              <Dropdown.Item as={Link} to="/action2">Mis proyectos</Dropdown.Item>
              <Dropdown.Item as={Link} to="/action3">Buscar Proyectos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Link to="/login" className="btn btn-outline-primary ml-2">Login</Link>
          <Link to="/register" className="btn btn-primary ml-2">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;