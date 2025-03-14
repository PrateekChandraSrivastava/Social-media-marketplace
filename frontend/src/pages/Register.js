// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'buyer' // default role; user can choose "seller" if desired
    });
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                // Registration successful: Save token and user info in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Redirect to a protected page (e.g., profile)
                navigate('/profile');
            } else {
                setErrorMsg(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMsg('An error occurred during registration');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Register - Social Media Marketplace</title>
                <meta name="description" content="Register on Social Media Marketplace." />
            </Helmet>
            <h1>Register</h1>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label><br />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Role:</label><br />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;
