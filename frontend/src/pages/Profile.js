// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ListingCard from '../components/ListingCard';
import '../styles/Profile.css'; // For grid layout styling

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [message, setMessage] = useState('');
    const [sellerListings, setSellerListings] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                    setFormData({ username: data.username, email: data.email });
                    if (data.role === 'seller' || data.role === 'admin') {
                        fetchSellerListings(token);
                    }
                } else {
                    console.error('Error fetching profile:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchSellerListings = async (token) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/my-listings`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setSellerListings(data.listings || []);
                } else {
                    console.error('Error fetching listings:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data.user);
                setMessage('Profile updated successfully!');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('An error occurred');
        }
    };

    return (
        <div>
            <Helmet>
                <title>Profile - Social Media Marketplace</title>
                <meta name="description" content="View and manage your profile on Social Media Marketplace." />
            </Helmet>
            <h1>Your Profile</h1>
            {profile ? (
                <div>
                    <p><strong>ID:</strong> {profile.id}</p>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                    <p><strong>Verified:</strong> {profile.is_verified ? 'Yes' : 'No'}</p>
                    <p><strong>Joined on:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                    <hr />
                    <h2>Update Profile</h2>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                    {message && <p>{message}</p>}
                    {(profile.role === 'seller' || profile.role === 'admin') && (
                        <>
                            <hr />
                            <h2>Your Listings</h2>
                            <div className="listings-grid">
                                {sellerListings.length > 0 ? (
                                    sellerListings.map(listing => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))
                                ) : (
                                    <p>You have no listings.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
