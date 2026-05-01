import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearRole } from "../store/roleSlice";
import "../assets/CSS/Header.css";

export default function Header() {
  const loggedIn = useSelector(state => state.roleState.loggedIn);
  const isAdmin = useSelector(state => state.roleState.isAdmin); // <-- ADDED
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    dispatch(clearRole());
    navigate("/login");
  };

  return (
    <header className="dms-header">
      <div className="nav-left">
        <span className="dms-logo-text">DMS</span>
        <div className="dms-title">
          Disaster <span>Management System</span>
        </div>
        {loggedIn && (
          <nav className="navbar-links">
            <Link to="/incidents" className="nav-link">Incidents</Link>
            <Link to="/announcements" className="nav-link">Announcements</Link>
            <Link to="/donate" className="nav-link">Donations</Link>
            <Link to="/medicals" className="nav-link">Medicals</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            {/* ^^^^ This link only appears for admins */}
          </nav>
        )}
      </div>
      <div className="nav-right">
        {!loggedIn && (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Register</Link>
          </>
        )}
        {loggedIn && (
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </header>
  );
}
