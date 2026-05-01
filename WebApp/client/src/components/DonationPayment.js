import React, { useState } from "react";
import axios from "axios";

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
  const [amount, setAmount] = useState("");
  const [donor, setDonor] = useState("");

  const handleDonate = async () => {
    if (!amount) {
      alert("Enter a valid amount");
      return;
    }
    const razorpayLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const orderRes = await axios.post("http://localhost:5000/api/donations/create-order", {
      amount: Number(amount),
      currency: "INR"
    });
    const { order, key_id } = orderRes.data;

    const options = {
      key: key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Disaster Management Donation",
      description: "Support our cause",
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await axios.post("http://localhost:5000/api/donations/verify-and-record", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          donor,
          amount: order.amount / 100
        });
        if (onDonation) onDonation(verifyRes.data.donation);
        alert("Donation successful and verified!");
        setAmount("");
        setDonor("");
      },
      prefill: { name: donor },
      theme: { color: "#3399cc" },
      method: {
        upi: "1",
        card: "1",
        netbanking: "1",
        wallet: "1"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>One-step Online Donation (Instantly Verified)</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={donor}
        onChange={(e) => setDonor(e.target.value)}
        style={{ marginBottom: 8, padding: 6, width: "100%" }}
      />
      <input
        type="number"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: 8, padding: 6, width: "100%" }}
      />
      <button onClick={handleDonate} style={{ padding: "10px 20px" }}>
        Donate Instantly (Razorpay)
      </button>
    </div>
  );
};

export default DonationPayment;
