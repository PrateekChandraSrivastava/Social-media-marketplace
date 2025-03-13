import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL.replace('/api', '')}/api/blog`)
            .then(response => response.json())
            .then(data => setPosts(data.blogPosts))
            .catch(err => console.error("Error fetching blog posts:", err));
    }, []);

    return (
        <HelmetProvider>
            <div>
                <Helmet>
                    <title>Blog - Social Media Marketplace</title>
                    <meta name="description" content="Read the latest news and updates from Social Media Marketplace." />
                    <meta name="keywords" content="social media, marketplace, accounts, services, SEO" />
                </Helmet>
                <h1>Blog</h1>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                            <h2>{post.title}</h2>
                            <p><em>By {post.author} on {new Date(post.published_at).toLocaleDateString()}</em></p>
                            <p>{post.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No blog posts found.</p>
                )}
            </div>
        </HelmetProvider>
    );
};

export default Blog;
