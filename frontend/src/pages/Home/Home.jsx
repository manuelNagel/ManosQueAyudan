import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import mainImage from '../../assets/images/logo.png'; 

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <img src={mainImage} alt="Main focus" className="img-fluid w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <h1>Bienvenidos a ManosQueAyudan</h1>
            <p>¿Como desea colaborar hoy?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;