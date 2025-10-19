import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const GeographyChart = () => {
  // Enhanced disaster locations with more details
  const locations = [
    {
      name: "Chennai",
      coordinates: [13.0827, 80.2707],
      type: "Cyclone",
      severity: "high",
      affected: "2.1M people"
    },
    {
      name: "Bhubaneswar",
      coordinates: [20.2961, 85.8245],
      type: "Flood",
      severity: "medium",
      affected: "800K people"
    },
    {
      name: "Mumbai",
      coordinates: [19.0760, 72.8777],
      type: "Heavy Rain",
      severity: "medium", 
      affected: "1.5M people"
    },
    {
      name: "Kolkata",
      coordinates: [22.5726, 88.3639],
      type: "Cyclone",
      severity: "high",
      affected: "900K people"
    },
    {
      name: "Visakhapatnam",
      coordinates: [17.6868, 83.2185],
      type: "Storm Surge",
      severity: "low",
      affected: "500K people"
    },
  ];
  

  const mapRef = useRef();

  useEffect(() => {
    const loadRouting = async () => {
      const LRM = await import("leaflet-routing-machine");

      const map = mapRef.current;

      if (map) {
        // Add routing control to the map with two waypoints
        LRM.Routing.control({
          waypoints: [
            LRM.latLng(13.0827, 80.2707), // Chennai
            LRM.latLng(20.9517, 85.0985), // Odisha
          ],
          createMarker: () => null, // To prevent markers from appearing at waypoints
        }).addTo(map);
      }
    };

    loadRouting();
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      center={[20.5937, 82.9629]}
      zoom={5}
      style={{ width: "100%", height: "200px" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={location.coordinates}
          icon={
            new Icon({
              iconUrl: location.severity === 'high' 
                ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
                : location.severity === 'medium'
                ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
                : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
            })
          }
        >
          <Popup>
            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#2D3748' }}>
                {location.name}
              </div>
              <div style={{ color: '#4A5568', marginBottom: '2px' }}>
                <strong>Type:</strong> {location.type}
              </div>
              <div style={{ color: '#4A5568', marginBottom: '2px' }}>
                <strong>Severity:</strong> <span style={{ 
                  color: location.severity === 'high' ? '#E53E3E' : 
                         location.severity === 'medium' ? '#DD6B20' : '#38A169',
                  fontWeight: 'bold'
                }}>
                  {location.severity.toUpperCase()}
                </span>
              </div>
              <div style={{ color: '#718096', fontSize: '12px' }}>
                {location.affected} affected
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GeographyChart;
