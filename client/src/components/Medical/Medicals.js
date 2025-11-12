import React, { useEffect, useState } from "react";
import "../../assets/CSS/Medicals.css";

// Helper to calculate distance (in km) between two coordinates
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
  const [medicals, setMedicals] = useState([]);
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLoc([23.7264, 90.3925]) // default: somewhere in Dhaka
    );
  }, []);

  useEffect(() => {
    // Fetch dynamic medicals from backend API
    fetch("http://localhost:5000/api/medicals")
      .then(res => res.json())
      .then(data => setMedicals(data));
  }, []);

  let nearest = [];
  if (userLoc && medicals.length) {
    nearest = [...medicals];
    nearest.forEach(m => {
      m.dist = haversineDistance(userLoc[0], userLoc[1], m.latitude, m.longitude);
    });
    nearest.sort((a, b) => a.dist - b.dist);
    nearest = nearest.slice(0, 5); // Top 5
  }

  return (
    <div className="medical-listing">
      <h1>Nearest Government Hospitals & Shelters</h1>
      {!userLoc && <p>Detecting your location...</p>}
      <table className="med-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Address</th><th>Hotline</th><th>Email</th><th>Type</th><th>Seats</th><th>Distance (km)</th>
          </tr>
        </thead>
        <tbody>
          {nearest.map((m, idx) => (
            <tr key={m._id}>
              <td>{idx+1}</td>
              <td>{m.name}</td>
              <td>{m.address}</td>
              <td>{m.hotline}</td>
              <td>{m.email}</td>
              <td>{m.type}</td>
              <td>{m.seats}</td>
              <td>{m.dist.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {nearest.length === 0 && <p>No hospitals or shelters in your area right now.</p>}
    </div>
  );
};
