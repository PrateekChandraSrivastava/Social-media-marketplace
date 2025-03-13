// frontend/src/components/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the backend Socket.io server
const socket = io('http://localhost:5000');

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    // Listen for incoming messages
    useEffect(() => {
        socket.on('chatMessage', (msg) => {
            setChat((prevChat) => [...prevChat, msg]);
        });
        // Cleanup on unmount
        return () => socket.off('chatMessage');
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Emit message to the server
            socket.emit('chatMessage', message);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Real-Time Chat</h2>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {chat.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
