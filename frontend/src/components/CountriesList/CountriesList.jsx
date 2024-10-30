import React from 'react';
import { Table } from 'react-bootstrap';

const CountriesList = ({ countries }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ISO Code</th>
          <th>Country Name</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country.isoCode}>
            <td>{country.isoCode}</td>
            <td>{country.name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CountriesList;