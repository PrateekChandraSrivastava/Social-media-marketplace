// frontend/src/pages/ListingDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/ListingDetails.css';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // For modal

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

    // Use product_images if available; do not fallback to channel profile picture here.
    const images = (listing.product_images && listing.product_images.length > 0)
        ? listing.product_images
        : [];

    const channelDetails = listing.channelDetails || {};
    const channelTitle = channelDetails.title || listing.title;
    const subscribers = channelDetails.subscribers || 'N/A';

    // Use short_description as the heading
    const subjectHeading = listing.short_description || 'No Subject Provided';

    const handleImageClick = (img) => {
        setSelectedImage(img);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="listing-details-container">
            <Helmet>
                <title>{subjectHeading} - Listing Details</title>
            </Helmet>

            <h1 className="listing-heading">{subjectHeading}</h1>

            <div className="details-header">
                <img
                    src={channelDetails.profilePicture || 'https://via.placeholder.com/150'}
                    alt={channelTitle}
                    className="channel-img-large"
                />
                <div className="channel-details">
                    <h2>{channelTitle}</h2>
                    {channelDetails && <p>{subscribers} subscribers</p>}
                </div>
            </div>

            <div className="full-description">
                <h3>Full Description</h3>
                <p>{listing.selling_description || listing.description || 'No description provided.'}</p>
            </div>
            <div className="additional-details">
                <p><strong>Price:</strong> ${listing.price}</p>
                <p><strong>Monetisation Status:</strong> {listing.monetization || 'N/A'}</p>
                <p><strong>Monthly Revenue:</strong> {listing.revenue ? `$${listing.revenue}` : 'N/A'}</p>
                <p><strong>Revenue Sources:</strong> {listing.revenue_sources || 'N/A'}</p>
                <p><strong>Category:</strong> {listing.category_detail || 'N/A'}</p>
                <p><strong>Selling Reason:</strong> {listing.reason || 'N/A'}</p>
            </div>

            {/* Product Images Gallery at the Bottom */}
            {images.length > 0 ? (
                <div className="product-images-container">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="product-image"
                            onClick={() => handleImageClick(img)}
                        />
                    ))}
                </div>
            ) : (
                <p className="no-images-message">No images found for this listing.</p>
            )}

            {/* Modal to display full image */}
            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            &times;
                        </button>
                        <img src={selectedImage} alt="Full View" className="modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingDetails;
