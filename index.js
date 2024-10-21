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

// Call the function when the bot starts or based on some trigger
// postTopTokensToGroup(); // Fetch and post the top tokens

// // Optional: Schedule to run every hour (3600000 milliseconds)
setInterval(() => {
    postTopLaunchedTokensToGroup();
}, 300000); // Update to run every hour
