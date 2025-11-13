import React, { useEffect, useState } from 'react';
import '../assets/CSS/Community.css';
import { useParams, useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const Community = () => {
  const { id } = useParams(); // This is the CommunityID from the URL
  const location = useLocation();
  const [incidents, setIncidents] = useState([]);
  const [community, setCommunity] = useState(null); // Optional, if you want to fetch specific community details

  // For contact
  const LeaderNum = '01735847466';
  const [Num, setNum] = useState('017xxxxxxxx (click to reveal)');

  // Fetch all incidents on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data));
  }, []);

  // (Optional) Fetch this community's details if you want to display its info
  useEffect(() => {
    fetch(`http://localhost:5000/api/communities/${id}`)
      .then(res => res.json())
      .then(data => setCommunity(data));
  }, [id]);

  const SetActive = (command) => {
    const navBars = ['.community-home', '.community-volunteers', '.community-announcement'];
    navBars.forEach((bars) => {
      if (bars === command) {
        document.querySelector(command).classList.add('com-nav-active');
      } else {
        document.querySelector(bars).classList.remove('com-nav-active');
      }
    });
  };

  useEffect(() => {
    if (location.pathname.split("/").length > 3) SetActive(".community-" + location.pathname.split("/")[3]);
    else SetActive(".community-home");
    // eslint-disable-next-line
  }, [location.pathname]);

  // Filter incidents for this community
  const communityIncidents = incidents.filter(
    inc => String(inc.CommunityID) === String(id)
  );

  return (
    <div className="community-page">
      <header className='com-header'>
        <h1 className='text-4xl font-medium pl-3'>
          {community ? community.Name : "Community"}
        </h1>
        <nav className='community-nav'>
          <ul>
            <li className='community-home' onClick={() => { SetActive('.community-home') }}>
              <Link to={`/community/${id}`}>Community</Link>
            </li>
            <li className='community-volunteers' onClick={() => { SetActive('.community-volunteers') }}>
              <Link to={`/community/${id}/volunteers`}>Volunteer</Link>
            </li>
            <li className='community-announcement' onClick={() => { SetActive('.community-announcement') }}>
              <Link to={`/community/${id}/announcement`}>Announcements</Link>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <section id="incident-list" style={{ marginTop: "40px" }}>
        <h2 className='text-2xl font-semibold'>Incidents Reported For This Community</h2>
        <table style={{ width: "100%", marginTop: "16px" }}>
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Urgency</th>
              <th>Affected</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {communityIncidents.length > 0 ? (
              communityIncidents.map(inc => (
                <tr key={inc.IncidentID}>
                  <td>{inc.IncidentID}</td>
                  <td>{inc.IncidentType}</td>
                  <td>{inc.Description}</td>
                  <td>{inc.Status}</td>
                  <td>{inc.Urgency}</td>
                  <td>{inc.ApproximateaffectedCount || "-"}</td>
                  <td>{new Date(inc.DateReported).toLocaleString()}</td>
                </tr>
              )))
              : (
                <tr>
                  <td colSpan="7">No incidents reported for this community.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>

      <section id="contact">
        <h2 className='text-4xl font-semibold mt-2 mb-2'>Contact and Support</h2>
        <ul>
          <li><span>Community Leader:</span> John Doe</li>
          <li><span>Phone:</span><span onClick={() => setNum(LeaderNum)}> {Num}</span></li>
          <li><span>Email:</span>
            <a href="mailto:arafat@gmail.com" target='_blank' rel="noreferrer">Mail Leader</a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Community;
