require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
// Import your routes as before
const listingRoutes = require('./routes/listingRoutes');
const ChatLog = require('./models/ChatLog'); // Mongoose model for chat logs
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Option 2: Restrict to your frontend domain (for production)
app.use(cors({
    origin: 'https://social-media-marketplace-rust.vercel.app'
}));
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Import and use user routes

app.use('/api/users', userRoutes);

// Import and use payment routes

app.use('/api/payments', paymentRoutes);

app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);

//use blog routes
app.use('/api/blog', blogRoutes);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this for production for security
        methods: ["GET", "POST"],
    },
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for chat messages from a client
    socket.on('chatMessage', async (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);

        // Save the chat message to MongoDB
        try {
            await ChatLog.create({ sender: socket.id, message: msg });
        } catch (error) {
            console.error('Error saving chat message:', error);
        }

        // Broadcast the message to all connected clients
        io.emit('chatMessage', msg);
    });

    // When a client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});



const connectMongoDB = require('./config/mongodb'); // MongoDB connection

// Connect to MongoDB
connectMongoDB();


// Import Sequelize instance (this should have been set up in src/config/sequelize.js)
const sequelize = require('./config/sequelize');

// Sync Sequelize models with the PostgreSQL database, then start the server
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synced and tables recreated.");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

