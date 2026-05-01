import React, { useState, useRef } from 'react';
import '../assets/CSS/Incidents.css';
import { useNavigate } from 'react-router-dom';

function Incidents() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [incidentType, setIncidentType] = useState('Earthquake');
  const [otherType, setOtherType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentStatus, setIncidentStatus] = useState('Running');
  const [urgency, setUrgency] = useState('High');
  const [incidentImage, setIncidentImage] = useState(null);

  let reporter = 1;
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.UserID && /^\d+$/.test(userData.UserID)) {
      reporter = Number(userData.UserID);
    }
  } catch {
    reporter = 1;
  }

  const submitIncident = async (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!reporter) missingFields.push('ReportedBy');
    if (!incidentType) missingFields.push('IncidentType');
    if (incidentType === "Others" && !otherType.trim()) missingFields.push('CustomType');
    if (!incidentDate) missingFields.push('DateReported');
    if (!incidentLocation.trim()) missingFields.push('IncidentLocation');
    if (!incidentDescription.trim()) missingFields.push('Description');
    if (!incidentStatus) missingFields.push('Status');
    if (!urgency) missingFields.push('Urgency');
    if (!incidentImage) missingFields.push('IncidentImage');
    if (!(incidentImage instanceof File)) missingFields.push('IncidentImageValidFile');
    if (missingFields.length > 0) {
      alert("All fields are required.\nMissing: " + missingFields.join(', '));
      return;
    }
    const formData = new FormData();
    formData.append('ReportedBy', Number(reporter));
    formData.append('IncidentType', incidentType);
    if (incidentType === "Others") formData.append('CustomType', otherType.trim());
    formData.append('IncidentLocation', incidentLocation.trim());
    formData.append('Location', incidentLocation.trim());
    formData.append('Description', incidentDescription.trim());
    formData.append('Status', incidentStatus);
    formData.append('Urgency', urgency);
    formData.append('DateReported', incidentDate);
    formData.append('IncidentImage', incidentImage);
    try {
      const res = await fetch('http://localhost:5000/api/incidents', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Incident reported!');
        setIncidentDescription('');
        setIncidentLocation('');
        setIncidentType('Earthquake');
        setOtherType('');
        setIncidentDate('');
        setIncidentStatus('Running');
        setUrgency('High');
        setIncidentImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errJson = await res.json();
        alert("Failed to report incident: " + (errJson.error || ""));
      }
    } catch (err) {
      alert("Error submitting incident.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background/incidentreportpage.jpeg'})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="incident-form-container">
        <h1 className="incident-header">Report an Incident</h1>
        <form onSubmit={submitIncident} className="incident-form" encType="multipart/form-data">
          <div className="incident-row">
            <label className="incident-label">Incident Type</label>
            <select
              className="incident-input"
              value={incidentType}
              onChange={e => setIncidentType(e.target.value)}>
              <option value="Flood">Flood</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Accident">Accident</option>
              <option value="Medical">Medical</option>
              <option value="Riot">Riot</option>
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
            <input
              className="incident-input"
              type="datetime-local"
              value={incidentDate}
              onChange={e => setIncidentDate(e.target.value)}
              required
            />
          </div>
          <div className="incident-row">
            <label className="incident-label">Incident Location</label>
            <input
              className="incident-input"
              type="text"
              value={incidentLocation}
              onChange={e => setIncidentLocation(e.target.value)}
              required
            />
          </div>
          <div className="incident-row">
            <label className="incident-label">Incident Description</label>
            <input
              className="incident-input"
              value={incidentDescription}
              onChange={e => setIncidentDescription(e.target.value)}
              required
            />
          </div>
          <div className="incident-row">
            <label className="incident-label">Incident Status</label>
            <select
              className="incident-input"
              value={incidentStatus}
              onChange={e => setIncidentStatus(e.target.value)}>
              <option value="Running">Running</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="incident-row">
            <label className="incident-label">Urgency</label>
            <select
              className="incident-input"
              value={urgency}
              onChange={e => setUrgency(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="incident-row">
            <label className="incident-label">Incident Image</label>
            <input
              ref={fileInputRef}
              className="incident-input file-input"
              type="file"
              accept="image/*"
              onChange={e =>
                setIncidentImage(
                  e.target.files && e.target.files.length > 0
                    ? e.target.files[0]
                    : null
                )
              }
              required
            />
          </div>
          <div className="incident-row">
            <span className="incident-label" />
            <button className="incident-submit" type='submit'>Submit</button>
          </div>
        </form>
        <button
          type="button"
          className="goto-list-btn"
          onClick={() => navigate('/incidents/list')}
        >
          View All Incidents
        </button>
      </div>
    </div>
  );
}

export default Incidents;
