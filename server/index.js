const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GitHub Data URL
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

// Route to fetch apps from GitHub
app.get('/api/apps', async (req, res) => {
    try {
        const response = await axios.get(GITHUB_JSON_URL);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching from GitHub:", error.message);
        res.status(500).json({ error: "Failed to fetch apps data" });
    }
});

app.get('/', (req, res) => {
    res.send("My Store API is Running! 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
