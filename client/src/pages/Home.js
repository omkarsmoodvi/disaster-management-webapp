import React, { useState, useEffect } from 'react';
import '../assets/CSS/Home.css';
import { ImgSlider, Map, Statistics } from '../components';
import Arrow from '../assets/images/arrows.png';
import ChatbotWidget from '../components/ChatbotWidget'; // <= import the widget

const Home = () => {
  const [incidents, setIncidents] = useState([]);
  // For map data, expand as needed
  const [Itable, setItable] = useState('table');
  const [Etable, setEtable] = useState('table');
  // If you use a Map and contacts, implement fetch here

  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data));
  }, []);

  const changeDisplay = (d) => d === 'table' ? 'none' : 'table';

  return (
    <>
      <ImgSlider />
      <h1 className='section-header'>Statistics </h1>
      <Statistics />

      <h1 className='section-header'>HeatMap of Incidents</h1>
      {/* Implement your Map here with locations if needed */}

      <h1 className='section-header clickable' onClick={() => setItable(changeDisplay(Itable))}>
        Recent List of Incidents <img src={Arrow} className="icon" alt="arrow" />
      </h1>
      <table style={{ display: Itable }}>
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Incident Type</th>
            <th>Incident Date</th>
            <th>Location ID</th>
            <th>Incident Description</th>
            <th>Incident Status</th>
            <th>Urgency</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident._id}>
              <td>{incident.IncidentID}</td>
              <td>{incident.IncidentType}</td>
              <td>{new Date(incident.DateReported).toLocaleString()}</td>
              <td>{incident.LocationID || incident.CommunityID}</td>
              <td>{incident.Description}</td>
              <td>{incident.Status}</td>
              <td>{incident.Urgency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* You can fill the Emergency-Contacts table in a similar way */}

      {/* --- Add the floating chatbot widget (bottom right) --- */}
      <ChatbotWidget />
    </>
  );
};

export default Home;
