import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useLocationPickerTest } from '../../hooks/useLocationPickerTest';
import 'leaflet/dist/leaflet.css';

// MapEvents component to handle map clicks
const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};

// MapCenter component to update map view when position changes
const MapCenter = ({ position }) => {
    const map = useMap();
    React.useEffect(() => {
        map.setView([position.lat, position.lng], map.getZoom());
    }, [position, map]);
    return null;
};

const LocationTestPage = () => {
    const [currentError, setCurrentError] = useState(null);
    const [instructions, setInstructions] = useState('Seleccione un escenario de error para comenzar las pruebas');
    const [activeTest, setActiveTest] = useState(null);
    const [isOutOfBoundsEnabled, setIsOutOfBoundsEnabled] = useState(false);

    const {
        position,
        cities,
        loading,
        searchQuery,
        localizacion,
        error,
        handleCityChange,
        handleMapClick,
        handleSearchQueryChange,
    } = useLocationPickerTest(
        { lat: -34.603722, lng: -58.381592 }, 
        '', 
        currentError
    );

    const errorScenarios = [
        {
            name: 'Error de Red',
            type: 'network',
            instructions: 'Este error simula un fallo en la conexión de red. Pasos:\n1. Haga clic en el botón\n2. Intente buscar cualquier ciudad\n3. Verá un mensaje de error de conexión',
            description: 'Simula un error de conexión al buscar ciudades'
        },
        {
            name: 'Sin Resultados',
            type: 'noResults',
            instructions: 'Simula una búsqueda sin resultados. Pasos:\n1. Escriba "noresults" en el buscador\n2. Verá un mensaje indicando que no se encontraron resultados',
            description: 'Simula cuando no se encuentran ciudades'
        },
        {
            name: 'Tiempo de Espera',
            type: 'timeout',
            instructions: 'Simula un timeout en la búsqueda. Pasos:\n1. Haga clic en el botón\n2. Intente buscar cualquier ciudad\n3. Espere 5 segundos para ver el error de timeout',
            description: 'Simula cuando la búsqueda tarda demasiado'
        },
        {
            name: 'Ciudad Inválida',
            type: 'invalidCity',
            instructions: 'Simula datos inválidos de ciudad. Pasos:\n1. Haga clic en el botón\n2. Intente seleccionar cualquier ciudad de la lista\n3. Verá un error de datos inválidos',
            description: 'Simula cuando los datos de la ciudad son inválidos'
        }
    ];

    const handleMapClickWrapper = async (latlng) => {
        if (isOutOfBoundsEnabled) {
            // When out-of-bounds test is enabled, create a point outside Argentina
            const outOfBoundsPoint = {
                lat: -56, // South of Argentina
                lng: latlng.lng
            };
            await handleMapClick(outOfBoundsPoint);
        } else {
            await handleMapClick(latlng);
        }
    };

    return (
        <Container className="mt-4 mb-4">
            <h2>Pruebas de Error - Location Picker</h2>
            
            {/* Error Control Panel */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5>Panel de Control de Errores</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>Escenario Activo:</strong> {activeTest || 'Ninguno'}
                            </div>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                {errorScenarios.map((scenario) => (
                                    <Button
                                        key={scenario.name}
                                        variant={currentError === scenario.type ? "danger" : "outline-danger"}
                                        onClick={() => {
                                            setCurrentError(scenario.type);
                                            setInstructions(scenario.instructions);
                                            setActiveTest(scenario.name);
                                            setIsOutOfBoundsEnabled(false);
                                        }}
                                    >
                                        {scenario.name}
                                    </Button>
                                ))}
                                <Button
                                    variant={isOutOfBoundsEnabled ? "danger" : "outline-danger"}
                                    onClick={() => {
                                        setIsOutOfBoundsEnabled(!isOutOfBoundsEnabled);
                                        setCurrentError(null);
                                        setInstructions('Haga clic en el mapa para simular una selección fuera de Argentina');
                                        setActiveTest(isOutOfBoundsEnabled ? null : 'Coordenadas Fuera de Rango');
                                    }}
                                >
                                    Coordenadas Fuera de Rango
                                </Button>
                                <Button
                                    variant="outline-success"
                                    onClick={() => {
                                        setCurrentError(null);
                                        setInstructions('Seleccione un escenario de error para comenzar las pruebas');
                                        setActiveTest(null);
                                        setIsOutOfBoundsEnabled(false);
                                    }}
                                >
                                    Resetear Pruebas
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Instructions and Status */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Instrucciones</h5>
                        </Card.Header>
                        <Card.Body>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {instructions}
                            </pre>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5>Estado Actual</h5>
                        </Card.Header>
                        <Card.Body>
                            {error ? (
                                <Alert variant="danger">
                                    <strong>Error Actual:</strong> {error}
                                </Alert>
                            ) : (
                                <Alert variant="info">
                                    No hay errores activos
                                </Alert>
                            )}
                            {loading && (
                                <Alert variant="warning">
                                    Cargando...
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Location Picker Component */}
            <Card>
                <Card.Header>
                    <h5>Componente Location Picker</h5>
                </Card.Header>
                <Card.Body>
                    <div className="location-picker">
                        <div className="mb-3 position-relative">
                            <label className="form-label">Buscar Ciudad</label>
                            <input
                                type="text"
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => handleSearchQueryChange(e.target.value)}
                                placeholder="Escriba para buscar..."
                            />
                            {loading && <div className="text-muted mt-1">Buscando...</div>}
                            {cities.length > 0 && (
                                <div 
                                    className="border rounded mt-1 position-absolute bg-white w-100"
                                    style={{ 
                                        zIndex: 1000,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        left: 0,
                                        right: 0
                                    }}
                                >
                                    {cities.map((city) => (
                                        <div
                                            key={city.display_name}
                                            className="p-2 hover:bg-gray-100"
                                            style={{ 
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => handleCityChange(city)}
                                        >
                                            {city.display_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ height: '400px', marginBottom: '1rem', position: 'relative' }}>
                            <MapContainer
                                center={[position.lat, position.lng]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[position.lat, position.lng]} />
                                <MapEvents onMapClick={handleMapClickWrapper} />
                                <MapCenter position={position} />
                            </MapContainer>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Localización Seleccionada</label>
                            <input
                                type="text"
                                className="form-control"
                                value={localizacion}
                                disabled
                            />
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LocationTestPage;