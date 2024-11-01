import { useState, useEffect, useCallback } from 'react';

export const useLocationPicker = (initialLocation) => {
  const [position, setPosition] = useState(initialLocation || { lat: -34.603722, lng: -58.381592 });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localizacion, setLocalizacion] = useState('');

  const searchCities = useCallback(async (query) => {
    if (query.length < 3) return;
    
    setLoading(true);
    try {
      // Using only the q parameter with country filter in the query
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        new URLSearchParams({
          q: `${query}, Argentina`,
          format: 'json',
          limit: 10,
          addressdetails: 1,
          countrycodes: 'ar'
        })
      );
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        return;
      }

      // Filter results to include only cities and localities
      const filteredResults = data.filter(item => 
        item.address && 
        (item.type === "city" || 
         item.type === "town" || 
         item.type === "village" || 
         item.type === "administrative")
      ).map(item => ({
        name: item.address.city || item.address.town || item.address.village || item.name,
        lat: item.lat,
        lon: item.lon,
        display_name: item.display_name
      }));

      setCities(filteredResults);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      } else {
        setCities([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCities]);

  const handleMapClick = async (latlng) => {
    setPosition(latlng);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        new URLSearchParams({
          lat: latlng.lat,
          lon: latlng.lng,
          format: 'json'
        })
      );
      const data = await response.json();
      setLocalizacion(data.display_name);
      return {
        latitud: latlng.lat,
        longitud: latlng.lng,
        localizacion: data.display_name
      };
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const handleCityChange = async (cityData) => {
    if (cityData) {
      const newPosition = {
        lat: parseFloat(cityData.lat),
        lng: parseFloat(cityData.lon)
      };
      setPosition(newPosition);
      setLocalizacion(cityData.display_name);
      return {
        latitud: newPosition.lat,
        longitud: newPosition.lng,
        localizacion: cityData.display_name
      };
    }
    return null;
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  return {
    position,
    cities,
    loading,
    searchQuery,
    localizacion,
    handleCityChange,
    handleMapClick,
    handleSearchQueryChange,
  };
};