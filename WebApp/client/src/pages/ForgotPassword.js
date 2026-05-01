import { useState } from "react";
import "../assets/CSS/Login.css";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function handleSend(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email })
      });
      if (res.status === 200) {
        setMessage("Password reset link sent. Check your email!");
      } else {
        setMessage("Failed to send reset link. Try again.");
      }
    } catch {
      setMessage("Something went wrong.");
    }
  }
  return (
    <div className="ig-login-bg">
      <div className="ig-login-flex-center">
        <div className="ig-login-col ig-right-col">
          <div className="ig-login-card">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSend} className="ig-login-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ig-login-input"
              />
              <button type="submit" className="ig-login-btn">Send Reset Link</button>
              {message && <div className="ig-login-error">{message}</div>}
            </form>
            <div style={{ marginTop: 16 }}>
              <Link to="/login" className="ig-forgot-link">Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
