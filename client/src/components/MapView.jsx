import React, { useEffect, useRef } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41]
});

const MapView = ({ userLoc, origin, destination, routeGeoJson, setOrigin, setDestination }) => {
  // Pan the map on origin/dest set
  const mapRef = useRef();
  useEffect(() => {
    if (mapRef.current && (origin || destination)) {
      const map = mapRef.current;
      const center = destination || origin || userLoc;
      if (center) map.setView(center, destination ? 15 : 13);
    }
  }, [origin, destination, userLoc]);

  return (
    <MapContainer
      center={userLoc || [20.59, 78.96]}
      zoom={userLoc ? 13 : 5}
      minZoom={3}
      maxZoom={18}
      style={{ height: "500px", width: "100%" }}
      whenCreated={mapInstance => (mapRef.current = mapInstance)}
      scrollWheelZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userLoc && (
        <Marker position={userLoc} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {origin && (
        <Marker position={origin} icon={userIcon}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={userIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {routeGeoJson && (
        <Polyline positions={routeGeoJson.geometry.coordinates.map(([lng,lat])=>[lat,lng])} color="blue" weight={5} />
      )}
    </MapContainer>
  );
};
export default MapView;
