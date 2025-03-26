// Example update in Payment.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [sellerId, setSellerId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePayment = async (e) => {
        e.preventDefault();
        setMessage('');
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const buyerId = user?.id; // use the logged-in user's id

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    buyer_id: buyerId,  // Use buyer's id from authentication
                    seller_id: sellerId,
                    amount: parseFloat(amount)
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Payment initiated successfully!');
                // Optionally, clear the form or redirect
            } else {
                setMessage(data.message || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setMessage('An error occurred while initiating payment');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Initiate Payment - Social Media Marketplace</title>
            </Helmet>
            <h1>Initiate Payment</h1>
            <form onSubmit={handlePayment}>
                <div>
                    <label>Seller ID:</label><br />
                    <input
                        type="text"
                        value={sellerId}
                        onChange={(e) => setSellerId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Amount:</label><br />
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Submit Payment</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Payment;
