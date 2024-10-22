const fetch = require('node-fetch');

// Fetch jobs from RemoteOK API
async function getRemoteOKJobs() {
    try {
        const response = await fetch('https://remoteok.io/api');
        const jobs = await response.json();
        const web3Jobs = jobs.filter(job => job.tags && job.tags.includes('web3'));
        return web3Jobs;
    } catch (error) {
        console.error('Error fetching RemoteOK jobs:', error);
        return [];
    }
}

// Fetch jobs from We Work Remotely API (dummy URL; adjust to real API)
async function getWeWorkRemotelyJobs() {
    try {
        const response = await fetch('https://weworkremotely.com/api/jobs');
        const jobs = await response.json();
        const web3Jobs = jobs.filter(job => job.tags && job.tags.includes('web3'));
        return web3Jobs;
    } catch (error) {
        console.error('Error fetching We Work Remotely jobs:', error);
        return [];
    }
}

// Fetch jobs from Jobicy API
async function getJobicyJobs() {
    try {
        const response = await fetch('https://jobicy.com/api/v2/remote-jobs?count=1');
        const jobs = await response.json();
        const web3Jobs = jobs.filter(job => job.tags && job.tags.includes('web3'));
        return web3Jobs;
    } catch (error) {
        console.error('Error fetching Jobicy jobs:', error);
        return [];
    }
}

// Fetch jobs from another API (dummy URL; adjust to real API)
async function getAnotherAPIJobs() {
    try {
        const response = await fetch('https://anotherapi.com/jobs');
        const jobs = await response.json();
        const web3Jobs = jobs.filter(job => job.tags && job.tags.includes('web3'));
        return web3Jobs;
    } catch (error) {
        console.error('Error fetching jobs from Another API:', error);
        return [];
;
    }
}

// Function to fetch from all job sources
async function getTopWeb3Jobs() {
    try {
        const [remoteOKJobs, jobicyJobs] = await Promise.all([
            getRemoteOKJobs(),
            getJobicyJobs(),
        ]);

        console.log('RemoteOK Jobs:', remoteOKJobs); // Log the fetched jobs
        console.log('Jobicy Jobs:', jobicyJobs); // Log the fetched jobs

        const allWeb3Jobs = [...remoteOKJobs, ...jobicyJobs];
        allWeb3Jobs.sort((a, b) => new Date(b.date) - new Date(a.date));

        return allWeb3Jobs.slice(0, 3);
    } catch (error) {
        console.error('Error fetching top Web3 jobs:', error);
        throw error;
    }
}
module.exports = { getTopWeb3Jobs };
