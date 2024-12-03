import React from 'react';
import { Form, Button } from 'react-bootstrap';
import LocationPicker from '../LocationPicker/LocationPicker';
import styles from './ProjectForm.module.css';

const ProjectForm = ({ project, handleChange, handleSubmit, handleLocationChange, isEditing, readOnly }) => {
  return (
    <Form onSubmit={handleSubmit} className={styles.formContainer}>
      <Form.Group className={styles.formGroup}>
        <Form.Label className={styles.formLabel}>Nombre del Proyecto</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={project.nombre}
          onChange={handleChange}
          required
          readOnly={readOnly}
          disabled={readOnly}
          className={styles.formControl}
        />
      </Form.Group>

      <Form.Group className={styles.formGroup}>
        <Form.Label className={styles.formLabel}>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="descripcion"
          value={project.descripcion}
          onChange={handleChange}
          required
          readOnly={readOnly}
          disabled={readOnly}
          className={`${styles.formControl} ${styles.textArea}`}
        />
      </Form.Group>

      <div className={styles.dateTimeInputs}>
        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Fecha de Inicio</Form.Label>
          <Form.Control
            type="date"
            name="fechaInicio"
            value={project.fechaInicio}
            onChange={handleChange}
            required
            readOnly={readOnly}
            disabled={readOnly}
            className={styles.dateInput}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Fecha de Finalización</Form.Label>
          <Form.Control
            type="date"
            name="fechaFinalizacion"
            value={project.fechaFinalizacion}
            onChange={handleChange}
            required
            readOnly={readOnly}
            disabled={readOnly}
            className={styles.dateInput}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Horario de Inicio</Form.Label>
          <Form.Control
            type="time"
            name="horarioInicio"
            value={project.horarioInicio}
            onChange={handleChange}
            required
            readOnly={readOnly}
            disabled={readOnly}
            className={styles.timeInput}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label className={styles.formLabel}>Horario de Finalización</Form.Label>
          <Form.Control
            type="time"
            name="horarioFinal"
            value={project.horarioFinal}
            onChange={handleChange}
            required
            readOnly={readOnly}
            disabled={readOnly}
            className={styles.timeInput}
          />
        </Form.Group>
      </div>

      <Form.Group className={styles.formGroup}>
        <Form.Label className={styles.formLabel}>Cantidad de Participantes</Form.Label>
        <Form.Control
          type="number"
          name="cantidadParticipantes"
          value={project.cantidadParticipantes}
          onChange={handleChange}
          required
          min="1"
          readOnly={readOnly}
          disabled={readOnly}
          className={`${styles.formControl} ${styles.numberInput}`}
        />
      </Form.Group>

      <Form.Group className={`${styles.formGroup} ${styles.locationSection}`}>
        <Form.Label className={styles.formLabel}>Ubicación</Form.Label>
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
        <Button type="submit" className={styles.submitButton}>
          {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </Button>
      )}
    </Form>
  );
};

export default ProjectForm;