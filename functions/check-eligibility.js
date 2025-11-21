const axios = require('axios');

const projects = [

  {
    name: "OctoNads_Genesis",
    url: "https://script.google.com/macros/s/AKfycbwRWPVET2Q3oB3p_SUnt7utN699Cjlh_PhEhLoEeHDCyGvgMxKKtfDBRJSsaPY4cMn9rg/exec"
  },
  {
    name: "Utility_Card",
    url: "https://script.google.com/macros/s/AKfycbx2FmZr8YeQ37oDtmjum3hbdM0p8xmvYlVzGRzGWp4PjeoUHlCiny7kyTyQLJtu0267/exec",
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

const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds

function isCacheValid(entry) {
  return entry && Date.now() - entry.timestamp < CACHE_TTL;
}

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
  const lowerWallet = walletAddress.toLowerCase();

  for (const name of projectNames) {
    const project = projects.find(p => p.name === name);
    if (!project) {
      results[name] = { eligible: false, entries: [] };
      continue;
    }

    const cacheKey = `${lowerWallet}:${name}`;
    const cached = cache.get(cacheKey);

    if (isCacheValid(cached)) {
      results[name] = cached.data;
      continue;
    }

    try {
      const response = await axios.get(`${project.url}?wallet=${walletAddress}`, {
        timeout: 12000,
      });

      const raw = response.data;

      let finalResult;

      // === SUPPORT BOTH OLD AND NEW GOOGLE APPS SCRIPT FORMATS ===
      if (raw.entries && Array.isArray(raw.entries)) {
        // New format: multiple entries
        finalResult = {
          eligible: raw.eligible === true,
          entries: raw.entries.map(e => ({
            spotType: e.spotType || "TBA",
            phase: e.phase || "TBA",
            mintDate: e.mintDate || "TBA",
            mintLaunchpad: e.mintLaunchpad || "TBA"
          }))
        };
      } else if (raw.eligible !== undefined) {
        // Old single-entry format (backward compatible)
        finalResult = {
          eligible: raw.eligible === true,
          entries: raw.eligible ? [{
            spotType: raw.spotType || "TBA",
            phase: raw.phase || "TBA",
            mintDate: raw.mintDate || "TBA",
            mintLaunchpad: raw.mintLaunchpad || "TBA"
          }] : []
        };
      } else {
        // IPFS static files usually just return true/false or object
        finalResult = { eligible: !!raw, entries: [] };
      }

      cache.set(cacheKey, { data: finalResult, timestamp: Date.now() });
      results[name] = finalResult;

    } catch (err) {
      console.error(`Error fetching ${name}:`, err.message, err.response?.status);

      // Don't kill everything on 429 — return cached if available
      if (cached && isCacheValid(cached)) {
        results[name] = cached.data;
      } else {
        results[name] = { eligible: false, entries: [] };
      }
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(results)
  };
};