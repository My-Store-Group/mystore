const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mystore_secret_key_123';

// Security: Allow only your frontend to access this API
app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

// GitHub Data URL
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

// --- ROUTES ---

// Fetch Apps
app.get('/api/apps', async (req, res) => {
    try {
        const response = await axios.get(GITHUB_JSON_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch apps data" });
    }
});

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("My Store API is Running! 🚀");
});

// --- ANTI-SLEEP PING LOGIC ---
const keepAlive = (url) => {
    setInterval(() => {
        axios.get(url)
            .then(() => console.log(`Pinged at ${new Date().toISOString()}`))
            .catch((err) => console.error("Ping error:", err.message));
    }, 600000); // Har 10 minute me khud ko ping karega
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Automated Anti-Sleep: Pings itself every 10 mins if running on Render
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
        setInterval(() => {
            axios.get(RENDER_EXTERNAL_URL)
                .then(() => console.log("Self-ping successful"))
                .catch((err) => console.error("Self-ping failed:", err.message));
        }, 600000);
    }
});
