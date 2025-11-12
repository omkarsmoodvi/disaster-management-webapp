import React, { useEffect, useState } from 'react'
import "../../assets/CSS/Communities.css"
import { useNavigate } from 'react-router-dom'

export const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/communities')
      .then(res => res.json())
      .then(data => setCommunities(data));
  }, []);

  return (
    <div>
      <h1 style={{ marginLeft: '25px' }}>Here's the current list of communities :</h1>
      <table style={{
        display: 'table'
      }}>
        <thead>
          <tr>
            <th>ComID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Date Created</th>
            <th>Type</th>
            <th>Details</th>
            <th>Number of Users</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {communities.map(com => (
            <tr key={com.ComID}>
              <td>{com.ComID}</td>
              <td>{com.name}</td>
              <td>{com.location}</td>
              <td>{new Date(com.createdAt).toLocaleString()}</td>
              <td>{com.type}</td>
              <td style={{ maxWidth: '180px' }}>{com.details}</td>
              <td>{com.users ? com.users.length : '-'}</td>
              <td>
                <button className='action-btn' onClick={() => {
                  navigate(`/community/${com.ComID}`);
                }}>See Insights</button>
                {/* You can add Leave/Join logic based on membership here */}
                <button className='action-btn'>Join/Leave</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
