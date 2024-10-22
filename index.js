const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

// Import the functions from tokenfetch.js and jobfetch.js
const { postTopLaunchedTokensToGroup } = require('./routes/tokenfetch');
const { fetchAndPostJobs } = require('./routes/jobfetch'); // Already includes getTopWeb3Jobs internally

// Telegram bot token
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Include moderation and text routes for the bot
require('./routes/moderation')(bot);
require('./routes/text')(bot);

console.log('Bot is running...');

// Set up Express for a simple server
const app = express();
const PORT = process.env.PORT || 3000;

// Root route to confirm the bot is running
app.get('/', (req, res) => {
    res.send('Telegram Bot is running!');
});
 
// Start the Express server
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});

// Function to fetch and post Web3 jobs to the group
async function postJobsToTelegramGroup() {
    const chatId = process.env.TELEGRAM_GROUP_ID; // Ensure this is set in your .env file
    await fetchAndPostJobs(bot, chatId);
}

// Call the job posting function and set an interval (e.g., every hour)
postJobsToTelegramGroup(); // Initial call
setInterval(postJobsToTelegramGroup, 2 * 60 * 1000); // Repeat every 1 hour

// Function to fetch and post the latest tokens to the group
async function postTokensToTelegramGroup() {
    const chatId = process.env.TELEGRAM_GROUP_ID; // Ensure this is set in your .env file
    await postTopLaunchedTokensToGroup(bot, chatId);
}

// Call the token posting function and set an interval (e.g., every 2 minutes)
postTokensToTelegramGroup(); // Initial call
setInterval(postTokensToTelegramGroup, 2 * 60 * 1000); // Repeat every 2 minutes

