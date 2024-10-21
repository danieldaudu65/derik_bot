const fetch = require('node-fetch');

// Replace with your actual bot token
const BOT_TOKEN = process.env.BOT_TOKEN; // Get bot token from environment variables
// Your group ID
const GROUP_ID = '-1002428293968';

// Function to get the latest newly launched tokens from DEX Screener
async function getLatestLaunchedTokens() {
    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1'); // Updated endpoint for newly launched tokens
        const data = await response.json();
        // console.log(data); // Log the entire data response

        // Assuming data contains an array of newly launched tokens
        const topTokens = data.slice(0, 3); // Get the top 3 newly launched tokens
        return topTokens;
    } catch (error) {
        console.error('Error fetching launched tokens:', error);
        return [];
    }
}

// Function to get token details by address
async function getTokenDetails(tokenAddress) {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const data = await response.json();

        // Assuming data.pairs contains the token details
        if (data.pairs && data.pairs.length > 0) {
            const baseToken = data.pairs[0].baseToken;
            return {
                name: baseToken.name, // Get the name of the base token
                symbol: baseToken.symbol // Get the symbol of the base token
            };
        }
        return { name: 'Unknown Token', symbol: 'N/A' };
    } catch (error) {
        console.error(`Error fetching token details for ${tokenAddress}:`, error);
        return { name: 'Unknown Token', symbol: 'N/A' };
    }
}

// Function to get the market cap of a token from DEX Screener
async function getMarketCap(tokenAddress) {
    try {
        const response = await fetch(`https://api.dexscreener.com/markets/${tokenAddress}`);
        const data = await response.json();
        return data.marketCap || 'N/A'; // Return market cap or 'N/A' if not available
    } catch (error) {
        console.error(`Error fetching market cap for ${tokenAddress}:`, error);
        return 'N/A'; // Return 'N/A' on error
    }
}

// Function to send a message to your Telegram group
async function sendMessageToGroup(message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: GROUP_ID,
                text: message,
                parse_mode: 'Markdown', // Optional: for formatting
            }),
        });
        const result = await response.json();
        console.log('Message sent:', result);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Main function to fetch newly launched tokens and send them to the group
async function postTopLaunchedTokensToGroup() {
    const tokens = await getLatestLaunchedTokens();

    if (tokens.length > 0) {
        // Header to be displayed once at the top
        const messageHeader = `
🚀 *Top 3 Latest Tokens Launched* 🚀\n\n`;

        // Get token details and format the message
        const messages = await Promise.all(tokens.map(async (token) => {
            const { name: tokenName, symbol: tokenSymbol } = await getTokenDetails(token.tokenAddress); // Fetch token details
            const marketCap = await getMarketCap(token.tokenAddress); // Fetch market cap

            return `*Token Name:* ${tokenName || 'N/A'}\n` + 
                   `*Symbol:* $${tokenSymbol || 'N/A'}\n` + 
                   `*Description:* ${token.description || 'No description available'}\n` + 
                   `*Address:* ${token.tokenAddress}\n` + 
                   `*Launch Amount:* ${token.amount || 0}\n` + 
                   `*Market Cap:* ${marketCap || 'N/A'}\n` + 
                   `[🔗 More Info](${token.url})\n\n` + // Separate each token by a new line
                   `----------------------------\n`; // Divider to separate tokens
        }));

        // Combine the header with the token messages
        const finalMessage = messageHeader + messages.join('');

        // Send the final message to the group
        await sendMessageToGroup(finalMessage);
    } else {
        console.log('No newly launched tokens found to post.');
    }
}

// Call the main function
postTopLaunchedTokensToGroup();

// Export the 
