// moderation.js
module.exports = (bot) => {
    const bannedWords = ['badword1', 'badword2']; // Add more banned words here
    const userWarnings = {};
    const userMessageTimes = {};

    // Welcome new users
    bot.on('new_chat_members', (msg) => {
        const chatId = msg.chat.id;
        msg.new_chat_members.forEach((newMember) => {
            bot.sendMessage(chatId, `Welcome ${newMember.first_name} to Derik's Hub! Feel free to ask anything.`);
        });
    });
 
    // Check if the user is an admin
    const isAdmin = (chatId, userId) => {
        return bot.getChatAdministrators(chatId).then((admins) => {
            return admins.some(admin => admin.user.id === userId);
        });
    };

    // Handle messages and moderation
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text.toLowerCase();
        const userId = msg.from.id;
        const now = Date.now();

        // Check for banned words
        bannedWords.forEach((word) => {
            if (text.includes(word)) {
                bot.deleteMessage(chatId, msg.message_id).catch(err => console.error(err));
                bot.sendMessage(chatId, `Message deleted: Banned word detected.`);
            }
        });

        // Message cooldown
        if (userMessageTimes[userId]) {
            const timeSinceLastMessage = now - userMessageTimes[userId];
            if (timeSinceLastMessage < 5000) { // 5 seconds cooldown
                bot.deleteMessage(chatId, msg.message_id).catch(err => console.error(err));
                return;
            }
        }

        userMessageTimes[userId] = now;
    });

    // Kick a user using /kick command
    bot.onText(/\/kick (@\w+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userToKick = match[1];
        const userId = msg.from.id;

        isAdmin(chatId, userId).then((isAdmin) => {
            if (isAdmin) {
                bot.kickChatMember(chatId, userToKick).then(() => {
                    bot.sendMessage(chatId, `${userToKick} has been kicked.`);
                }).catch(err => console.error(err));
            } else {
                bot.sendMessage(chatId, "You are not an admin. You cannot use this command.");
            }
        });
    });

    // Mute a user for a given duration in seconds
    bot.onText(/\/mute (@\w+) (\d+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userToMute = match[1];
        const muteDuration = parseInt(match[2], 10); // Duration in seconds
        const userId = msg.from.id;

        isAdmin(chatId, userId).then((isAdmin) => {
            if (isAdmin) {
                const untilDate = Math.floor(Date.now() / 1000) + muteDuration; // Calculate untilDate in epoch time

                bot.restrictChatMember(chatId, userToMute, { until_date: untilDate })
                    .then(() => bot.sendMessage(chatId, `${userToMute} has been muted for ${muteDuration} seconds.`))
                    .catch((error) => console.error(error));
            } else { 
                bot.sendMessage(chatId, "You are not an admin. You cannot use this command.");
            }
        });
    });

    // Warn a user with /warn command
    bot.onText(/\/warn (@\w+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userToWarn = match[1];
        const userId = msg.from.id;

        isAdmin(chatId, userId).then((isAdmin) => {
            if (isAdmin) {
                if (!userWarnings[userToWarn]) {
                    userWarnings[userToWarn] = 1;
                } else {
                    userWarnings[userToWarn]++;
                }

                bot.sendMessage(chatId, `${userToWarn} has been warned. Total warnings: ${userWarnings[userToWarn]}`);

                if (userWarnings[userToWarn] >= 3) {
                    bot.kickChatMember(chatId, userToWarn)
                        .then(() => bot.sendMessage(chatId, `${userToWarn} has been kicked due to multiple warnings.`))
                        .catch(err => console.error(err));
                }
            } else {
                bot.sendMessage(chatId, "You are not an admin. You cannot use this command.");
            }
        });
    });
};
