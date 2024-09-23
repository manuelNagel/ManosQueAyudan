import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Protected() {
  const [message, setMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    fetch('/api/protected')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Not authenticated');
        }
      })
      .then(data => setMessage(data.message))
      .catch(() => {
        history.push('/login');
      });
  }, [history]);

  return <h2>{message}</h2>;
}

export default Protected;
