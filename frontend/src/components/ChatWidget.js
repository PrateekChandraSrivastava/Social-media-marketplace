// frontend/src/components/ChatWidget.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import "../styles/ChatWidget.css"; // Import the CSS styles

// Set your backend URL for Socket.io connection
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
// Use the same secret key as your backend for encryption/decryption
const SECRET_KEY = "your_chat_encryption_secret"; // Ensure this matches your backend configuration

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on("chatMessage", (msg) => {
            // Decrypt message
            const decryptedMsg = CryptoJS.AES.decrypt(msg.message, SECRET_KEY).toString(CryptoJS.enc.Utf8);
            setChatMessages((prevMessages) => [...prevMessages, { ...msg, message: decryptedMsg }]);
        });

        return () => newSocket.close();
    }, []);

    // Set username: if logged in, use stored username; if not, ask for temporary name
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username) {
            setUsername(storedUser.username);
        } else {
            // Prompt for temporary name if not logged in
            const tempName = prompt("Enter your name to chat:");
            setUsername(tempName || "Guest");
        }
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket && message.trim() !== "") {
            // Encrypt the message before sending
            const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
            // Emit the message along with the sender's username
            socket.emit("chatMessage", { sender: username, message: encryptedMessage });
            setMessage("");
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button className="chat-button" onClick={() => setIsOpen(true)}>
                💬
            </button>

            {/* Chat Sidebar Overlay */}
            <div className={`chat-sidebar ${isOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <h3>Live Chat</h3>
                    <button onClick={() => setIsOpen(false)}>✖</button>
                </div>
                <div className="chat-messages">
                    {chatMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`message ${msg.sender === username ? "sent" : "received"}`}
                        >
                            <span className="sender">{msg.sender}</span>: {msg.message}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="chat-form">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </>
    );
};

export default ChatWidget;
