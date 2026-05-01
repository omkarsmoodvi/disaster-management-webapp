import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../App.css'; // your CSS file above

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const isAdmin = useSelector(state => state.roleState.isAdmin);

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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background/viewincidentspage.jpeg'})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start"
      }}
    >
      <div className="incidents-table-overlay">
        <h1>All Reported Incidents</h1>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Urgency</th>
                <th>Date</th>
                <th>Image</th>
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
                  <td>
                    {inc.IncidentImage
                      ? <a href={`http://localhost:5000${inc.IncidentImage}`} target="_blank" rel="noopener noreferrer">View</a>
                      : ""}
                  </td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => deleteIncident(inc._id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {incidents.length === 0 && <p style={{color:"#fff", textAlign:"center"}}>No incidents reported.</p>}
      </div>
    </div>
  );
};

export default IncidentsList;
