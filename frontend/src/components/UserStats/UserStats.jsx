import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserStatsOverview = ({ stats }) => (
  <Row className="mb-4">
    <Col md={3}>
      <Card>
        <Card.Body>
          <Card.Title>Total Proyectos</Card.Title>
          <h2>{stats.totalProjects}</h2>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3}>
      <Card>
        <Card.Body>
          <Card.Title>Proyectos Activos</Card.Title>
          <h2>{stats.activeProjects}</h2>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3}>
      <Card>
        <Card.Body>
          <Card.Title>Proyectos Completados</Card.Title>
          <h2>{stats.completedProjects}</h2>
        </Card.Body>
      </Card>
    </Col>
    <Col md={3}>
      <Card>
        <Card.Body>
          <Card.Title>Total Participaciones</Card.Title>
          <h2>{stats.totalParticipations}</h2>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

const ParticipationHistory = ({ history }) => (
  <Card>
    <Card.Body>
      <Card.Title>Historial de Participación</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="projectCount" name="Proyectos" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
);

const RoleDistribution = ({ roles }) => (
  <Card>
    <Card.Body>
      <Card.Title>Distribución de Roles</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={roles}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" name="Cantidad" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
);

const UserStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div>
      <UserStatsOverview stats={stats} />
      <Row className="mb-4">
        <Col md={6}>
          <ParticipationHistory history={stats.participationHistory} />
        </Col>
        <Col md={6}>
          <RoleDistribution roles={stats.roleDistribution} />
        </Col>
      </Row>
    </div>
  );
};

export default UserStats;