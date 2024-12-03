import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import { Card, Alert, Tabs, Tab, Container, Spinner } from 'react-bootstrap';
import StatsContainer from '../../components/StatsContainer/StatsContainer';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { user, loading, updateUserProfile } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.spinner}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <Container>
          <Alert variant="danger" className={styles.errorAlert}>
            Usuario no encontrado
          </Alert>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (updatedUserData) => {
    setError('');
    setSuccess('');
    try {
      await updateUserProfile(updatedUserData);
      setSuccess('Perfil actualizado con éxito');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar el perfil: ' + err.message);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      
      <div className={styles.header}>
        <Container>
          <h1 className={styles.headerTitle}>Perfil de Usuario</h1>
        </Container>
      </div>

      <Container>
        {error && (
          <Alert variant="danger" className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className={styles.successAlert}>
            {success}
          </Alert>
        )}
        
        <div className={styles.tabsContainer}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className={styles.customTabs}
          >
            <Tab eventKey="profile" title="Perfil">
              <Card className={styles.card}>
                <Card.Body className={styles.cardBody}>
                  <ProfileForm 
                    user={user} 
                    onSubmit={handleSubmit} 
                    onCancel={handleCancel}
                  />
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="stats" title="Estadísticas">
              <Card className={styles.card}>
                <Card.Body className={styles.cardBody}>
                  <StatsContainer type="user" id={user.id} />
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default Perfil;