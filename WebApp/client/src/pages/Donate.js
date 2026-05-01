import React from "react";
import { useNavigate } from "react-router-dom";

export default function Donate() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background/donatepage.jpeg"})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1 style={{
        marginTop: 70,
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: ".5px",
        textShadow: "1.5px 2px 8px #2b192970"
      }}>
        Support with a Donation!
      </h1>
      <div style={{
        marginTop: 56,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 60
      }}>
        <div
          style={{
            border: "2.5px solid #7e70d6",
            borderRadius: 20,
            padding: "65px 55px",
            background: "rgba(255,255,255,0.91)",
            cursor: "pointer",
            width: 280,
            boxShadow: "0 5px 32px 0 #c1aacb28",
            fontSize: "1.5rem",
            fontWeight: 650,
            minHeight: 185,
            userSelect: "none",
            transition: "box-shadow .16s, transform .15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => navigate("/donate/money")}
        >
          💸 &nbsp; Money Donations
        </div>
        <div
          style={{
            border: "2.5px solid #8bb187",
            borderRadius: 20,
            padding: "65px 55px",
            background: "rgba(255,255,255,0.91)",
            cursor: "pointer",
            width: 280,
            boxShadow: "0 5px 32px 0 #8ad1b028",
            fontSize: "1.5rem",
            fontWeight: 650,
            minHeight: 185,
            userSelect: "none",
            transition: "box-shadow .16s, transform .15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => navigate("/donate/resource")}
        >
          🎁 &nbsp; Other Resources Donations
        </div>
      </div>
      <div style={{
        marginTop: 50,
        fontSize: "1.15rem",
        color: "#fffde9",
        textShadow: "1.5px 2px 7px #210f1bda"
      }}>
        <div style={{marginBottom:5}}>Select what type of donation you wish to make.</div>
        <div>(You can always come back and choose the other!)</div>
      </div>
    </div>
  );
}
