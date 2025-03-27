// frontend/src/pages/SellListing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/SellListing.css';

const SellListing = () => {
    const navigate = useNavigate();
    const [sellType, setSellType] = useState('socialMedia'); // "socialMedia" or "otherService"
    const [platform, setPlatform] = useState('youtube'); // if socialMedia, choose platform
    const [channelURL, setChannelURL] = useState('');
    const [channelDetails, setChannelDetails] = useState(null);
    const [verified, setVerified] = useState(false);
    const [otherDetails, setOtherDetails] = useState({
        shortDescription: '',
        sellingDescription: '',
        price: '',
        monetization: '',
        revenue: '',
        category: '',
        reason: ''
    });
    const [message, setMessage] = useState('');

    // Fetch YouTube channel details by calling backend endpoint
    const fetchChannelDetails = async () => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/fetch-youtube-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ channelURL })
            });
            const data = await response.json();
            if (response.ok) {
                setChannelDetails(data.channelDetails);
                setMessage('Channel details fetched. Copy the verification code and paste it into your channel description. Then click "Verify Channel."');
            } else {
                setMessage(data.message || 'Failed to fetch channel details.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while fetching channel details.');
        }
    };

    // Verify channel by calling backend endpoint (only sends channelId)
    const handleVerifyChannel = async () => {
        if (!channelDetails) {
            setMessage('No channel details found. Please fetch channel details first.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/verify-youtube-channel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    channelId: channelDetails.channelId
                })
            });
            const data = await response.json();
            if (response.ok && data.verified) {
                setVerified(true);
                setMessage('Channel verified successfully!');
            } else {
                setMessage(data.message || 'Channel verification failed.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred during channel verification.');
        }
    };

    // Handle final listing submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sellType === 'socialMedia' && platform === 'youtube' && !verified) {
            setMessage('Please complete channel verification before submitting.');
            return;
        }
        const token = localStorage.getItem('token');

        // If no title is provided by the user and it's a YouTube listing, use the channel title from channelDetails
        let finalTitle = otherDetails.title;
        if (platform === 'youtube' && channelDetails && !finalTitle) {
            finalTitle = channelDetails.title;
        }
        // If still no title, you can block submission
        if (!finalTitle) {
            setMessage('Title is required.');
            return;
        }

        const listingData = {
            seller_id: JSON.parse(localStorage.getItem('user')).id,
            category: sellType,
            platform,
            channelURL,
            channelDetails,
            verified,
            title: finalTitle, // include title here
            shortDescription: otherDetails.shortDescription,
            sellingDescription: otherDetails.sellingDescription,
            price: otherDetails.price,
            monetization: otherDetails.monetization,
            revenue: otherDetails.revenue,
            category_detail: otherDetails.category,
            reason: otherDetails.reason,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(listingData)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Listing submitted successfully!');
                navigate('/profile');
            } else {
                setMessage(data.message || 'Submission failed.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred while submitting the listing.');
        }
    };


    return (
        <div className="sell-listing-container">
            <Helmet>
                <title>Sell Your Listing - Social Media Marketplace</title>
            </Helmet>
            <h1>Sell Your Listing</h1>
            {message && <p className="message">{message}</p>}
            <form className="sell-listing-form" onSubmit={handleSubmit}>
                <div>
                    <label>What do you want to sell?</label>
                    <select value={sellType} onChange={(e) => setSellType(e.target.value)}>
                        <option value="socialMedia">Social Media Accounts</option>
                        <option value="otherService">Other Services</option>
                    </select>
                </div>
                {sellType === 'socialMedia' && (
                    <>
                        <div>
                            <label>Select Platform:</label>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                                <option value="youtube">YouTube</option>
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                            </select>
                        </div>
                        {platform === 'youtube' && (
                            <>
                                <div>
                                    <label>YouTube Channel URL:</label>
                                    <input
                                        type="url"
                                        value={channelURL}
                                        onChange={(e) => setChannelURL(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={fetchChannelDetails}>
                                        Fetch Channel Details
                                    </button>
                                </div>
                                {channelDetails && (
                                    <div className="channel-preview">
                                        <img src={channelDetails.profilePicture} alt={channelDetails.title} />
                                        <div>
                                            <p><strong>Channel Name:</strong> {channelDetails.title}</p>
                                            <p><strong>Subscribers:</strong> {channelDetails.subscribers}</p>
                                            <p><strong>Verification Code:</strong> {channelDetails.verificationCode}</p>
                                            <p>Please copy this code into your channel description.</p>
                                        </div>
                                    </div>
                                )}
                                <div className="verification-section">
                                    <button type="button" onClick={handleVerifyChannel} disabled={!channelDetails}>
                                        Verify Channel
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
                {sellType === 'otherService' && (
                    <div>
                        <label>Description of Service:</label>
                        <textarea
                            value={otherDetails.description}
                            onChange={(e) =>
                                setOtherDetails({ ...otherDetails, description: e.target.value })
                            }
                            required
                        ></textarea>
                    </div>
                )}
                {/* New field for short selling description (subject) */}
                <div>
                    <label>Short Selling Description:</label>
                    <input
                        type="text"
                        value={otherDetails.shortDescription}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, shortDescription: e.target.value })
                        }
                        required
                    />
                </div>
                {/* New field for full selling description */}
                <div>
                    <label>Full Selling Description:</label>
                    <textarea
                        value={otherDetails.sellingDescription}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, sellingDescription: e.target.value })
                        }
                        required
                    ></textarea>
                </div>
                {/* Common fields */}
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={otherDetails.price}
                        onChange={(e) => setOtherDetails({ ...otherDetails, price: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Monetisation Status:</label>
                    <input
                        type="text"
                        value={otherDetails.monetization}
                        onChange={(e) => setOtherDetails({ ...otherDetails, monetization: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Monthly Revenue:</label>
                    <input
                        type="number"
                        value={otherDetails.revenue}
                        onChange={(e) => setOtherDetails({ ...otherDetails, revenue: e.target.value })}
                    />
                </div>
                <div>
                    <label>Channel/Service Category:</label>
                    <input
                        type="text"
                        value={otherDetails.category}
                        onChange={(e) => setOtherDetails({ ...otherDetails, category: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Selling Reason:</label>
                    <textarea
                        value={otherDetails.reason}
                        onChange={(e) => setOtherDetails({ ...otherDetails, reason: e.target.value })}
                    ></textarea>
                </div>
                <button type="submit">Submit Listing</button>
            </form>
        </div>
    );
};

export default SellListing;
