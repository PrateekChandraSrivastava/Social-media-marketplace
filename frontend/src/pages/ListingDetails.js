// frontend/src/pages/ListingDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/ListingDetails.css'; // Optional for styling

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setListing(data.listing);
                } else {
                    setError(data.message || 'Failed to fetch listing details.');
                }
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching listing details.');
            }
        };
        fetchListing();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!listing) return <div>Loading...</div>;

    // Extract channel details if available
    const channelDetails = listing.channelDetails || {};
    const profilePicture = channelDetails.profilePicture || 'https://via.placeholder.com/100';
    const channelTitle = channelDetails.title || 'Channel Info Unavailable';
    const subscribers = channelDetails.subscribers || 'N/A';

    return (
        <div className="listing-details-container">
            <Helmet>
                <title>{listing.title} - Listing Details</title>
            </Helmet>
            <h1>{listing.title}</h1>
            {listing.channelDetails && (
                <div className="channel-info-details">
                    <img src={profilePicture} alt={channelTitle} className="channel-img-large" />
                    <div>
                        <h2>{channelTitle}</h2>
                        <p>{subscribers} subscribers</p>
                    </div>
                </div>
            )}
            <div className="listing-full-description">
                <p><strong>Full Description:</strong></p>
                <p>{listing.sellingDescription || listing.description}</p>
            </div>
            <p><strong>Price:</strong> ${listing.price}</p>
            {/* Add any additional details as required */}
        </div>
    );
};

export default ListingDetails;
