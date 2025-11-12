import React, { useEffect, useState } from "react";
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  }, []);
  return (
    <div>
      <h1>Important Announcements</h1>
      {announcements.length === 0 && <p>No announcements yet.</p>}
      <ul>
        {announcements.map(a =>
          <li key={a._id}>
            <strong>{a.title}</strong> <br /> {a.message} <br />
            <i>by {a.author || "Authority"} on {new Date(a.time).toLocaleString()}</i>
          </li>
        )}
      </ul>
    </div>
  );
};
export default Announcements;
