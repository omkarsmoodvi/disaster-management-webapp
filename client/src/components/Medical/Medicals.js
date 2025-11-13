// frontend/src/pages/Medical.js

import React, { useEffect, useState } from "react";
import "../../assets/CSS/Medicals.css";

// Helper: calculate distance between two coordinates (km)
function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export const Medicals = () => {
  const [places, setPlaces] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [manualLoc, setManualLoc] = useState({ lat: "", lon: "" });
  const [useManual, setUseManual] = useState(false);

  // 1. Location acquisition: Automatically or manually
  useEffect(() => {
    if (useManual) {
      if (manualLoc.lat && manualLoc.lon) {
        setUserLoc([parseFloat(manualLoc.lat), parseFloat(manualLoc.lon)]);
      }
    } else {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLoc([23.7264, 90.3925]) // fallback (Dhaka)
      );
    }
  }, [manualLoc, useManual]);

  // 2. Fetch all places (medical, police stations, shelters, etc.)
  useEffect(() => {
    fetch("http://localhost:5000/api/medicals") // Adjust API if needed
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  // 3. Always show ALL sorted places (not just top 5)
  let sorted = [];
  if (userLoc && places.length) {
    sorted = [...places];
    sorted.forEach(p => {
      // If lat/lon missing, use huge distance to push it last
      if (p.latitude && p.longitude) {
        p.dist = haversineDistance(userLoc[0], userLoc[1], p.latitude, p.longitude);
      } else {
        p.dist = 999999;
      }
    });
    sorted.sort((a, b) => a.dist - b.dist);
  }

  return (
    <div className="medical-listing">
      <h1>Nearest Government Hospitals, Shelters, & Police Stations</h1>
      <div style={{ marginBottom: "1em" }}>
        <button onClick={() => setUseManual(!useManual)}>
          {useManual ? "Use automatic location" : "Enter location manually"}
        </button>
        {useManual &&
          <span style={{ marginLeft: "1em" }}>
            <input
              type="number"
              placeholder="Latitude"
              value={manualLoc.lat}
              onChange={e => setManualLoc({ ...manualLoc, lat: e.target.value })}
              style={{ width: 110, marginRight: 6 }}
            />
            <input
              type="number"
              placeholder="Longitude"
              value={manualLoc.lon}
              onChange={e => setManualLoc({ ...manualLoc, lon: e.target.value })}
              style={{ width: 110 }}
            />
          </span>
        }
      </div>
      {!userLoc && <p>Detecting your location...</p>}
      <table className="med-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Hotline</th>
            <th>Email</th>
            <th>Type</th>
            <th>Seats</th>
            <th>Distance (km)</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, idx) => (
            <tr key={p._id || idx}>
              <td>{idx + 1}</td>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.hotline}</td>
              <td>{p.email}</td>
              <td>{p.type}</td>
              <td>{p.seats}</td>
              <td>{p.dist !== undefined ? p.dist.toFixed(2) : "N/A"}</td>
              <td>
                {p.latitude && p.longitude
                  ? (<a target="_blank" rel="noopener noreferrer"
                        href={`https://maps.google.com/?q=${p.latitude},${p.longitude}`}>View map</a>)
                  : "Not available"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && <p>No hospitals, police or shelters found.</p>}
    </div>
  );
};
