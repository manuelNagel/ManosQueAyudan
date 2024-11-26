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
import ProjectSearch from './pages/ProjectSearch/ProjectSearch';
<<<<<<< HEAD
<<<<<<< HEAD
import Feedback from './pages/Feedback/Feedback';
=======
import Habilidades from './pages/Habilidades/Habilidades';
>>>>>>> 689d91835f42de093e0069509f0a31ce6678657d
=======
import Feedback from './pages/Feedback/Feedback';
import Habilidades from './pages/Habilidades/Habilidades';
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae

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
          <Route path="/projects/search" element={<ProjectSearch />} />
          <Route path="/habilidades" element={<Habilidades />} />


          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/projects" element={<ProjectList mode="owned"/>} />
            <Route path="/projects/new" element={<Project />} />
            <Route path="/projects/edit/:id" element={<Project />} />
            <Route path="/projects/joined" element={<ProjectList mode="joined" />} />
            <Route path="/projects/joined/:id" element={<Project mode="view" />} />
<<<<<<< HEAD
<<<<<<< HEAD
            <Route path="/feedback" element={<Feedback/>} />

=======
            
            <Route path="/habilidades/:id" element={<Habilidades />} />
>>>>>>> 689d91835f42de093e0069509f0a31ce6678657d

=======
            <Route path="/feedback" element={<Feedback/>} />
            <Route path="/habilidades/:id" element={<Habilidades />} />
>>>>>>> e8daf826b7db28580f3c6c98c249554c2895c4ae
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;