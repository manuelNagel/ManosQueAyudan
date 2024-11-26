import React, {useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import LocationPicker from '../LocationPicker/LocationPicker';


const ProjectForm = ({ project, handleChange, handleSubmit, handleLocationChange, isEditing, readOnly }) => {
  const inputStyles = readOnly ? {
    backgroundColor: '#f8f9fa',
    opacity: '0.8',
    cursor: 'not-allowed'
  } : {};


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Proyecto</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={project.nombre}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="descripcion"
          value={project.descripcion}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Fecha de Inicio</Form.Label>
        <Form.Control
          type="date"
          name="fechaInicio"
          value={project.fechaInicio}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Fecha de Finalización</Form.Label>
        <Form.Control
          type="date"
          name="fechaFinalizacion"
          value={project.fechaFinalizacion}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

  


      <Form.Group className="mb-3">
        <Form.Label>Horario de Inicio</Form.Label>
        <Form.Control
          type="time"
          name="horarioInicio"
          value={project.horarioInicio}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Horario de Finalización</Form.Label>
        <Form.Control
          type="time"
          name="horarioFinal"
          value={project.horarioFinal}
          onChange={(e) => handleChange(e)}
          required
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cantidad de Participantes</Form.Label>
        <Form.Control
          type="number"
          name="cantidadParticipantes"
          value={project.cantidadParticipantes}
          onChange={(e) => handleChange(e)}
          required
          min="1"
          readOnly={readOnly}
          disabled={readOnly}
          style={inputStyles}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ubicación</Form.Label>
        <LocationPicker
          initialLocation={{
            lat: project.latitud,
            lng: project.longitud
          }}
          initialLocalizacion={project.localizacion}
          onLocationChange={handleLocationChange}
          readOnly={readOnly}
        />
      </Form.Group>

      {!readOnly && (
        <Button type="submit" variant="primary">
          {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      )}
    </Form>
  );
};

export default ProjectForm;