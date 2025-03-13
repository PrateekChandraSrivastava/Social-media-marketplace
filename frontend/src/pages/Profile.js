// frontend/src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [message, setMessage] = useState('');
    const [sellerListings, setSellerListings] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Assume the token is stored in localStorage after login
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
                    // If user is a seller, fetch their listings
                    if (data.role === 'seller') {
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
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setSellerListings(data.listings);
                } else {
                    console.error('Error fetching listings:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle profile update
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
                    {profile.role === 'seller' && (
                        <>
                            <hr />
                            <h2>Your Listings</h2>
                            {sellerListings.length > 0 ? (
                                sellerListings.map(listing => (
                                    <div key={listing.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                                        <h3>{listing.title}</h3>
                                        <p><strong>Category:</strong> {listing.category}</p>
                                        <p><strong>Description:</strong> {listing.description}</p>
                                        <p><strong>Price:</strong> ${listing.price}</p>
                                        <p><strong>Verified:</strong> {listing.is_verified ? 'Yes' : 'No'}</p>
                                        <p><strong>Date:</strong> {new Date(listing.created_at).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>You have no listings.</p>
                            )}
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