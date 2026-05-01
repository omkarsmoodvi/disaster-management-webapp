import React, { useEffect, useState } from "react";

export default function Announcements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setAnns(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: 32, background: "rgba(255,255,255,0.86)", borderRadius: 18, minHeight: "60vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: 18 }}>
        Important Announcements
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : anns.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666" }}>No announcements to display.</div>
      ) : (
        anns.map((a) => (
          <div key={a._id} style={{
            background: '#fafafd', margin: "22px 0", padding: 20, borderRadius: 13, boxShadow: "0 1px 7px #dbe4fa"
          }}>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>{a.Content}</div>
            <div style={{ color: "#548", fontSize: 14 }}>
              Announced by: <b>{a.SourceType}</b>{a.CreatedBy ? ` (${a.CreatedBy})` : ""}
              {a.CreationDate && (
                <span> on {new Date(a.CreationDate).toLocaleString()}</span>
              )}
            </div>
            <div style={{ color: "#b24", fontSize: 13, fontWeight: 500 }}>Urgency: {a.Urgency}</div>
            {a.ImageUrl && <img src={a.ImageUrl} alt="Announcement" style={{ maxWidth: 180, margin: '10px 0', borderRadius: 8 }}/>} 
          </div>
        ))
      )}
    </div>
  );
}
