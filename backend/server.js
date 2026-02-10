const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Frontend ko connect hone ki permission deta hai
app.use(express.json()); // JSON data padhne ke liye

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- API ROUTE ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Gemini Model Select
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate Content
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Send back to Frontend
        res.json({ reply: text });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Something went wrong with AI" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});