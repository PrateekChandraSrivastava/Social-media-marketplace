// frontend/src/pages/PaymentHistory.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const PaymentHistory = () => {
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/payments/history`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setHistory(data.history || []);
                } else {
                    setMessage(data.message || 'Error fetching payment history');
                }
            } catch (error) {
                console.error('Payment history error:', error);
                setMessage('An error occurred while fetching payment history');
            }
        };

        fetchPaymentHistory();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Payment History - Social Media Marketplace</title>
                <meta name="description" content="View your payment history on Social Media Marketplace." />
            </Helmet>
            <h1>Payment History</h1>
            {message && <p>{message}</p>}
            {history.length > 0 ? (
                <ul>
                    {history.map((payment) => (
                        <li key={payment.id}>
                            Payment ID: {payment.id} | Amount: ${payment.amount} | Escrow Fee: ${payment.escrow_fee} | Status: {payment.status} | Date: {new Date(payment.createdAt).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No payment history found.</p>
            )}
        </div>
    );
};

export default PaymentHistory;
