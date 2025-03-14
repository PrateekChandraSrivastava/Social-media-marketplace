// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the token in localStorage
                localStorage.setItem("token", data.token);
                // Optionally, store user data as well (or use context)
                localStorage.setItem("user", JSON.stringify(data.user));
                // Redirect to a protected route (e.g., profile or home)
                navigate("/profile");
            } else {
                setErrorMsg(data.message || "Login failed");
            }
        } catch (error) {
            setErrorMsg("An error occurred while logging in");
            console.error("Login error:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Helmet>
                <title>Login - Social Media Marketplace</title>
                <meta name="description" content="Log in to Social Media Marketplace." />
            </Helmet>
            <h1>Login</h1>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
