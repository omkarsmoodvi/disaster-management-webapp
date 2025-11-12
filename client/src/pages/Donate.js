import React, { useState, useEffect, useRef } from 'react';

const DONATE_ACCOUNT = "UPI: dmsrelief2025@upi (PayTM/PhonePe/GooglePay)\nBank A/C: 1234567890, IFSC: SBIN0001234";

function Donate() {
  const [donations, setDonations] = useState([]);
  const [type, setType] = useState('');
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [donor, setDonor] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [message, setMessage] = useState('');
  const proofInputRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/donations')
      .then(res => res.json())
      .then(data => setDonations(data.reverse()))
      .catch(() => setDonations([]));
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!type || !item || !qty) { setMessage("Please fill ALL donation fields."); return; }
    if (type.trim().toLowerCase() === 'money' && (!transactionId.trim() || !proofImage)) {
      setMessage("Money donation: UPI Ref./transaction ID and payment screenshot are required!");
      return;
    }
    const formData = new FormData();
    formData.append('donor', donor || "Anonymous");
    formData.append('type', type);
    formData.append('item', item);
    formData.append('quantity', qty);
    formData.append('usage', 'Pending');
    if (type.trim().toLowerCase() === "money") {
      formData.append('transactionId', transactionId);
      formData.append('proofImage', proofImage);
    }
    try {
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const donation = await res.json();
        setDonations(prev => [donation, ...prev]);
        setType(''); setItem(''); setQty(''); setDonor(''); setTransactionId(''); setProofImage(null);
        if (proofInputRef.current) proofInputRef.current.value = '';
        setMessage('Thank you for your donation!');
      } else {
        setMessage('Donation failed.');
      }
    } catch {
      setMessage('Donation failed.');
    }
  };

  // Edit/Delete Features
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, { method: "DELETE" });
    if (res.ok) setDonations(donations.filter(d => d._id !== id));
    else alert("Failed to delete.");
  };

  const handleEdit = async (id) => {
    const usage = prompt("Enter new usage/status (leave blank to skip):");
    const quantity = prompt("New quantity/amount (blank to keep):");
    if (!usage && !quantity) return;
    const update = {};
    if (usage) update.usage = usage;
    if (quantity) update.quantity = quantity;
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (res.ok) {
      setDonations(donations.map(d => d._id === id ? { ...d, ...update } : d));
    } else {
      alert("Failed to update.");
    }
  };

  // ------- RENDER --------

  return (
    <div style={{margin: "34px"}}>
      <h1>Support with a Donation!</h1>
      <form style={{display:"flex",gap:"7px",marginBottom:"1.2rem",flexWrap:'wrap'}} onSubmit={handleDonate} encType="multipart/form-data">
        <input
          placeholder="Your name (optional)"
          value={donor}
          onChange={e => setDonor(e.target.value)}
          style={{flex:1,maxWidth:'180px'}}
        />
        <input
          placeholder="Type (Food/Money/Other)"
          value={type}
          onChange={e => setType(e.target.value)}
          style={{flex:1,maxWidth:'150px'}}
          required
        />
        <input
          placeholder="Item/Description"
          value={item}
          onChange={e => setItem(e.target.value)}
          style={{flex:2,minWidth:"180px"}}
          required
        />
        <input
          placeholder="Quantity/Amount"
          value={qty}
          onChange={e => setQty(e.target.value)}
          style={{flex:1,maxWidth:"120px"}}
          required
        />

        {type.trim().toLowerCase() === "money" && (
          <>
            <input
              placeholder="Transaction/UPI Ref ID"
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              style={{flex:2, minWidth:"150px"}}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setProofImage(e.target.files[0])}
              ref={proofInputRef}
              required
              style={{flex: 2, minWidth: "180px"}}
            />
          </>
        )}

        <button type="submit" style={{fontWeight:'bold'}}>Donate</button>
      </form>

      {message && <p style={{color:"green", marginBottom:"8px"}}>{message}</p>}
      {type.trim().toLowerCase() ==="money" && (
        <div style={{
          background:'#ebfff0',padding:'12px 14px',marginBottom:'8px',borderRadius:'6px',border:'1.5px solid #2f886e'
        }}>
          <b>Money Donation Instructions:</b><br/>
          <span style={{whiteSpace:"pre-line",fontSize:'1.09rem',fontWeight:'bold'}}>{DONATE_ACCOUNT}</span>
          <br />
          After sending, mention ref in "Transaction/UPI Ref ID" and upload the screenshot.
        </div>
      )}

      <h2>All Donations and Usage</h2>
      <table className="incident-table" style={{minWidth:"850px",marginBottom:"38px"}}>
        <thead>
          <tr>
            <th>Donor</th>
            <th>Type</th>
            <th>Item/Description</th>
            <th>Quantity/Amount</th>
            <th>Transaction/Ref</th>
            <th>Proof</th>
            <th>Status/Usage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d,i) => (
            <tr key={d._id || i}>
              <td>{d.donor}</td>
              <td>{d.type}</td>
              <td>{d.item}</td>
              <td>{d.quantity}</td>
              <td>{d.transactionId}</td>
              <td>
                {d.proofImage ?
                  <a href={`http://localhost:5000${d.proofImage}`} target="_blank" rel="noopener noreferrer">View</a>
                  : ""}
              </td>
              <td>{d.usage}</td>
              <td>
                <button onClick={() => handleEdit(d._id)}>Edit</button>
                <button onClick={() => handleDelete(d._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <em>
        <b>Admin/NGO verifies transaction screenshots before using money/allocating resources. Thank you for supporting relief work!</b>
      </em>
    </div>
  );
}

export default Donate;
