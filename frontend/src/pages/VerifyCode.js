import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const VerifyCode = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setMessage('An error occurred during verification');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Verify Email Code - Social Media Marketplace</title>
            </Helmet>
            <h1>Verify Your Email</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Verification Code:</label><br />
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Verify</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyCode;
