// frontend/src/components/ListingCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ListingCard.css';

const ListingCard = ({ listing }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/listings/${listing.id}`);
    };

    const handleBuyNow = (e) => {
        e.stopPropagation(); // Prevent card click
        // Navigate to chat page (adjust route as needed)
        navigate(`/chat/${listing.id}`);
    };

    // Use product_image if provided; fallback to channelDetails.profilePicture; or a default placeholder.
    const profilePicture = listing.product_image ||
        (listing.channelDetails && listing.channelDetails.profilePicture) ||
        'https://via.placeholder.com/100';

    // For title, use channel details if available, otherwise listing title
    const channelTitle = (listing.channelDetails && listing.channelDetails.title) || listing.title;
    const subscribers = (listing.channelDetails && listing.channelDetails.subscribers) || 'N/A';

    // Use the short selling description; backend returns it as short_description.
    const shortDesc = listing.short_description || (listing.description ? listing.description.substring(0, 100) + '...' : 'No description provided');

    return (
        <div className="listing-card" onClick={handleCardClick}>
            <div className="card-header">
                <img src={profilePicture} alt={channelTitle} className="channel-img" />
                <div className="channel-info">
                    <h3 className="channel-title">{channelTitle}</h3>
                    <p className="channel-subscribers">{subscribers} subscribers</p>
                </div>
            </div>
            <div className="card-body">
                <p className="listing-description">{shortDesc}</p>
                <p className="listing-price">Price: ${listing.price}</p>
                <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
            </div>
        </div>
    );
};

export default ListingCard;
