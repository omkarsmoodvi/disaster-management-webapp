import React, { useEffect, useState } from "react";
import "../assets/CSS/Home.css";

const bgImage = process.env.PUBLIC_URL + "/background/homepage.jpg";

export default function Home() {
  const [incidentCount, setIncidentCount] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    // Fetch incidents count
    fetch("http://localhost:5000/api/incidents")
      .then(res => res.json())
      .then(data => setIncidentCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setIncidentCount(0));
    // Fetch donations and sum both types if needed
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sum money and resource donations
          let money = data.filter(d => d.type === "money").length;
          let resources = data.filter(d => d.type === "resource" || d.type === "resources").length;
          setDonationCount(money + resources);
        } else {
          setDonationCount(0);
        }
      })
      .catch(() => setDonationCount(0));
  }, []);

  return (
    <div className="home-bg" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="home-dashboard-box">
        <h1>Welcome to the Disaster Management System</h1>
        <div className="stats-row">
          <div className="stat-box incidents">
            <div className="stat-number">{incidentCount}</div>
            <div className="stat-label">Incidents Reported</div>
          </div>
          <div className="stat-box donations">
            <div className="stat-number">{donationCount}</div>
            <div className="stat-label">Donations Completed</div>
          </div>
        </div>
        <div className="stat-description">
          Stay safe. Get updates and support relief efforts here.
        </div>
      </div>
    </div>
  );
}
