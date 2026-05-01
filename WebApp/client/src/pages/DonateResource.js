import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ManualDonationForm = ({ onDonation }) => {
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [donor, setDonor] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const formRef = useRef();

  const handleManualDonate = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!type || !item || !qty) { setMessage("Fill ALL fields for manual donation!"); return; }
    try {
      const formData = new FormData();
      formData.append('donor', donor || "Anonymous");
      formData.append('type', type);
      formData.append('item', item);
      formData.append('quantity', qty);
      formData.append('usage', 'Pending');
      if (image) formData.append('proofImage', image);
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const donation = await res.json();
        onDonation(donation);
        setType(""); setItem(""); setQty(""); setDonor(""); setImage(null);
        if (formRef.current) formRef.current.reset();
        setMessage("Donation recorded! (Will be verified by admin)");
      } else {
        setMessage("Donation failed to record!");
      }
    } catch {
      setMessage("Donation failed. Server error!");
    }
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: "36px auto",
      background: "rgba(255,255,255,0.94)",
      padding: 36,
      borderRadius: "18px",
      boxShadow: "0 2px 32px #0002"
    }}>
      <h2 style={{fontWeight:700, marginBottom:20}}>Resource/Item Donation (Food/Clothes/Other)</h2>
      <form ref={formRef} style={{display:"flex",gap:"11px",marginBottom:"1.8rem",flexWrap:'wrap'}} onSubmit={handleManualDonate} encType="multipart/form-data">
        <input style={{flex:1,maxWidth:'155px'}} placeholder="Your name" value={donor} onChange={e => setDonor(e.target.value)} />
        <input style={{flex:1,maxWidth:'160px'}} placeholder="Type (Food/Clothes/Other)" value={type} onChange={e => setType(e.target.value)} required />
        <input style={{flex:2,minWidth:"210px"}} placeholder="Item/Description" value={item} onChange={e => setItem(e.target.value)} required />
        <input style={{flex:1,maxWidth:"120px"}} placeholder="Quantity" value={qty} onChange={e => setQty(e.target.value)} required />
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{flex:2,maxWidth:"210px"}} />
        <button type="submit" style={{fontWeight:'bold'}}>Donate Resource</button>
      </form>
      {message && <span style={{color:"green", marginLeft:7}}>{message}</span>}
    </div>
  );
};

const ResourceDonationsTable = () => {
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/donations')
      .then(res => res.json())
      .then(data => setDonations(data.filter(d => (d.type || "").toLowerCase() !== "money").reverse()))
      .catch(() => setDonations([]));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setDonations(donations.filter(d => d._id !== id));
    else alert("Failed to delete.");
  };

  const handleEdit = async (id) => {
    const usage = prompt("Enter new usage/status (leave blank to skip):");
    const quantity = prompt("New quantity (blank to keep):");
    if (!usage && !quantity) return;
    const update = {};
    if (usage) update.usage = usage;
    if (quantity) update.quantity = quantity;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(update)
    });
    if (res.ok) setDonations(donations.map(d => d._id === id ? { ...d, ...update } : d));
    else alert("Failed to update.");
  };

  const thstyle = {
    border: "1px solid #b4bdc5", padding: "13px 4px", background: "rgba(240,255,255,0.10)", fontWeight: 700, fontSize:"1.12rem"
  };
  const tdstyle = {
    border: "1px solid #b4bdc5", padding: "11px 3px", textAlign: "center"
  };
  const btnstyle = {
    margin: "0 4px",
    padding: "6px 11px",
    borderRadius: 5,
    fontWeight: "bold",
    border: "1.5px solid #64bb7c",
    background: "rgba(243,255,245,0.95)",
    cursor: "pointer"
  };

  return (
    <div style={{ maxWidth: 1150, margin: "40px auto" }}>
      <h2 style={{marginBottom:20, textAlign:"left", fontWeight:700, marginLeft:10, color: "#fff", textShadow: "1.5px 2px 7px #2d0f1af0"}}>All Resource Donations</h2>
      <div style={{
        background: "rgba(227,248,245,.87)",
        borderRadius: "50px",
        padding: "16px 16px 8px 16px",
        boxShadow: "0 2px 32px #0002"
      }}>
        <table style={{width:"100%", borderCollapse:"collapse", fontSize:"1.12rem"}}>
          <thead>
            <tr>
              <th style={thstyle}>Donor</th>
              <th style={thstyle}>Type</th>
              <th style={thstyle}>Item/Description</th>
              <th style={thstyle}>Quantity</th>
              <th style={thstyle}>Image/Proof</th>
              <th style={thstyle}>Status/Usage</th>
              {isAdmin && <th style={thstyle}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d._id}>
                <td style={tdstyle}>{d.donor}</td>
                <td style={tdstyle}>{d.type}</td>
                <td style={tdstyle}>{d.item}</td>
                <td style={tdstyle}>{d.quantity}</td>
                <td style={tdstyle}>
                  {d.proofImage ?
                    <a href={`http://localhost:5000${d.proofImage}`} target="_blank" rel="noopener noreferrer">View</a>
                    : ""}
                </td>
                <td style={tdstyle}>{d.usage}</td>
                {isAdmin && (
                  <td style={tdstyle}>
                    <button onClick={() => handleEdit(d._id)} style={btnstyle}>Edit</button>
                    <button onClick={() => handleDelete(d._id)} style={btnstyle}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DonateResource() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div
      style={{
        minHeight:"100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background/donateresourcespage.jpeg"})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "0 0 40px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <h1 style={{
        textAlign: "center",
        padding: "38px 0 12px 0",
        fontWeight: 800,
        color: "#fff",
        textShadow: "1.5px 2px 8px #2b192970"
      }}>Resource/Item Donations</h1>
      <ManualDonationForm onDonation={() => setRefresh(x => x + 1)} />
      <ResourceDonationsTable key={refresh} />
    </div>
  );
}
