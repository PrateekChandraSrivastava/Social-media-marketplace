// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import AdminPromotion from '../components/AdminPromotion';
import ListingCard from '../components/ListingCard'; // Import your reusable listing card component
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [listings, setListings] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [chatLogs, setChatLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // default tab
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Check for admin role
    useEffect(() => {
        if (!storedUser || storedUser.role !== 'admin') {
            setErrorMsg('Access denied: Admin only');
        } else {
            // If admin, then fetch data
            fetchAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchAllData = () => {
        // Fetch all users
        fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || []);
            })
            .catch(err => console.error("Error fetching users:", err));

        // Fetch listings
        fetch(`${process.env.REACT_APP_API_URL}/listings`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setListings(data.listings || []))
            .catch(err => console.error("Error fetching listings:", err));

        // Fetch blog posts
        fetch(`${process.env.REACT_APP_API_URL}/blog`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setBlogPosts(data.blogPosts || []))
            .catch(err => console.error("Error fetching blog posts:", err));

        // Fetch payments
        fetch(`${process.env.REACT_APP_API_URL}/payments/history`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setPayments(data.history || []))
            .catch(err => console.error("Error fetching payments:", err));

        // Fetch chat logs
        fetch(`${process.env.REACT_APP_API_URL}/admin/chat-logs`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setChatLogs(data.chatLogs || []))
            .catch(err => console.error("Error fetching chat logs:", err));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div>
                        <h2>Users</h2>
                        <ul>
                            {(users || []).map(user => (
                                <li key={user.id}>
                                    {user.username} - {user.email} - Verified: {user.is_verified ? "Yes" : "No"}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'listings':
                return (
                    <div>
                        <h2>Listings</h2>
                        <div className="listings-grid">
                            {(listings || []).map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    </div>
                );
            case 'blogs':
                return (
                    <div>
                        <h2>Blog Posts</h2>
                        <ul>
                            {(blogPosts || []).map(post => (
                                <li key={post.id}>
                                    {post.title} by {post.author}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'payments':
                return (
                    <div>
                        <h2>Payments</h2>
                        <ul>
                            {(payments || []).map(payment => (
                                <li key={payment.id}>
                                    Payment ID: {payment.id} - Amount: {payment.amount}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'chat':
                return (
                    <div>
                        <h2>Chat Logs</h2>
                        <ul>
                            {(chatLogs || []).map(log => (
                                <li key={log._id}>
                                    {log.sender}: {log.message} - {new Date(log.timestamp).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    if (errorMsg) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>{errorMsg}</h1>
                <p>Please contact your administrator for access.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Admin Dashboard - Social Media Marketplace</title>
                <meta name="description" content="Admin dashboard to manage users, listings, blogs, payments, and chat logs." />
            </Helmet>
            <h1>Admin Dashboard</h1>
            <AdminPromotion token={token} />
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('users')}>Users</button>
                <button onClick={() => setActiveTab('listings')}>Listings</button>
                <button onClick={() => setActiveTab('blogs')}>Blog Posts</button>
                <button onClick={() => setActiveTab('payments')}>Payments</button>
                <button onClick={() => setActiveTab('chat')}>Chat Logs</button>
                <button onClick={() => navigate('/write-blog')}>Write Blog</button>
            </div>
            {renderTabContent()}
        </div>
    );
};

export default AdminDashboard;
