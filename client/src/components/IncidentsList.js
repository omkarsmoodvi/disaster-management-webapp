import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const isAdmin = useSelector(state => state.roleState.isAdmin);

  // Assign IncidentIDs sequentially, always starting from 1
  const assignIds = (incidentsArr) => {
    return incidentsArr.map((inc, idx) => ({
      ...inc,
      IncidentID: idx + 1
    }));
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(assignIds(data.reverse())));
      // .reverse() keeps most recent on top and IDs match the new order
  }, []);

  const deleteIncident = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/incidents/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          const filtered = incidents.filter(x => x._id !== id);
          setIncidents(assignIds(filtered));
        }
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
            <th>Date</th>
            {isAdmin && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {incidents.map(inc => (
            <tr key={inc._id}>
              <td>{inc.IncidentID}</td>
              <td>{inc.IncidentType}</td>
              <td>{inc.Description}</td>
              <td>{inc.Status}</td>
              <td>{inc.Urgency}</td>
              <td>{new Date(inc.DateReported).toLocaleString()}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => deleteIncident(inc._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {incidents.length === 0 && <p>No incidents reported.</p>}
    </div>
  );
};
export default IncidentsList;
