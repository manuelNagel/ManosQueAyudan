import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login/Login';
import Registro from './pages/Registro/Registro';
import Home from './pages/Home/Home';
import ProjectList from './components/ProjectList/ProjectList'
import Perfil from './pages/Perfil/Perfil';
import Project from './pages/Project/Project';
import Countries from './pages/Countries/Countries'
import PasswordReset from './pages/PasswordReset/PasswordReset';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/countries" element={<Countries/>} />
          <Route path="/passwordReset"element={<PasswordReset/>} />
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path='/habilidades' element={<Habilidades />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/new" element={<Project />} />
            <Route path="/projects/edit/:id" element={<Project />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;