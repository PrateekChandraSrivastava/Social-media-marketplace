// frontend/src/pages/TransactionHistory.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const TransactionHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/payments/history`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setHistory(data.history);
                } else {
                    console.error('Error fetching history:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <Helmet>
                <title>Transaction History - Social Media Marketplace</title>
                <meta name="description" content="View your transaction history on Social Media Marketplace." />
            </Helmet>
            <h1>Transaction History</h1>
            {history.length > 0 ? (
                history.map((transaction) => (
                    <div key={transaction.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                        <p><strong>Transaction ID:</strong> {transaction.id}</p>
                        <p><strong>Buyer ID:</strong> {transaction.buyer_id}</p>
                        <p><strong>Seller ID:</strong> {transaction.seller_id}</p>
                        <p><strong>Amount:</strong> ${transaction.amount}</p>
                        <p><strong>Escrow Fee:</strong> ${transaction.escrow_fee}</p>
                        <p><strong>Status:</strong> {transaction.status}</p>
                        <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No transactions found.</p>
            )}
        </div>
    );
};

export default TransactionHistory;
