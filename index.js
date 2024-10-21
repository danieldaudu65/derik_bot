const TelegramBot = require('node-telegram-bot-api');
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

// Call the function when the bot starts or based on some trigger
// postTopTokensToGroup(); // Fetch and post the top tokens

// // Optional: Schedule to run every hour (3600000 milliseconds)
setInterval(() => {
    postTopLaunchedTokensToGroup();
}, 1800000); // Update to run every hour
