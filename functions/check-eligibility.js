const axios = require('axios');

const projects = [
  {
    name: "Monadoon",
    url: "https://script.google.com/macros/s/AKfycbwSVREPm_HV9oSjnbaGPm--NL6GqDUoLyfchRb_UzxesITAVC43q3ps7FP4cYFnlJ9n/exec",
  },
  {
    name: "MonadSealsNft",
    url: "https://script.google.com/macros/s/AKfycbzoo-qjyqZwJMDtvqv80j2x2wRMNGZOSqf0zpV5gb8LBG1WrnJtuyEiZRdXZJMsAWLa/exec",
  },
  {
    name: "MonApesClub",
    url: "https://script.google.com/macros/s/AKfycbw05PZByqqQoVudP-YK7js19hIdDvgZXS6MbTvWpqvVYEGo79s5vlfXrphu4oaFYbu9/exec",
  },
  // Add other projects here as needed
];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const { walletAddress, projectNames } = body;

  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress) || !projectNames || !Array.isArray(projectNames)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid input: walletAddress and projectNames array required' }),
    };
  }

  try {
    const projectChecks = projectNames.map(async (name) => {
      const project = projects.find((p) => p.name === name);
      if (!project) return { [name]: { eligible: false } };

      const url = `${project.url}?wallet=${encodeURIComponent(walletAddress)}`;
      try {
        const response = await axios.get(url, { timeout: 10000 });
        const data = response.data;
        return { [name]: { eligible: data.eligible, phase: data.phase || null } };
      } catch (error) {
        console.error(`Error checking ${name}:`, error.message);
        return { [name]: { eligible: false } };
      }
    });

    const results = await Promise.all(projectChecks);
    const eligibility = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // Ensure all requested projectNames are in the response
    projectNames.forEach((name) => {
      if (!(name in eligibility)) eligibility[name] = { eligible: false };
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eligibility),
    };
  } catch (error) {
    console.error('Error in check-eligibility:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};