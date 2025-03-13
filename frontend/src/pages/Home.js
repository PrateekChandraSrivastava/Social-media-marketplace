import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home - Social Media Marketplace</title>
                <meta name="description" content="Buy and sell social media accounts, services, and more." />
                <meta name="keywords" content="social media, marketplace, accounts, services, SEO" />
            </Helmet>
            <h1>Welcome to Social Media Marketplace</h1>
            {/* Your homepage content */}
        </div>
    );
};

export default Home;
