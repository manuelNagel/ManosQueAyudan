import React from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import useCountries from '../../hooks/useCountries';
import CountriesList from '../../components/CountriesList/CountriesList';

const Countries = () => {
  const { countries, loading, error, refetch } = useCountries();

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Countries List</h1>
        <Button onClick={refetch} disabled={loading}>
          Refresh List
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">
          Error loading countries: {error}
        </Alert>
      ) : countries.length > 0 ? (
        <>
          <p>Total Countries: {countries.length}</p>
          <CountriesList countries={countries} />
        </>
      ) : (
        <Alert variant="info">No countries found</Alert>
      )}
    </Container>
  );
};

export default Countries;