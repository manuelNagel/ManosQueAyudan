import React from 'react';
import { Card, Row, Col, Table, ProgressBar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProjectOverview = ({ stats }) => (
  <Row className="mb-4">
    <Col md={4}>
      <Card>
        <Card.Body>
          <Card.Title>Total Participantes</Card.Title>
          <h2>{stats.totalParticipants}</h2>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card>
        <Card.Body>
          <Card.Title>Participantes Activos</Card.Title>
          <h2>{stats.activeParticipants}</h2>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card>
        <Card.Body>
          <Card.Title>Tasa de Completado</Card.Title>
          <ProgressBar 
            now={stats.completionRate} 
            label={`${stats.completionRate.toFixed(1)}%`}
          />
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

const ActivitiesList = ({ activities }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>Estado de Actividades</Card.Title>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Actividad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>
                <span className={`badge bg-${activity.status ? 'success' : 'warning'}`}>
                  {activity.status ? 'Completada' : 'Pendiente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

const ParticipantHistory = ({ history }) => (
  <Card>
    <Card.Body>
      <Card.Title>Historial de Participantes</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="joined" name="Ingresaron" fill="#82ca9d" />
          <Bar dataKey="left" name="Salieron" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
);

const ProjectStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div>
      <ProjectOverview stats={stats} />
      <ActivitiesList activities={stats.activities} />
      <ParticipantHistory history={stats.participantHistory} />
    </div>
  );
};

export default ProjectStats;