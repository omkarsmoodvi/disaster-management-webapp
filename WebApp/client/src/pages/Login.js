import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeRole } from "../store/roleSlice";
import Header from "../components/Header";
import "../assets/CSS/Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");

  async function sendLogInfo(e) {
    e.preventDefault();
    setErrorMsg("");
    setVerifyMsg("");
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password })
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || data.message || "Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.UserType ? data.user.UserType.join(",") : "");
      localStorage.setItem("userName", data.user.Name || "");
      dispatch(changeRole(data.user.UserType || []));
      setVerifyMsg("Login successful! Redirecting...");
      navigate("/");
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
    }
  }

  return (
    <div
      className="login-page-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background/loginpage.jpeg'})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <Header loginPage />
      <div className="login-center-main">
        <div className="login-card">
          <h2 className="loginTitle">Login</h2>
          <form onSubmit={sendLogInfo} style={{ width: "100%" }}>
            <div className="login-label-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="login-input"
                autoFocus
              />
            </div>
            <div className="login-label-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="login-input"
              />
            </div>
            {errorMsg && <div className="loginError">{errorMsg}</div>}
            {verifyMsg && <div className="loginError" style={{ color: "green" }}>{verifyMsg}</div>}
            <button type="submit" className="login-gradient-btn">Log In</button>
          </form>
          <div style={{ textAlign: "right", width: "100%", marginTop: "6px" }}>
            <Link to="/forgot-password" className="ig-forgot-link">Forgot password?</Link>
          </div>
          <div style={{ fontSize: "1.04rem", marginTop: "14px" }}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
