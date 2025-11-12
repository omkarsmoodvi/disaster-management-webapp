import "../assets/CSS/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phnNumber, setPhnNumber] = useState("");
    const [thana, setThana] = useState("");
    const [district, setDistrict] = useState("");
    const [pass, setPass] = useState("");
    const [address, setAddress] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function sendRegInfo(e) {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (!name || !email || !phnNumber || !thana || !district || !pass || !address) {
            setErrorMsg("All fields are required.");
            return;
        }
        const regInfo = {
            Name: name,
            Email: email,
            Phone: phnNumber,
            Address: `${address}, ${thana}, ${district}`,
            Password: pass,
            UserType: ["affected"],
            Available: true,
            Community: [],
            CreationTime: new Date().toISOString()
        };
        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(regInfo)
            });
            const data = await response.json();
            if (response.status === 201) {
                setSuccessMsg("Registration successful! Redirecting to login...");
                setTimeout(() => { navigate("/auth/login"); }, 1200);
            } else {
                setErrorMsg(data.error || "Registration failed.");
            }
        } catch (err) {
            setErrorMsg("Error connecting to server.");
        }
    }

    return (
        <div className="RegForm">
            <div className="RegTitle">Fill Up The Form</div>
            <form onSubmit={sendRegInfo}>
                <div className="RegName">
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name" value={name}
                        onChange={e => setName(e.target.value)} />
                </div>
                <div className="RegEmail">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="RegPhoneNumber">
                    <label>Phone number</label>
                    <input type="text" placeholder="Enter your phone number" value={phnNumber}
                        onChange={e => setPhnNumber(e.target.value)} />
                </div>
                <div className="RegThana">
                    <label>Thana</label>
                    <input type="text" placeholder="Enter your thana" value={thana}
                        onChange={e => setThana(e.target.value)} />
                </div>
                <div className="RegDistrict">
                    <label>District</label>
                    <input type="text" placeholder="Enter your district" value={district}
                        onChange={e => setDistrict(e.target.value)} />
                </div>
                <div className="RegAddress">
                    <label>Address</label>
                    <input type="text" placeholder="Enter your address" value={address}
                        onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="RegPassword">
                    <label>Password</label>
                    <input type="password" placeholder="Give a password" value={pass}
                        onChange={e => setPass(e.target.value)} />
                </div>
                {errorMsg && <div className="RegError">{errorMsg}</div>}
                {successMsg && <div className="RegSuccess">{successMsg}</div>}
                <div className="RegButton">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
