const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot's API token received from BotFather
const token = '7226710142:AAHK6r87EnphVcS3daiHI8aaQKA3FDWvVgs';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Log to console when the bot is running
console.log('Bot is running...');

// Listen for any incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Respond to the user
    bot.sendMessage(chatId, 'Welcome to Derik\'s Hub! How can I assist you today?');
});

// Respond to the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! I am your Derik Bot. How can I help you today?');
});

// Respond to the /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
Here are some commands you can use:
- /start - Welcome message
- /help - List of commands
- /about - Learn more about Derik's Hub
- /contact - Get contact information
`;

    bot.sendMessage(chatId, helpMessage);
});

// Add more commands or functionalities as needed

// Example command for /about
bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    const aboutMessage = `
Derik's Hub is a vibrant community connecting individuals interested in technology, development, and emerging opportunities. 
Here, you can engage in diverse discussions, enhance your skills, network with professionals, and receive community support.
`;

    bot.sendMessage(chatId, aboutMessage);
});

// Example command for /contact
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    const contactMessage = `
You can reach us at:
- Email: contact@derikshub.com
- Telegram: @DeriksHub
`;

    bot.sendMessage(chatId, contactMessage);
});
