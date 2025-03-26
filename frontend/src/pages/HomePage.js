// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // We'll define some custom CSS here

const HomePage = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Buy Tiktok Accounts &amp; YouTube Channels</h1>
                    <p className="hero-subtitle">
                        Leading marketplace to buy and sell established Tiktok accounts, YouTube channels, and theme pages!
                    </p>
                    <Link to="/listings" className="hero-cta">Browse Listings</Link>
                </div>
            </section>

            {/* Listings/Services Section */}
            <section className="listings-section">
                <h2>Featured Pages and Channels</h2>
                <div className="listings-grid">
                    {/* Example Card #1 */}
                    <div className="listing-card">
                        <img src="https://via.placeholder.com/300x200" alt="Listing" />
                        <h3>@samlon785</h3>
                        <p>I am Selling USA Affiliate Shop Accounts. Ready to go monetized channels!</p>
                        <Link to="/listings/1" className="card-button">View Details</Link>
                    </div>
                    {/* Example Card #2 */}
                    <div className="listing-card">
                        <img src="https://via.placeholder.com/300x200" alt="Listing" />
                        <h3>@fashionSHOP</h3>
                        <p>MONETIZED for sale. Health &amp; business. Great for e-commerce!</p>
                        <Link to="/listings/2" className="card-button">View Details</Link>
                    </div>
                    {/* Example Card #3 */}
                    <div className="listing-card">
                        <img src="https://via.placeholder.com/300x200" alt="Listing" />
                        <h3>@smith_SHOP</h3>
                        <p>USA Base Ads. Perfect for brand deals. Active audience!</p>
                        <Link to="/listings/3" className="card-button">View Details</Link>
                    </div>
                    {/* Add more cards as needed */}
                </div>
            </section>

            {/* Additional Section (optional) */}
            <section className="info-section">
                <h2>How It Works</h2>
                <p>Explain the process of buying or selling social media accounts.</p>
            </section>
        </div>
    );
};

export default HomePage;
