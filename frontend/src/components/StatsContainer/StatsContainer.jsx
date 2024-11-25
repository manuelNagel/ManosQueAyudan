import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useProjectStats } from '../../hooks/useProjectStats';
import UserStats from '../UserStats/UserStats';
import ProjectStats from '../ProjectStats/ProjectStats';

const StatsContainer = ({ type, id }) => {
  const [stats, setStats] = useState(null);
  const { loading, error, getUserStats, getProjectStats, clearError } = useProjectStats();

  useEffect(() => {
    const fetchStats = async () => {
      let result;
      if (type === 'user') {
        result = await getUserStats(id);
      } else {
        result = await getProjectStats(id);
      }
      if (result) {
        setStats(result);
      }
    };

    fetchStats();
  }, [type, id, getUserStats, getProjectStats]);
  

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" onClose={clearError} dismissible>
        {error}
      </Alert>
    );
  }

  return type === 'user' ? (
    <UserStats stats={stats} />
  ) : (
    <ProjectStats stats={stats} />
  );
};

export default StatsContainer;