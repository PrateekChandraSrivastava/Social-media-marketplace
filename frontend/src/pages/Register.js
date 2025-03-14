import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("buyer");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, role })
            });
            const data = await response.json();
            if (response.ok) {
                // Optionally, store the token and user details
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/profile");
            } else {
                setErrorMsg(data.message || "Registration failed");
            }
        } catch (error) {
            setErrorMsg("An error occurred during registration");
            console.error("Registration error:", error);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Register - Social Media Marketplace</title>
                <meta name="description" content="Register on Social Media Marketplace." />
            </Helmet>
            <h1>Register</h1>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label><br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Role:</label><br />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
