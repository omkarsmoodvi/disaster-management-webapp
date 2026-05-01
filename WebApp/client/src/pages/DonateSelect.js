import React from "react";
import { useNavigate } from "react-router-dom";

export default function DonateSelect() {
  const navigate = useNavigate();
  return (
    <div style={{ margin: "50px auto", maxWidth: "700px", textAlign: "center" }}>
      <h1>Support with a Donation!</h1>
      <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 40 }}>
        <div
          style={{
            border: "2px solid #7e70d6",
            borderRadius: 16,
            padding: "50px 36px",
            background: "#f3ebff",
            cursor: "pointer",
            width: 230,
            boxShadow: "0 2px 14px 0 #c1aacb28",
            fontSize: "1.4rem",
            fontWeight: 600,
            transition: ".18s"
          }}
          onClick={() => navigate("/donate/money")}
        >
          Money Donations
        </div>
        <div
          style={{
            border: "2px solid #8bb187",
            borderRadius: 16,
            padding: "50px 36px",
            background: "#e5ffeb",
            cursor: "pointer",
            width: 230,
            boxShadow: "0 2px 14px 0 #8ad1b028",
            fontSize: "1.4rem",
            fontWeight: 600,
            transition: ".18s"
          }}
          onClick={() => navigate("/donate/resource")}
        >
          Other Resources Donations
        </div>
      </div>
    </div>
  );
}
