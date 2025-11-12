import React, { useEffect, useState } from 'react';

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data.reverse()));
  }, []);
  const deleteIncident = (id) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(`http://localhost:5000/api/incidents/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) setIncidents(incidents.filter(x => x._id !== id));
        else alert('Delete failed');
      });
  };
  return (
    <div style={{margin: "3rem auto", maxWidth: "950px"}}>
      <h1>All Reported Incidents</h1>
      <table className="incident-table" style={{width: "100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th>Incident ID</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Affected</th>
            <th>Date</th>
            <th>Community</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr key={inc._id}>
              <td>{inc.LocationID || inc._id}</td>
              <td>{inc.IncidentType}</td>
              <td>{inc.Description}</td>
              <td>{inc.Status}</td>
              <td>{inc.Urgency}</td>
              <td>{inc.AffectedIndividuals || inc.ApproximateaffectedCount}</td>
              <td>{new Date(inc.DateReported).toLocaleString()}</td>
              <td>{inc.CommunityID}</td>
              <td>
                <button onClick={() => deleteIncident(inc._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {incidents.length === 0 && <p>No incidents reported.</p>}
    </div>
  );
};
export default IncidentsList;
