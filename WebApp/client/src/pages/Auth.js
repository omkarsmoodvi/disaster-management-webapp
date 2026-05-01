import "../assets/CSS/Auth.css";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

export const Auth = () => {
  const [login, setLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={`auth-toggle-btn ${login ? "active" : ""}`}
          onClick={() => setLogin(true)}
        >
          Login
        </button>
        <button
          className={`auth-toggle-btn ${!login ? "active" : ""}`}
          onClick={() => setLogin(false)}
        >
          Register
        </button>
      </div>
      <div className="auth-form-wrapper">
        {login ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
