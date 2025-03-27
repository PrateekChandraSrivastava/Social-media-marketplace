// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import '../styles/HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/listings`);
                const data = await response.json();
                if (response.ok) {
                    setListings(data.listings || []);
                } else {
                    console.error("Error fetching listings:", data.message);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
            }
        };
        fetchListings();
    }, []);

    return (
        <div className="home-container">
            <Helmet>
                <title>Home - Social Media Marketplace</title>
                <meta name="description" content="Browse listings on Social Media Marketplace." />
            </Helmet>
            <div className="cta-buttons">
                {(user && (user.role === "seller" || user.role === "admin")) && (
                    <button onClick={() => navigate('/sell')}>Sell Now</button>
                )}
                <button onClick={() => navigate('/buy')}>Buy Now</button>
            </div>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Buy Theme Pages, Tiktok Accounts &amp; YouTube Channels</h1>
                    <p className="hero-subtitle">
                        Best market to buy and sell theme pages, YouTube channels and Tiktok accounts!
                    </p>
                    <button onClick={() => navigate('/listings')} className="hero-cta">
                        Browse Listings
                    </button>
                </div>
            </section>
            {/* Listings Section */}
            <section className="listings-section">
                <h2>Featured Listings</h2>
                <div className="listings-grid">
                    {listings.length > 0 ? (
                        listings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))
                    ) : (
                        <p>No listings available.</p>
                    )}
                </div>
            </section>
            {/* Additional Info Section */}
            <section className="info-section">
                <h2>How It Works</h2>
                <p>Explain the process of buying or selling social media accounts.</p>
            </section>
        </div>
    );
};

export default HomePage;
