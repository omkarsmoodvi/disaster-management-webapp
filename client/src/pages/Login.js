import "../assets/CSS/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeRole } from "../store/roleSlice";
import { useDispatch } from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function sendLogInfo(e) {
        e.preventDefault();
        setErrorMsg("");
        if (!email || !password) {
            setErrorMsg("Please enter both email and password.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email: email, Password: password })
            });
            const data = await res.json();
            if (res.status === 200 && data && data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                const role = {
                    role: data.user.UserType,
                    loggedIn: true,
                    isAdmin: data.user.UserType.includes("admin")
                };
                dispatch(changeRole(role));
                navigate("/");
            } else {
                setErrorMsg(data.error || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            setErrorMsg("Error connecting to server.");
        }
    }

    return (
        <div className="login">
            <div className="loginTitle">Login</div>
            <form onSubmit={sendLogInfo}>
                <div>
                    <span>Email</span>
                    <input
                        id="loginEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <span>Password</span>
                    <input
                        id="loginPass"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {errorMsg && <div className="loginError" style={{color: 'red', marginTop: '1rem'}}>{errorMsg}</div>}
                <div className="loginButton">
                    <button type="submit">Log In</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
