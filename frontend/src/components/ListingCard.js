// frontend/src/components/ListingCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ListingCard.css';

const ListingCard = ({ listing }) => {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        // Navigate to detailed listing view (you can build a detailed page)
        navigate(`/listings/${listing.id}`);
    };

    // Extract channel details if available
    const channelDetails = listing.channelDetails || {};
    const profilePicture = channelDetails.profilePicture || 'https://via.placeholder.com/100';
    const channelTitle = channelDetails.title || 'Channel Info Unavailable';
    const subscribers = channelDetails.subscribers || 'N/A';

    // Use short selling description from listing if available
    const shortSellingDesc = listing.shortDescription || listing.description || 'No description provided';

    return (
        <div className="listing-card">
            {listing.channelDetails ? (
                <div className="card-header">
                    <img src={profilePicture} alt={channelTitle} className="channel-img" />
                    <div className="channel-info">
                        <h3 className="channel-title">{channelTitle}</h3>
                        <p className="channel-subscribers">{subscribers} subscribers</p>
                    </div>
                </div>
            ) : (
                <div className="card-header">
                    <div className="channel-info">
                        <h3 className="channel-title">No Channel Info</h3>
                    </div>
                </div>
            )}
            <div className="card-body">
                <p className="listing-description">{shortSellingDesc}</p>
                <p className="listing-price">Price: ${listing.price}</p>
                <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
            </div>
        </div>
    );
};

export default ListingCard;
