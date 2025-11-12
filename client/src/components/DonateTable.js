import React, { useState, useEffect } from "react";

function DonateTable() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => setDonations(data));
  }, []);

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

  return (
    <table>
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
        {donations.map(d => (
          <tr key={d._id}>
            <td>{d.donor}</td>
            <td>{d.type}</td>
            <td>{d.item}</td>
            <td>{d.quantity}</td>
            <td>{d.transactionId}</td>
            <td>
              {d.proofImage ? (
                <a href={`http://localhost:5000${d.proofImage}`} target="_blank" rel="noreferrer">View</a>
              ) : ""}
            </td>
            <td>{d.usage || "Pending"}</td>
            <td>
              <button onClick={() => handleEdit(d._id)}>Edit</button>
              <button onClick={() => handleDelete(d._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DonateTable;
