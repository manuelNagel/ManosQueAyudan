import React from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import useCountries from '../../hooks/useCountries';
import CountriesList from '../../components/CountriesList/CountriesList';
import ComboBox from '../../components/ComboBox/ComboBox';

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
          Error al cargar los paises: {error}
        </Alert>
      ) : countries.length > 0 ? (
        <>
          <p>Total Countries: {countries.length}</p>
          <CountriesList countries={countries} />
        
        <ComboBox 
        buttonTitle="País de Residencia" 
        // options={["Opción 1", "Opción 2", "Opción 3"]} 
       options={countries}
        defaultTitle="Elige un País" 
      />
      </>
      ) : (
        <Alert variant="info">No se pudieron cargar los Paises</Alert>
      )}
    </Container>
  );
};

export default Countries;