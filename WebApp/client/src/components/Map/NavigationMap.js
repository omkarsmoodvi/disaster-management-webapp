import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41]
});
const hospitalIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png",
  iconSize: [32, 32], iconAnchor: [16, 32]
});

function PanTo({ position, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) map.setView(position, zoom);
  }, [position, zoom, map]);
  return null;
}

const NavigationMap = ({ userLoc, places, selectedPlace, routeGeoJSON, onMarkerClick, zoom }) => {
  let routeCoords = [];
  if (
    routeGeoJSON &&
    routeGeoJSON.features &&
    routeGeoJSON.features.length > 0 &&
    routeGeoJSON.features[0].geometry &&
    routeGeoJSON.features[0].geometry.coordinates
  ) {
    routeCoords = routeGeoJSON.features[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );
  }
  const mapCenter = selectedPlace ? [selectedPlace.latitude, selectedPlace.longitude]
                      : userLoc ? userLoc : [20.5937, 78.9629];
  return (
    <div style={{ height: "450px", width: "100%", marginTop: 16 }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom || 13}
        minZoom={4}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <PanTo position={mapCenter} zoom={zoom || 13} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLoc && (
          <Marker position={userLoc} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {places.map((place, idx) => (
          <Marker
            position={[place.latitude, place.longitude]}
            icon={hospitalIcon}
            key={place._id || idx}
            eventHandlers={onMarkerClick ? { click: () => onMarkerClick(place) } : {}}
          >
            <Popup>
              <strong>{place.name}</strong><br />
              {place.address}<br />
              {place.type}
            </Popup>
          </Marker>
        ))}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="red" weight={5} />
        )}
      </MapContainer>
    </div>
  );
};

export default NavigationMap;
