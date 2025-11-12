import React, { useEffect, useState } from 'react';
import '../assets/CSS/Statistics.css';

const Statistics = () => {
  const [incidentCount, setIncidentCount] = useState(0);
  // You can add similar hooks and counts for communities, donations etc if your API returns them.
  
  useEffect(() => {
    fetch("http://localhost:5000/api/incidents")
      .then(res => res.json())
      .then(data => setIncidentCount(data.length));
  }, []);
  
  return (
    <section className="statis">
      <div className="row">
        <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" id='IR'>
          <div className="box">
            <h3>{incidentCount}</h3>
            <p className="lead">Incidents Registered</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" id='Com'>
          <div className="box bg-danger p-3">
            <h3>-</h3>
            <p className="lead">Communities</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4 mb-md-0" id='TDon'>
          <div className="box bg-warning p-3">
            <h3>-</h3>
            <p className="lead">Total Donations</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" id='AP'>
          <div className="box bg-success p-3">
            <h3>-</h3>
            <p className="lead">Affected People</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" id='PS'>
          <div className="box bg-success p-3">
            <h3>-</h3>
            <p className="lead">Saved People</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" id='VC'>
          <div className="box bg-success p-3">
            <h3>-</h3>
            <p className="lead">Volunteers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Statistics };
