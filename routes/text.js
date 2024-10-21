// text.js
module.exports = (bot) => {
    // Listen for any incoming messages, excluding commands like /start, /help, etc.
    // bot.on('message', (msg) => {
    //     const chatId = msg.chat.id;
    //     const text = msg.text;

    //     // Skip commands that start with "/"
    //     if (!text.startsWith('/')) {
    //         // Check if the message belongs to a specific topic (message_thread_id is present)
    //         if (msg.message_thread_id) {
    //             bot.sendMessage(chatId, 'Your message in the topic', { message_thread_id: msg.message_thread_id })
    //                 .catch((error) => {
    //                     console.error('Error:', error);
    //                 });
    //         } else {
    //             // General message response outside of topics
    //             bot.sendMessage(chatId, 'Welcome to Derik\'s Hub! How can I assist you today?');
    //         }
    //     }
    // });

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

    // Custom message handling for specific topics in groups
    bot.onText(/\/sendtotopic (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const topicId = msg.message_thread_id; // Use this if the message is part of a topic
        const userMessage = match[1]; // Capture the custom message

        // Check if the message is part of a topic
        if (topicId) {
            bot.sendMessage(chatId, userMessage, { message_thread_id: topicId })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            bot.sendMessage(chatId, "This command only works within topics.");
        }
    });
};
