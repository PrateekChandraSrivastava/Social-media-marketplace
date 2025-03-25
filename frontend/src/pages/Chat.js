// frontend/src/pages/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Helmet } from 'react-helmet-async';

// Set the backend URL (ensure this matches your environment variable)
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Listen for incoming chat messages
        newSocket.on('chatMessage', (msg) => {
            setChatMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Clean up on unmount
        return () => newSocket.close();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket && message.trim() !== '') {
            // Emit the message to the server
            socket.emit('chatMessage', message);
            setMessage(''); // clear input field
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Helmet>
                <title>Chat - Social Media Marketplace</title>
            </Helmet>
            <h1>Real-Time Chat</h1>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {chatMessages.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>
            <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: '80%', padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>Send</button>
            </form>
        </div>
    );
};

export default Chat;
