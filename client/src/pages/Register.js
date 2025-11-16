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
    const [available, setAvailable] = useState(true);
    const [community, setCommunity] = useState("");
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
            Available: available,
            Community: community ? [Number(community)] : [],
            CreationTime: new Date().toISOString()
        };

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(regInfo)
            });

            // Extra defense: handle non-JSON errors (e.g. server offline or HTML 404 returned)
            let data;
            try {
                data = await response.json();
            } catch (err) {
                setErrorMsg("Server error: invalid response. Check backend is running and API path is correct.");
                return;
            }

            if (response.status === 201) {
                setSuccessMsg("Registration successful! Redirecting...");
                setName(""); setEmail(""); setPhnNumber(""); setThana("");
                setDistrict(""); setPass(""); setAddress(""); setCommunity("");
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 1200);
            } else {
                setErrorMsg(data.error || "Registration failed.");
            }
        } catch (err) {
            setErrorMsg("Error connecting to server. Please try again.");
            console.error("Registration error:", err);
        }
    }

    return (
        <div className="RegForm">
            <div className="RegTitle">Register as User</div>
            <form onSubmit={sendRegInfo}>
                <div className="RegName">
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name" value={name}
                        onChange={e => setName(e.target.value)} required />
                </div>
                <div className="RegEmail">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" value={email}
                        onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="RegPhoneNumber">
                    <label>Phone number</label>
                    <input type="text" placeholder="Enter 10-digit phone number" value={phnNumber}
                        onChange={e => setPhnNumber(e.target.value)}
                        pattern="\d{10}"
                        title="Phone number must be exactly 10 digits" required />
                </div>
                <div className="RegThana">
                    <label>Thana</label>
                    <input type="text" placeholder="Enter your thana" value={thana}
                        onChange={e => setThana(e.target.value)} required />
                </div>
                <div className="RegDistrict">
                    <label>District</label>
                    <input type="text" placeholder="Enter your district" value={district}
                        onChange={e => setDistrict(e.target.value)} required />
                </div>
                <div className="RegAddress">
                    <label>Address</label>
                    <input type="text" placeholder="Enter your address" value={address}
                        onChange={e => setAddress(e.target.value)} required />
                </div>
                <div className="RegPassword">
                    <label>Password</label>
                    <input type="password" placeholder="Min 8 chars, 1 letter, 1 number, 1 special char"
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        minLength="8"
                        title="Password must be at least 8 characters with letter, number, and special character"
                        required />
                </div>
                <div className="RegAvailable">
                    <label>Available</label>
                    <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
                </div>
                <div className="RegCommunity">
                    <label>Community ID (optional)</label>
                    <input type="number" placeholder="Leave blank if not applicable" value={community}
                        onChange={e => setCommunity(e.target.value)} />
                </div>
                {errorMsg && <div className="RegError" style={{color: 'red', marginTop: '1rem', fontWeight: 'bold'}}>{errorMsg}</div>}
                {successMsg && <div className="RegSuccess" style={{color: 'green', marginTop: '1rem', fontWeight: 'bold'}}>{successMsg}</div>}
                <div className="RegButton">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
