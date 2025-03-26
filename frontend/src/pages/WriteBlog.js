// frontend/src/pages/WriteBlog.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WriteBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // if editing an existing blog post, id will be present
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (id) {
                // If editing, send a PUT request
                response = await fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, content })
                });
            } else {
                // If creating, send a POST request
                response = await fetch(`${process.env.REACT_APP_API_URL}/blog`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, content, author: "Admin" }) // or use logged-in admin name
                });
            }

            const data = await response.json();
            if (response.ok) {
                setMessage("Blog post saved successfully!");
                setTimeout(() => navigate("/admin"), 2000);
            } else {
                setMessage(data.message || "Error saving blog post");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred while saving the blog post");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>{id ? "Edit Blog Post" : "Write Blog Post"} - Social Media Marketplace</title>
            </Helmet>
            <h1>{id ? "Edit Blog Post" : "Write Blog Post"}</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label><br />
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Content:</label><br />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="10" cols="50"></textarea>
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>{id ? "Update" : "Post"}</button>
            </form>
        </div>
    );
};

export default WriteBlog;
