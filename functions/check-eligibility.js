const axios = require('axios');

const projects = [

  {
    name: "Utility_Card",
    url: "",
  },
  {
    name: "Chilpys",
    url: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreiec672dcmekxyd6y6yuzeotxdax7tesbatokmc5uolmmkvc4btwgq",
  },
  {
    name: "Monadoon",
    url: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreif4l6h2kkko52lnhr3xqekbkkgjm5bmvvhtnnvpgvtx76cprlj7wa",
  },
  {
    name: "MonadSealsNft",
    url: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreieceppvcddmevg22pidzhrxyxf4iqmnbtzcew5dvgm47phsgvxfke",
  },
  {
    name: "MonApesClub",
    url: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreie4drcppth4h5dn4lrmdammq3douanjrqhsdzt4szx5c6xolsnv3i",
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