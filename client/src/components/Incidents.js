import React, { useState } from 'react';
import '../assets/CSS/Incidents.css';
import { useNavigate } from 'react-router-dom';

export const Incidents = () => {
  const navigate = useNavigate();

  const [incidentType, setIncidentType] = useState('Flood');
  const [otherType, setOtherType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [affected, setAffected] = useState('');
  const [communityID, setCommunityID] = useState('');
  const [incidentStatus, setIncidentStatus] = useState('Running');
  const [urgency, setUrgency] = useState('High');

  let userID = "";
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.UserID) userID = userData.UserID;
  } catch {
    userID = "";
  }

  const submitIncident = async (e) => {
    e.preventDefault();
    if (!userID) { alert("You must be logged in to report an incident!"); return; }
    if (!incidentType || (incidentType === "Others" && !otherType) || !incidentDate || !incidentLocation || !incidentDescription || !communityID || !incidentStatus || !urgency) {
      alert("All fields are required.");
      return;
    }
    const payload = {
      UserID: Number(userID),
      CommunityID: communityID,
      IncidentType: incidentType === 'Others' ? otherType : incidentType,
      Location: incidentLocation,
      Description: incidentDescription,
      Status: incidentStatus,
      Urgency: urgency,
      AffectedIndividuals: affected ? Number(affected) : undefined,
      DateReported: incidentDate
    };

    try {
      const res = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Incident reported!');
        setIncidentDescription('');
        setIncidentLocation('');
        setAffected('');
        setCommunityID('');
        setIncidentType('Flood');
        setOtherType('');
        setIncidentDate('');
        setIncidentStatus('Running');
        setUrgency('High');
      } else {
        const errJson = await res.json();
        alert("Failed to report incident: " + (errJson.error || ""));
      }
    } catch (err) {
      alert("Error submitting incident.");
    }
  };

  return (
    <div className="incident-form-container">
      <h1 className="incident-header">Report an Incident</h1>
      <form onSubmit={submitIncident} className="incident-form">
        <div className="incident-row">
          <label className="incident-label">Incident Type</label>
          <select className="incident-input"
            value={incidentType}
            onChange={e => setIncidentType(e.target.value)}>
            <option value="Flood">Flood</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Fire">Fire</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Accident">Accident</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {incidentType === "Others" && (
          <div className="incident-row">
            <label className="incident-label">Custom Type</label>
            <input
              className="incident-input"
              type="text"
              placeholder="Specify incident type"
              value={otherType}
              onChange={e => setOtherType(e.target.value)}
              required
            />
          </div>
        )}
        <div className="incident-row">
          <label className="incident-label">Incident Date</label>
          <input className="incident-input" type="datetime-local"
            value={incidentDate}
            onChange={e => setIncidentDate(e.target.value)}
            required />
        </div>
        <div className="incident-row">
          <label className="incident-label">Incident Location</label>
          <input className="incident-input" type="text" value={incidentLocation}
            onChange={e => setIncidentLocation(e.target.value)}
            required />
        </div>
        <div className="incident-row">
          <label className="incident-label">Incident Description</label>
          <input className="incident-input" value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            required />
        </div>
        <div className="incident-row">
          <label className="incident-label">Affected Individuals</label>
          <input className="incident-input" type="number" value={affected}
            onChange={e => setAffected(e.target.value)}
            required />
        </div>
        <div className="incident-row">
          <label className="incident-label">Community ID</label>
          <input className="incident-input" type="text" value={communityID}
            onChange={e => setCommunityID(e.target.value)}
            required
            placeholder="Eg: Block-A, CollegeZone, etc"
          />
        </div>
        <div className="incident-row">
          <label className="incident-label">Incident Status</label>
          <select className="incident-input"
            value={incidentStatus}
            onChange={e => setIncidentStatus(e.target.value)}>
            <option value="Running">Running</option>
            <option value="Expired">Expired</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="incident-row">
          <label className="incident-label">Urgency</label>
          <select className="incident-input"
            value={urgency}
            onChange={e => setUrgency(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="incident-row">
          <span className="incident-label" />
          <button className="incident-submit" type='submit'>Submit</button>
        </div>
      </form>
      <button
        type="button"
        className="goto-list-btn"
        style={{ marginTop: "18px", marginLeft: "auto", marginRight: "auto", display: "block" }}
        onClick={() => navigate('/incidents/list')}
      >
        View All Incidents
      </button>
    </div>
  );
};
