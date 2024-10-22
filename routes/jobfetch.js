const { getTopWeb3Jobs } = require('./getweb3jobs'); // Import the multi-API job fetcher

async function fetchAndPostJobs(bot, chatId) {
    try {
        // Get top 3 Web3 jobs from all sources
        const topWeb3Jobs = await getTopWeb3Jobs();

        // Format the jobs for the Telegram message
        const jobMessages = topWeb3Jobs.map((job, index) => 
            `${index + 1}. ${job.position} at ${job.company}\nPosted: ${new Date(job.date).toDateString()}\nApply here: ${job.url}`
        ).join('\n\n');

        // Send the formatted jobs to the Telegram chat
        console.log('Sending job messages to Telegram group...');
        await bot.sendMessage(chatId, `Top 3 Web3 Jobs:\n\n${jobMessages}`);
            } catch (error) {
        console.error('Error fetching or posting Web3 jobs:', error);
        await bot.sendMessage(chatId, 'Sorry, there was an error fetching Web3 jobs.');
    }
}

module.exports = { fetchAndPostJobs };
