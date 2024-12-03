import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';
import Notificaciones from '../Notificaciones/Notificaciones';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className={styles.brandContainer}>
            <img src={logo} alt="Logo" className={styles.brandLogo} />
            <span className={styles.brandName}>ManosQueAyudan</span>
          </Link>

          <Nav className="d-flex align-items-center gap-3">
            {user && <Notificaciones />}
            
            <Dropdown className={styles.navDropdown}>
              <Dropdown.Toggle id="dropdown-projects">
                Quiero...
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                {user && (
                  <>
                    <Dropdown.Item as={Link} to="/projects/new" className={styles.dropdownItem}>
                      Crear Proyecto
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/projects" className={styles.dropdownItem}>
                      Mis Proyectos
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/projects/joined" className={styles.dropdownItem}>
                      Proyectos Unidos
                    </Dropdown.Item>
                  </>
                )}
                <Dropdown.Item as={Link} to="/projects/search" className={styles.dropdownItem}>
                  Buscar Proyectos
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className={styles.userDropdown}>
              <Dropdown.Toggle id="dropdown-user">
                {user ? user.nombre || 'Usuario' : 'Usuario'}
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                {user ? (
                  <>
                    <Dropdown.Item as={Link} to="/perfil" className={styles.dropdownItem}>
                      Ver Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/feedback" className={styles.dropdownItem}>
                      Mi Feedback
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Habilidades" className={styles.dropdownItem}>
                      Mis Habilidades
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className={styles.dropdownItem}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/login" className={styles.dropdownItem}>
                      Iniciar Sesión
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/register" className={styles.dropdownItem}>
                      Registrarse
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;