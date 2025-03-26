// frontend/src/pages/Register.js
import React, { useState } from 'react';

import { Helmet } from 'react-helmet-async';

const Register = () => {
    // State for registration form
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'buyer',
    });

    // State for verification code and registration flow
    const [errorMsg, setErrorMsg] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyMsg, setVerifyMsg] = useState('');
    const [resendMsg, setResendMsg] = useState('');
    // Handle input changes for registration form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                // Registration succeeded; now show verification code input section
                setIsRegistered(true);
            } else {
                setErrorMsg(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMsg('An error occurred during registration');
        }
    };

    // Handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setVerifyMsg('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, code: verificationCode }),
            });
            const data = await response.json();
            if (response.ok) {
                setVerifyMsg('Email verified successfully! You can now log in.');
            } else {
                setVerifyMsg(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerifyMsg('An error occurred during verification');
        }
    };

    const handleResendCode = async () => {
        setResendMsg('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (response.ok) {
                setResendMsg(data.message);
            } else {
                setResendMsg(data.message || 'Resend failed');
            }
        } catch (error) {
            console.error('Resend error:', error);
            setResendMsg('An error occurred while resending code');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Register - Social Media Marketplace</title>
                <meta name="description" content="Register on Social Media Marketplace." />
            </Helmet>
            <h1>Register</h1>

            {!isRegistered ? (
                <form onSubmit={handleRegister}>
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
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
            ) : (
                // After successful registration, show verification code input section.
                <div>
                    <p style={{ color: 'green' }}>Verification code sent to your email. Please enter the code below to verify your account.</p>
                    <form onSubmit={handleVerifyCode}>
                        <div>
                            <label>Verification Code:</label><br />
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" style={{ marginTop: '10px' }}>Verify Code</button>
                    </form>
                    {verifyMsg && <p>{verifyMsg}</p>}
                    <button onClick={handleResendCode} style={{ marginTop: '10px' }}>
                        Resend Verification Code
                    </button>
                    {resendMsg && <p>{resendMsg}</p>}
                </div>
            )}
        </div>
    );
};

export default Register;
