import { useState, useEffect } from 'react';
import axios from 'axios';

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      setLoading(true); // Ensure loading is true when fetching
      const response = await axios.get('/api/countries');
      
      // Parse the XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
      
      // Get all elements with tag name 'm:tCountryCodeAndName'
      const countryElements = xmlDoc.getElementsByTagName('m:tCountryCodeAndName');
      
      const countryList = Array.from(countryElements).map(country => ({
        isoCode: country.getElementsByTagName('m:sISOCode')[0]?.textContent || '',
        name: country.getElementsByTagName('m:sName')[0]?.textContent || ''
      }));

      console.log('Parsed countries:', countryList); // Debug log
      setCountries(countryList);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err.message || 'Error fetching countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return { countries, loading, error, refetch: fetchCountries };
};

export default useCountries;