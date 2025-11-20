const axios = require('axios');

const projects = [

  {
    name: "Utility_Card",
    url: "https://script.google.com/macros/s/AKfycbxqxp4CyVU4onO3gWXPA7U0C4fABEOQSC8zriB54NHXkIRm0hE6mnCoZ9gvG2NwAJZT/exec",
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
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { walletAddress, projectNames } = body;
  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress) || !Array.isArray(projectNames)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input' }) };
  }

  const results = {};

  for (const name of projectNames) {
    const project = projects.find(p => p.name === name);
    if (!project) {
      results[name] = { eligible: false };
      continue;
    }

    try {
      const response = await axios.get(`${project.url}?wallet=${walletAddress}`, { timeout: 10000 });
      const data = response.data;

      results[name] = {
        eligible: data.eligible === true,
        spotType: data.spotType || "TBA",
        phase: data.phase || "TBA",
        mintDate: data.mintDate || "TBA",
        mintLaunchpad: data.mintLaunchpad || "TBA"
      };
    } catch (err) {
      console.error(`Error fetching ${name}:`, err.message);
      results[name] = { eligible: false };
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results)
  };
};