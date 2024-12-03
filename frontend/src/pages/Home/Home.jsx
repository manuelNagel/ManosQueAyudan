import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import mainImage from '../../assets/images/logo.png';
import styles from './Home.module.css';

const Home = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Conecta con Voluntarios",
      description: "Únete a una comunidad comprometida con el cambio social y conoce personas que comparten tus valores."
    },
    {
      icon: <MapPin size={24} />,
      title: "Proyectos Cercanos",
      description: "Encuentra oportunidades de voluntariado en tu área y haz la diferencia en tu comunidad local."
    },
    {
      icon: <Calendar size={24} />,
      title: "Gestión de Proyectos",
      description: "Organiza y participa en proyectos sociales de manera eficiente con nuestras herramientas de gestión."
    }
  ];

  return (
    <div className={styles.homeContainer}>
      <Navbar />
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className={styles.heroTitle}>
                Bienvenidos a <span className={styles.brandHighlight}>ManosQueAyudan</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Conectamos personas comprometidas con proyectos sociales que transforman comunidades.
              </p>
              <div className={styles.ctaButtons}>
                <Link to="/projects/search">
                  <Button variant="primary" size="lg" className={styles.mainCta}>
                    Explorar Proyectos
                    <ArrowRight size={20} className="ms-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline-primary" size="lg">
                    Unirse Ahora
                  </Button>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src={mainImage} 
                alt="ManosQueAyudan" 
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <h2 className={styles.ctaTitle}>¿Listo para hacer la diferencia?</h2>
          <p className={styles.ctaText}>
            Únete a nuestra comunidad y comienza a contribuir en proyectos que transforman vidas.
          </p>
          <Link to="/projects/search">
            <Button variant="light" size="lg" className={styles.ctaButton}>
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;