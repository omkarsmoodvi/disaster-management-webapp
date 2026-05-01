import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";

// Helper to load Razorpay SDK dynamically
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const DonationPayment = ({ onDonation }) => {
  const [donor, setDonor] = useState("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!amount) return alert("Please enter a valid amount");
    setProcessing(true);
    const razorpayLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!razorpayLoaded) {
      setProcessing(false);
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    let orderRes;
    try {
      orderRes = await axios.post("http://localhost:5000/api/donations/create-order", {
        amount: Number(amount),
        currency: "INR",
      });
    } catch (err) {
      setProcessing(false);
      alert("Could not create payment order. Backend error!");
      return;
    }

    // Expect your backend to return: { order: {id, amount, currency, ...}, key_id }
    const { order, key_id } = orderRes.data;

    const options = {
      key: key_id, // <- GET FROM BACKEND, DO NOT HARDCODE
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Disaster Management Donation",
      description: "Support our cause",
      handler: async function (response) {
        // 3. Send to /verify-and-record
        try {
          const verifyRes = await axios.post("http://localhost:5000/api/donations/verify-and-record", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donor,
            amount: order.amount / 100,
          });
          if (onDonation) onDonation(verifyRes.data.donation);
          alert("Donation successful and verified!");
          setDonor(""); setAmount("");
        } catch {
          alert("Payment succeeded but failed to log donation in backend.");
        }
      },
      prefill: { name: donor },
      theme: { color: "#3399cc" }
    };

    setProcessing(false);
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "36px auto 36px auto",
      background: "rgba(255,255,255,0.94)",
      padding: 36,
      borderRadius: "18px",
      boxShadow: "0 2px 32px #0002",
      opacity: 0.98
    }}>
      <h2 style={{fontWeight:700, marginBottom:20}}>Money Donation (Online)</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={donor}
        onChange={(e) => setDonor(e.target.value)}
        style={{ marginBottom: 10, padding: 8, width: "100%" }}
      />
      <input
        type="number"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: "100%" }}
      />
      <button onClick={handlePay} style={{ padding: "12px 36px", fontWeight:'bold', fontSize:"1.2rem", borderRadius:7 }} disabled={processing}>
        {processing ? "Processing..." : "Donate Now"}
      </button>
    </div>
  );
};

const MoneyDonationsTable = () => {
  const isAdmin = useSelector(state => state.roleState.isAdmin);
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/donations')
      .then(res => res.json())
      .then(data => setDonations(data.filter(d => (d.type || "").toLowerCase() === "money").reverse()))
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
    const quantity = prompt("New amount (blank to keep):");
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
    border: "1.5px solid #6d6fee",
    background: "rgba(245,245,255,0.95)",
    cursor: "pointer"
  };

  return (
    <div style={{ maxWidth: 1040, margin: "40px auto" }}>
      <h2 style={{marginBottom:20, textAlign:"left", fontWeight:700, marginLeft:10, color: "#fff", textShadow: "1.5px 2px 7px #2d0f1af0"}}>All Money Donations</h2>
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
              <th style={thstyle}>Amount</th>
              <th style={thstyle}>Transaction/Ref</th>
              <th style={thstyle}>Image/Proof</th>
              <th style={thstyle}>Status/Usage</th>
              {isAdmin && <th style={thstyle}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d._id}>
                <td style={tdstyle}>{d.donor}</td>
                <td style={tdstyle}>{d.quantity}</td>
                <td style={tdstyle}>{d.transactionId}</td>
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

export default function DonateMoney() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div
      style={{
        minHeight:"100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background/donatemoneypage.jpeg"})`,
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
        textAlign:"center",
        padding:"38px 0 12px 0",
        fontWeight:800,
        color:'#fff',
        textShadow: "1.5px 2px 8px #2b192970"
      }}>
        Money Donations
      </h1>
      <DonationPayment onDonation={()=>setRefresh(x=>x+1)} />
      <MoneyDonationsTable key={refresh} />
    </div>
  );
}
