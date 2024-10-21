import React from 'react';
import { Form, Button } from 'react-bootstrap';

const ProjectForm = ({ project, handleChange, handleSubmit, isEditing }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text" name="nombre" value={project.nombre} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" name="descripcion" value={project.descripcion} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Fecha de Inicio</Form.Label>
        <Form.Control type="date" name="fechaInicio" value={project.fechaInicio} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Fecha de Finalización</Form.Label>
        <Form.Control type="date" name="fechaFinalizacion" value={project.fechaFinalizacion} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Localización</Form.Label>
        <Form.Control type="text" name="localizacion" value={project.localizacion} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cantidad de Participantes</Form.Label>
        <Form.Control type="number" name="cantidadParticipantes" value={project.cantidadParticipantes} onChange={handleChange} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Horario</Form.Label>
        <Form.Control type="time" name="horario" value={project.horario} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        {isEditing ? 'Update Project' : 'Create Project'}
      </Button>
    </Form>
  );
};

export default ProjectForm;