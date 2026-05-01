import React, { useState, useEffect } from "react";

export default function AdminAnnouncements() {
  const [form, setForm] = useState({
    Content: "",
    CreatedBy: "", // Optional
    Urgency: "medium",
    SourceType: "admin",
    image: null,
  });
  const [msg, setMsg] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then(r => r.ok ? r.json() : [])
      .then(setAnnouncements);
  }, [msg]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        body: data,
        credentials: 'include',
      });
      if (!res.ok) {
        const detail = await res.json().catch(()=>{});
        setMsg(detail?.error || "Error posting announcement.");
        return;
      }
      setMsg("Announcement posted!");
      setForm({
        Content: "",
        CreatedBy: "",
        Urgency: "medium",
        SourceType: "admin",
        image: null,
      });
    } catch {
      setMsg("Network error.");
    }
  }

  function handleDelete(id) {
    fetch(`/api/announcements/${id}`, {
      method: "DELETE",
      credentials: 'include',
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => setMsg("Announcement deleted."))
      .catch(() => setMsg("Error deleting announcement."));
  }

  return (
    <div style={{
      maxWidth: 520,
      margin: "48px auto",
      borderRadius: 22,
      boxShadow: "0 6px 28px rgba(100,120,220,0.16)",
      background: "linear-gradient(120deg,#eaf5ff 60%,#e7c2fd 105%)",
      padding: "40px 38px 36px 38px"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: 28, fontWeight: "bold", letterSpacing: 0.5 }}>
        Post New Announcement
      </h3>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 500, fontSize: 17 }}>Who is announcing?
          <select name="SourceType" required value={form.SourceType} onChange={handleChange}
            style={{ marginLeft: 14, padding: 12, borderRadius: 15, fontSize: 17, background: "#fcfcfe", border: "1.5px solid #a8bcf4", marginBottom: 20, minWidth: 180, display: 'inline-block' }}>
            <option value="admin">Admin</option>
            <option value="ngo">NGO</option>
            <option value="hospital">Hospital</option>
            <option value="police">Police</option>
          </select>
        </label>
        <br />
        <label style={{ fontWeight: 500, fontSize: 17 }}>Content:<br />
          <textarea name="Content" required value={form.Content} onChange={handleChange}
            style={{ width: '100%', marginTop: 8, marginBottom: 18, minHeight: 68, fontSize: 16, borderRadius: 12, border: "1.4px solid #b2d3fd", padding: 12 }}/>
        </label>
        <label style={{ fontWeight: 500, fontSize: 17 }}>Urgency:
          <select name="Urgency" value={form.Urgency} onChange={handleChange}
            style={{ marginLeft: 15, padding: 10, borderRadius: 11, background: "#f4faff", border: "1px solid #aaccfa", fontSize: 16 }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <br /><br />
        <label style={{ fontWeight: 500, fontSize: 17 }}>Image (optional):
          <input type="file" name="image" accept="image/*" onChange={handleChange} style={{ marginLeft: 12 }} />
        </label>
        <br /><br />
        <button type="submit" style={{
          background: "linear-gradient(90deg,#91c5fd,#d8b7fe)",
          color: "#254",
          fontWeight: 600,
          border: "none",
          borderRadius: 17,
          padding: "13px 2.5em",
          fontSize: "1.16em",
          boxShadow: "0 2px 8px rgba(140,180,230,0.13)",
          cursor: "pointer"
        }}>Add Announcement</button>
      </form>
      <div style={{ color: msg.includes("Error") ? "#c23e2b" : "#037", marginTop: 24, textAlign: "center", fontWeight: 500, fontSize: 18 }}>{msg}</div>
      <hr style={{ marginTop: 32, marginBottom: 16, border: 0, borderBottom: "1px solid #bdd" }}/>
      <h4>Recent Announcements</h4>
      {announcements.map(a => (
        <div key={a._id} style={{
          background: '#fff', margin: "15px 0", padding: 14, borderRadius: 12, boxShadow: "0 1px 8px #cbd2f7"
        }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>{a.Content}</div>
          <div style={{ fontSize: 15, color: "#664" }}>Announced by: {a.SourceType}</div>
          <div style={{ fontSize: 13, color: "#889" }}>{a.Urgency}</div>
          {a.ImageUrl && <img src={a.ImageUrl} alt="Announcement" style={{ maxWidth: 120, margin: '8px 0', borderRadius: 7 }}/>}<br />
          <button onClick={() => handleDelete(a._id)} style={{
            marginTop: 7, fontSize: 13, borderRadius: 8, background: '#e4acbc', color: '#d11', border: 'none', padding: '5px 14px', cursor: 'pointer'
          }}>Delete</button>
        </div>
      ))}
    </div>
  );
}
