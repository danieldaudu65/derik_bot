const TelegramBot = require('node-telegram-bot-api');
const express = require('express'); // Import Express
require('dotenv').config();

// Import the function from tokenFetch.js
const { postTopLaunchedTokensToGroup } = require('./routes/tokenfetch');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Import the moderation and text functionalities
require('./routes/moderation')(bot);
require('./routes/text')(bot);

// Log when the bot is running
console.log('Bot is running...');

// Set up Express 
const app = express();
const PORT = process.env.PORT || 3000; // Set the port from an environment variable or default to 3000

// Create a simple route for testing
app.get('/', (req, res) => {
    res.send('Telegram Bot is running!');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Call the function when the bot starts
postTopLaunchedTokensToGroup();

// Schedule to run every 2 minutes (or every hour if you prefer)
setInterval(() => {
    postTopLaunchedTokensToGroup()
        .catch((error) => {
            console.error('Error fetching tokens:', error);
        });
}, 60000 * 2); // Change to 3600000 for every hour
