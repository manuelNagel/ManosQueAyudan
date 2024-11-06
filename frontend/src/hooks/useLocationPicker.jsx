import { useState, useEffect, useCallback } from 'react';

export const useLocationPicker = (initialLocation, initialLocalizacion) => {
    const [position, setPosition] = useState(initialLocation || { lat: -34.603722, lng: -58.381592 });
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [localizacion, setLocalizacion] = useState(initialLocalizacion || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialLocalizacion) {
            setLocalizacion(initialLocalizacion);
        }
    }, [initialLocalizacion]);

    const searchCities = useCallback(async (query) => {
        if (query.length < 3) {
            setCities([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                new URLSearchParams({
                    q: `${query}, Argentina`,
                    format: 'json',
                    limit: 10,
                    addressdetails: 1,
                    countrycodes: 'ar'
                }),
                { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Formato de respuesta inválido');
            }

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

            if (filteredResults.length === 0) {
                setError('No se encontraron ciudades que coincidan con la búsqueda');
            }

            setCities(filteredResults);
        } catch (error) {
            setCities([]);
            if (error.name === 'AbortError') {
                setError('La búsqueda tardó demasiado tiempo. Por favor, intente nuevamente.');
            } else if (!navigator.onLine) {
                setError('No hay conexión a internet. Por favor, verifique su conexión.');
            } else {
                setError('Error al buscar ciudades. Por favor, intente nuevamente.');
            }
            console.error('Error searching cities:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleMapClick = async (latlng) => {
        setPosition(latlng);
        setError('');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                new URLSearchParams({
                    lat: latlng.lat,
                    lon: latlng.lng,
                    format: 'json'
                }),
                { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setLocalizacion(data.display_name);
            return {
                latitud: latlng.lat,
                longitud: latlng.lng,
                localizacion: data.display_name
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                setError('La búsqueda de ubicación tardó demasiado tiempo. Por favor, intente nuevamente.');
            } else if (!navigator.onLine) {
                setError('No hay conexión a internet. Por favor, verifique su conexión.');
            } else {
                setError('Error al obtener la dirección. Por favor, intente nuevamente.');
            }
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
        if (query.length < 3) {
            setError('Ingrese al menos 3 caracteres para buscar');
        } else {
            setError('');
        }
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