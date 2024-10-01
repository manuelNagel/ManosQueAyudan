import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login/Login';
import Registro from './pages/Registro/Registro';
import Home from './pages/Home/Home';
import Perfil from './pages/Perfil/Perfil';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;