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
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LocationTestPage from './components/LocationPicker/LocationPicker.test';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/countries" element={<Countries/>} />
          <Route path="/LocationPickerTest" element={<LocationTestPage/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
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