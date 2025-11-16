import React from "react";
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const loggedIn = useSelector(state => state.roleState.loggedIn);

  if (!isAdmin || !loggedIn) {
    return <Navigate to='/auth' />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! Use the links below to manage your system:</p>
      <ul style={{ lineHeight: '2.5rem', fontSize: '1.1rem' }}>
        <li>
          <Link to="/incidents/list" style={{ color: '#007bff', textDecoration: 'none' }}>
            <strong>View/Delete All Reported Incidents</strong>
          </Link>
        </li>
        <li>
          <Link to="/donate" style={{ color: '#007bff', textDecoration: 'none' }}>
            <strong>View/Edit/Delete All Donations</strong>
          </Link>
        </li>
        <li><strong>System Announcements</strong> (Coming soon)</li>
        <li><strong>Community Management</strong> (Coming soon)</li>
      </ul>
      <p style={{ marginTop: '2rem', color: '#888' }}>
        Use the navigation menu above to logout or access other features.
      </p>
    </div>
  );
}
