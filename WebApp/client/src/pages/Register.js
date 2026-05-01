import React, { useState } from "react";
import Header from "../components/Header";
import "../assets/CSS/Register.css";

export default function Register() {
  const [fields, setFields] = useState({
    name: "", email: "", phnNumber: "", district: "", pass: "", address: ""
  });
  const [touched, setTouched] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleBlur = e => setTouched({ ...touched, [e.target.name]: true });
  const updateField = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const missingField = () => {
    for (let k of Object.keys(fields)) {
      if (!fields[k]) return k;
    }
    return null;
  };

  function fieldLabel(name) {
    switch (name) {
      case "name": return "Full Name";
      case "email": return "Email";
      case "phnNumber": return "Phone number";
      case "district": return "District";
      case "address": return "Address";
      case "pass": return "Password";
      default: return name;
    }
  }

  async function sendRegInfo(e) {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    const missing = missingField();
    if (missing) return setErrorMsg(`${fieldLabel(missing)} is required.`);
    setSuccessMsg("Registration successful!");
    setTimeout(() => window.location.href = "/login", 1300);
  }

  return (
    <div
      className="register-bg"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background/registerpage.jpeg'})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >
      <Header loginPage />
      <div className="register-card-wrapper">
        <div className="register-card">
          <h2 className="register-title">Register</h2>
          <form onSubmit={sendRegInfo} style={{ width: "100%" }}>
            <input
              className="register-input"
              name="name"
              placeholder="Full Name"
              value={fields.name}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.name && !fields.name && <div className="register-error">Full Name is required.</div>}
            <input
              className="register-input"
              name="email"
              type="email"
              placeholder="Email"
              value={fields.email}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.email && !fields.email && <div className="register-error">Email is required.</div>}
            <input
              className="register-input"
              name="phnNumber"
              placeholder="Phone number"
              value={fields.phnNumber}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.phnNumber && !fields.phnNumber && <div className="register-error">Phone number is required.</div>}
            <input
              className="register-input"
              name="district"
              placeholder="District"
              value={fields.district}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.district && !fields.district && <div className="register-error">District is required.</div>}
            <input
              className="register-input"
              name="address"
              placeholder="Address"
              value={fields.address}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.address && !fields.address && <div className="register-error">Address is required.</div>}
            <input
              className="register-input"
              name="pass"
              type="password"
              placeholder="Password"
              value={fields.pass}
              onChange={updateField}
              onBlur={handleBlur}
            />
            {touched.pass && !fields.pass && <div className="register-error">Password is required.</div>}
            {errorMsg && <div className="register-error">{errorMsg}</div>}
            {successMsg && <div className="register-success">{successMsg}</div>}
            <button type="submit" className="register-gradient-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}
