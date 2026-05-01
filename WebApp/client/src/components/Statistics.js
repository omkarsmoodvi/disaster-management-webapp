import React, { useEffect, useState } from 'react';
import "../assets/CSS/Statistics.css";

export function Statistics() {
  const [incidentCount, setIncidentCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/incidents")
      .then(res => res.json())
      .then(data => setIncidentCount(data.length))
      .catch(() => setIncidentCount(0));
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => setDonationCount(data.length))
      .catch(() => setDonationCount(0));
  }, []);

  return (
    <div className="stats-2col-grid">
      <div className="stats-card stats-yellow">
        <h3>{incidentCount}</h3>
        <div>Incidents Registered</div>
      </div>
      <div className="stats-card stats-green">
        <h3>{donationCount}</h3>
        <div>Total Donations</div>
      </div>
    </div>
  );
}
