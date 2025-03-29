// frontend/src/pages/SellListing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import imageCompression from 'browser-image-compression'; // Ensure you install this package: npm install browser-image-compression
import '../styles/SellListing.css';

const SellListing = () => {
    const navigate = useNavigate();
    const [sellType, setSellType] = useState('socialMedia'); // "socialMedia" or "otherService"
    const [platform, setPlatform] = useState('youtube'); // if socialMedia, choose platform
    const [channelURL, setChannelURL] = useState('');
    const [channelDetails, setChannelDetails] = useState(null);
    const [verified, setVerified] = useState(false);

    // Use underscore keys to match backend model; note product_images is now an array.
    const [otherDetails, setOtherDetails] = useState({
        title: '',                  // Title if seller wants to override auto-fill
        short_description: '',      // Short selling description for card preview
        selling_description: '',    // Full selling description for details page
        price: '',
        monetization: '',
        revenue: '',
        category: '',
        reason: '',
        revenue_sources: '',
        product_images: []          // Array to hold multiple product images (base64 strings)
    });
    const [message, setMessage] = useState('');

    // Ensure URL has a protocol
    const ensureProtocol = (url) => {
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    };

    // Handle file changes and compress each image, then store as base64 strings
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const options = {
            maxSizeMB: 2,            // Maximum size in MB
            maxWidthOrHeight: 1200,   // Resize dimensions
            useWebWorker: true
        };
        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const compressedFile = await imageCompression(file, options);
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result); // base64 string
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(compressedFile);
                    });
                })
            );
            setOtherDetails({ ...otherDetails, product_images: compressedFiles });
        } catch (error) {
            console.error("Error compressing images:", error);
            setMessage("Error processing images.");
        }
    };

    // Fetch YouTube channel details by calling backend endpoint
    const fetchChannelDetails = async () => {
        setMessage('');
        const urlWithProtocol = ensureProtocol(channelURL);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/fetch-youtube-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ channelURL: urlWithProtocol })
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
    // Within SellListing.js, inside handleSubmit:
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sellType === 'socialMedia' && platform === 'youtube' && !verified) {
            setMessage('Please complete channel verification before submitting.');
            return;
        }
        const token = localStorage.getItem('token');

        // Use auto-generated title if not provided
        let finalTitle = otherDetails.title;
        if (platform === 'youtube' && channelDetails && !finalTitle) {
            finalTitle = channelDetails.title;
        }
        if (!finalTitle) {
            setMessage('Title is required.');
            return;
        }

        // Convert numeric fields: if empty, set to null (or a default value)
        const parsedPrice = otherDetails.price ? parseFloat(otherDetails.price) : null;
        const parsedRevenue = otherDetails.revenue ? parseFloat(otherDetails.revenue) : null;

        const listingData = {
            seller_id: JSON.parse(localStorage.getItem('user')).id,
            category: sellType,
            platform,
            channelURL: ensureProtocol(channelURL), // ensure URL has protocol
            channelDetails,
            verified,
            title: finalTitle,
            short_description: otherDetails.short_description,
            selling_description: otherDetails.selling_description,
            price: parsedPrice,               // Use numeric value
            monetization: otherDetails.monetization,
            revenue: parsedRevenue,           // Use numeric value
            category_detail: otherDetails.category,
            reason: otherDetails.reason,
            revenue_sources: otherDetails.revenue_sources,
            product_images: otherDetails.product_images, // array of images
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
                            value={otherDetails.description || ''}
                            onChange={(e) =>
                                setOtherDetails({ ...otherDetails, description: e.target.value })
                            }
                            required
                        ></textarea>
                    </div>
                )}
                {/* Field for short selling description */}
                <div>
                    <label>Short Selling Description:</label>
                    <input
                        type="text"
                        value={otherDetails.short_description}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, short_description: e.target.value })
                        }
                        required
                    />
                </div>
                {/* Field for full selling description */}
                <div>
                    <label>Full Selling Description:</label>
                    <textarea
                        value={otherDetails.selling_description}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, selling_description: e.target.value })
                        }
                        required
                    ></textarea>
                </div>
                {/* New Price field */}
                <div>
                    <label>Price ($):</label>
                    <input
                        type="number"
                        value={otherDetails.price}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, price: e.target.value })
                        }
                        required
                    />
                </div>
                {/* Additional fields */}
                <div>
                    <label>Revenue Sources:</label>
                    <input
                        type="text"
                        value={otherDetails.revenue_sources}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, revenue_sources: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label>Channel/Service Category:</label>
                    <select
                        value={otherDetails.category}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, category: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="gaming">Gaming</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="education">Education</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label>Monetisation Status:</label>
                    <select
                        value={otherDetails.monetization}
                        onChange={(e) =>
                            setOtherDetails({ ...otherDetails, monetization: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Monetisation Status</option>
                        <option value="enabled">Enabled</option>
                        <option value="not enabled">Not Enabled</option>
                    </select>
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
                    <label>Selling Reason:</label>
                    <textarea
                        value={otherDetails.reason}
                        onChange={(e) => setOtherDetails({ ...otherDetails, reason: e.target.value })}
                    ></textarea>
                </div>
                <div>
                    <label>Product Images:</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" required />
                </div>
                <button type="submit">Submit Listing</button>
            </form>
        </div>
    );
};

export default SellListing;
