import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HandHeart, Users, Map, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import mainImage from '../../assets/images/logo.png';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <HandHeart size={40} />,
      title: "Ayuda a tu Comunidad",
      description: "Participa en proyectos sociales que generan un impacto positivo en tu entorno."
    },
    {
      icon: <Users size={40} />,
      title: "Conecta con Otros",
      description: "Forma parte de una comunidad comprometida con el cambio social."
    },
    {
      icon: <Map size={40} />,
      title: "Proyectos Cercanos",
      description: "Encuentra iniciativas cerca de ti y contribuye a tu comunidad local."
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      
      <section className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Bienvenidos a <span className={styles.heroHighlight}>ManosQueAyudan</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Únete a una comunidad comprometida con el cambio social. 
                Encuentra proyectos cerca de ti y marca la diferencia en tu comunidad.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/projects/search">
                  <Button className={`${styles.ctaButton} ${styles.primaryCta}`}>
                    Explorar Proyectos
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button className={`${styles.ctaButton} ${styles.secondaryCta}`}>
                      Crear Cuenta
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <img 
              src={mainImage} 
              alt="ManosQueAyudan" 
              className={styles.heroImage}
            />
          </div>
        </Container>
      </section>

      <section className={styles.featuresSection}>
        <Container>
          <h2 className={styles.sectionTitle}>¿Por qué unirte?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;