const axios = require('axios');

const projects = [
  {
    name: "MonadSealsNft",
    url: "https://script.google.com/macros/s/AKfycbzoo-qjyqZwJMDtvqv80j2x2wRMNGZOSqf0zpV5gb8LBG1WrnJtuyEiZRdXZJMsAWLa/exec",
  },
  {
    name: "Monapes_Club",
    url: "https://script.google.com/macros/s/AKfycbwYRSRGXP_sh1jICeo_lRdg2gfu37TAUjgkG4cMZNPWva_jELg2ltiWWcoQdFo-GPr5ww/exec",
  },
  
  
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
      if (!project) return { [name]: false };

      const url = `${project.url}?wallet=${encodeURIComponent(walletAddress)}`;
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;
      return { [name]: data.eligible === true };
    });

    const results = await Promise.all(projectChecks);
    const eligibility = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // Ensure all requested projectNames are in the response
    projectNames.forEach((name) => {
      if (!(name in eligibility)) eligibility[name] = false;
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