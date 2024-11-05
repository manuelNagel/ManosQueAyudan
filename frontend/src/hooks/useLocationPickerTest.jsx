import { useState, useEffect, useCallback } from 'react';

export const useLocationPickerTest = (initialLocation, initialLocalizacion, errorType = null) => {
    const [position, setPosition] = useState(initialLocation || { lat: -34.603722, lng: -58.381592 });
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [localizacion, setLocalizacion] = useState(initialLocalizacion || '');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialLocalizacion) {
            setLocalizacion(initialLocalizacion);
        }
    }, [initialLocalizacion]);

    const searchCities = useCallback(async (query) => {
        if (!query || query.length < 3) {
            setCities([]);
            return;
        }
        
        setLoading(true);
        setError(null);

        // Error simulations
        if (errorType === 'network') {
            setLoading(false);
            setError('Error de conexión: No se pudo conectar al servidor');
            return;
        }

        if (errorType === 'timeout') {
            const timeoutId = setTimeout(() => {
                setLoading(false);
                setError('Tiempo de espera agotado. Por favor, intente nuevamente.');
            }, 5000);
            return () => clearTimeout(timeoutId);
        }

        if (query.toLowerCase() === 'noresults') {
            setLoading(false);
            setError('No se encontraron ciudades para su búsqueda');
            setCities([]);
            return;
        }

        try {
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
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();

            const filteredResults = data
                .filter(item => 
                    item.address && 
                    (item.type === "city" || 
                     item.type === "town" || 
                     item.type === "village" || 
                     item.type === "administrative")
                )
                .map(item => ({
                    name: item.address.city || item.address.town || item.address.village || item.name,
                    lat: item.lat,
                    lon: item.lon,
                    display_name: item.display_name
                }));

            setCities(filteredResults);
        } catch (error) {
            setError('Error al buscar ciudades: ' + error.message);
            setCities([]);
        } finally {
            setLoading(false);
        }
    }, [errorType]);

    // Add debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchCities(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchCities]);

    const handleMapClick = async (latlng) => {
        setPosition(latlng);
        setError(null);

        // Simulate error for coordinates outside Argentina
        if (latlng.lat < -55 || latlng.lat > -21 || latlng.lng < -73 || latlng.lng > -53) {
            setError('Error: Las coordenadas seleccionadas están fuera de Argentina');
            return null;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                new URLSearchParams({
                    lat: latlng.lat,
                    lon: latlng.lng,
                    format: 'json'
                })
            );
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();
            setLocalizacion(data.display_name);
            return {
                latitud: latlng.lat,
                longitud: latlng.lng,
                localizacion: data.display_name
            };
        } catch (error) {
            setError('Error al obtener la dirección: ' + error.message);
            return null;
        }
    };

    const handleCityChange = async (cityData) => {
        if (!cityData) return null;
        
        setError(null);

        if (errorType === 'invalidCity') {
            setError('Error: Datos de ciudad inválidos');
            return null;
        }

        try {
            const newPosition = {
                lat: parseFloat(cityData.lat),
                lng: parseFloat(cityData.lon)
            };
            setPosition(newPosition);
            setLocalizacion(cityData.display_name);
            setCities([]); // Clear the cities list after selection
            setSearchQuery(''); // Clear the search query after selection
            return {
                latitud: newPosition.lat,
                longitud: newPosition.lng,
                localizacion: cityData.display_name
            };
        } catch (error) {
            setError('Error al seleccionar la ciudad: ' + error.message);
            return null;
        }
    };

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
        setError(null);
    };

    return {
        position,
        cities,
        loading,
        searchQuery,
        localizacion,
        error,
        handleCityChange,
        handleMapClick,
        handleSearchQueryChange,
    };
};