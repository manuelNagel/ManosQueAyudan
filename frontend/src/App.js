import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login/Login';
import Registro from './pages/Registro/Registro';
import Home from './pages/Home/Home';
import Perfil from './components/Perfil/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />

      </Routes>
    </Router>
  );
}

export default App;
