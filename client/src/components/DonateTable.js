import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

function DonateTable() {
  const [donations, setDonations] = useState([]);
  const isAdmin = useSelector(state => state.roleState.isAdmin);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => setDonations(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, { 
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
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
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/donations/${id}`, {
      method: "PATCH",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(update)
    });
    if (res.ok) {
      setDonations(donations.map(d => d._id === id ? { ...d, ...update } : d));
    } else {
      alert("Failed to update.");
    }
  };

  return (
