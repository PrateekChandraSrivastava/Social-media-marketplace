// frontend/src/pages/VerifyEmail.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setMessage('Invalid verification link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/verify-email?token=${token}`);
                const data = await response.json();
                if (response.ok) {
                    setMessage('Email verified successfully! Redirecting to login...');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (error) {
                setMessage('Error verifying email.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Helmet>
                <title>Verify Email - Social Media Marketplace</title>
            </Helmet>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;
