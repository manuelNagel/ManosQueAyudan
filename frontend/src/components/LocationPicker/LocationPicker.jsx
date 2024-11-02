import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import { Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import L from 'leaflet';
import { useLocationPicker } from '../../hooks/useLocationPicker';
import 'leaflet/dist/leaflet.css';


const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const LocationPicker = ({ initialLocation, initialLocalizacion, onLocationChange, radioTrabajo }) => {
    const {
      position,
      cities,
      loading,
      searchQuery,
      localizacion,
      handleCityChange,
      handleMapClick,
      handleSearchQueryChange,
    } = useLocationPicker(initialLocation, initialLocalizacion);
  
  const handleLocationSelect = async (latlng) => {
    const locationData = await handleMapClick(latlng);
    if (locationData) {
      onLocationChange(locationData);
    }
  };

  const handleCitySelect = async (cityData) => {
    const locationData = await handleCityChange(cityData);
    if (locationData) {
      onLocationChange(locationData);
    }
  };

  
  return (
    <div>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Buscar ciudad</Form.Label>
            <InputGroup>
              <FormControl
                placeholder="Escribe para buscar una ciudad..."
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
              />
            </InputGroup>
            {loading && <div className="text-muted mt-1">Buscando...</div>}
            {cities.length > 0 && (
              <div className="border rounded mt-1 position-absolute bg-white w-100 shadow-sm" 
                   style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {cities.map((city) => (
                  <div
                    key={city.display_name}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.display_name}
                  </div>
                ))}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

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
          {radioTrabajo && (
            <Circle
              center={[position.lat, position.lng]}
              radius={radioTrabajo * 1000}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />
          )}
          <MapEvents onLocationSelect={handleLocationSelect} />
          <MapUpdater center={[position.lat, position.lng]} />
        </MapContainer>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Localización</Form.Label>
        <Form.Control
          type="text"
          value={localizacion}
          disabled
        />
      </Form.Group>
    </div>
  );
};

export default LocationPicker;