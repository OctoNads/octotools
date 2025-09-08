import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../App.css";

// Static list of collections for search suggestions (derived from backend collectionMetadata)
const collections = [
  { name: "Molandaks Mint Pass", contractAddress: "0x6341c537a6fc563029d8e8caa87da37f227358f4" },
  { name: "Purple Frens", contractAddress: "0xc5c9425d733b9f769593bd2814b6301916f91271" },
  { name: "Chogs Mystery Chest", contractAddress: "0xe6b5427b174344fd5cb1e3d5550306b0055473c6" },
  { name: "Skrumpets", contractAddress: "0xe8f0635591190fb626f9d13c49b60626561ed145" },
  { name: "Spikes", contractAddress: "0x87E1F1824C9356733A25d6beD6b9c87A3b31E107" },
  { name: "The10kSquad", contractAddress: "0x3A9454C1B4c84D1861BB1209a647C834d137b442" },
  { name: "Sealuminati Testnetooor", contractAddress: "0x4870e911b1986c6822a171cdf91806c3d44ce235" },
  { name: "Beannad", contractAddress: "0xb03b60818fd7f391e2e02c2c41a61cff86e4f3f5" },
  { name: "TheDaks", contractAddress: "0x78ed9a576519024357ab06d9834266a04c9634b7" },
  { name: "Chewy", contractAddress: "0x88bbcba96a52f310497774e7fd5ebadf0ece21fb" },
  { name: "r3tards", contractAddress: "0xed52e0d80f4e7b295df5e622b55eff22d262f6ed" },
  { name: "Exo Spirits", contractAddress: "0x89431f71352afb1f62637556224203460751957e" },
  { name: "Mop Nads", contractAddress: "0xb600de0ebee70af4691dbf8a732be7791b6ce73a" },
  { name: "Moyakinads", contractAddress: "0xd22385e223eff3b3b30a74874055b260a287a592" },
  { name: "Mutated Monadsters", contractAddress: "0x7ea266cf2db3422298e28b1c73ca19475b0ad345" },
  { name: "the billies", contractAddress: "0xaebd98e511b79fc5314910187cc18e9abf15808f" },
  { name: "LaMouchNFT", contractAddress: "0x800f8cacc990dda9f4b3f1386c84983ffb65ce94" },
  { name: "Monshape Hopium", contractAddress: "0x69f2688abe5dcde0e2413f77b80efcc16361a56e" },
  { name: "C Family", contractAddress: "0x42ebb45dbfb74d7aedbddc524cad36e08b4c0022" },
  { name: "Monad Nomads", contractAddress: "0x9ac5998884cf59d8a87dfc157560c1f0e1672e04" },
  { name: "Mondana Baddies Eye Chain", contractAddress: "0xd6421e9c72199e971e5a3cde09214054e1216cd2" },
  { name: "BOBR", contractAddress: "0x3ff5ab5eea49d25ab00b532e9e50b17d5218068c" },
  { name: "Molandaks", contractAddress: "0x66e40f67afd710386379a6bb24d00308f81c183f" },
  { name: "Meowwnads", contractAddress: "0xa568cabe34c8ca0d2a8671009ae0f6486a314425" },
  { name: "Mecha Box Mint Pass", contractAddress: "0x3db6c11474893689cdb9d7cdedc251532cadf32b" },
  { name: "Lil Chogstars", contractAddress: "0x26c86f2835c114571df2b6ce9ba52296cc0fa6bb" },
  { name: "Overnads: Whitelist Pass", contractAddress: "0x49d54cd9ca8c5ecadbb346dc6b4e31549f34e405" },
  { name: "SLMND Genesis", contractAddress: "0xf7b984c089534ff656097e8c6838b04c5652c947" },
  { name: "OCTONADS OCTOG PASS", contractAddress: "0xce49fc8ad0618931265a7cc6d859649af92a9d03" },
];

const SnapshotTool = ({ setIsNavLoading }) => {
  const [searchInput, setSearchInput] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [minNFTs, setMinNFTs] = useState("");
  const [holderCount, setHolderCount] = useState("");
  const [result, setResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [holderSearch, setHolderSearch] = useState("");
  const [collectionMetadata, setCollectionMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [floatingTextStyles, setFloatingTextStyles] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [fileFormat, setFileFormat] = useState("pdf");
  const [fetchError, setFetchError] = useState("");

  // Reset navigation loading when the component mounts
  useEffect(() => {
    setIsNavLoading(false);
  }, [setIsNavLoading]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().catch((err) => console.error("Notification permission error:", err));
    }
  }, []);

  // Floating text animation setup
  useEffect(() => {
    const floatingTexts = [
      "GMONAD",
      "GOCTO",
      "GCHOG",
      "GCHOGSTAR",
      "GMOO",
      "GDAKS",
      "G10K",
      "GBLOCK",
      "GMEOW",
      "GMOPO",
      "GCANZ",
    ];

    const initialStyles = floatingTexts.map(() => ({}));
    setFloatingTextStyles(initialStyles);

    const moveFloatingTexts = () => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 50;
      const newStyles = floatingTexts.map(() => ({
        left: `${Math.random() * maxX}px`,
        top: `${Math.random() * maxY}px`,
        transition: "all 5s linear",
      }));
      setFloatingTextStyles(newStyles);
    };

    moveFloatingTexts();
    const interval = setInterval(moveFloatingTexts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle search input and suggestions
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setContractAddress(""); // Clear contract address until a suggestion is selected

    if (value.length > 0) {
      const filteredSuggestions = collections.filter((collection) =>
        collection.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (collection) => {
    setSearchInput(collection.name);
    setContractAddress(collection.contractAddress);
    setSuggestions([]);
  };

  // Handle holder search
  useEffect(() => {
    if (holderSearch) {
      const filtered = result.filter((holder) =>
        holder.ownerAddress.toLowerCase().includes(holderSearch.toLowerCase())
      );
      setFilteredResult(filtered);
    } else {
      setFilteredResult(result);
    }
  }, [holderSearch, result]);

  // Handle access submission
  const handleAccessSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const input = accessInput.trim().toUpperCase();
    if (input === "GOCTO") {
      setAccessGranted(true);
      setAccessError(false);
    } else {
      setAccessError(true);
    }
  };

  const fetchAllNFTHolders = async (contractAddress) => {
    const url = `/api/holders?contractAddress=${encodeURIComponent(contractAddress)}&pageSize=100`; // Match backend pageSize
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.holders || !Array.isArray(data.holders)) {
      throw new Error('Invalid response: holders field missing or not an array');
    }
    return { holders: data.holders, metadata: data.metadata, totalHolders: data.totalHolders };
  };

    // Filter holders by minimum NFT count
  const filterHolders = (holders, minNFTs) => {
    return holders.filter((holder) => Number(holder.amount) > minNFTs);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let addressToFetch = contractAddress;

    if (!addressToFetch) {
      if (/^0x[a-fA-F0-9]{40}$/.test(searchInput)) {
        addressToFetch = searchInput;
      } else {
        const matchedCollection = collections.find(
          (collection) => collection.name.toLowerCase() === searchInput.toLowerCase()
        );
        if (matchedCollection) {
          addressToFetch = matchedCollection.contractAddress;
        } else {
          setHolderCount("");
          setResult([]);
          setFilteredResult([]);
          setCollectionMetadata(null);
          setFetchError("Invalid contract address or collection name.");
          return;
        }
      }
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(addressToFetch)) {
      setHolderCount("");
      setResult([]);
      setFilteredResult([]);
      setCollectionMetadata(null);
      setFetchError("Invalid contract address format.");
      return;
    }

    let minNFTsValue = 0;
    if (minNFTs) {
      minNFTsValue = parseInt(minNFTs, 10) - 1;
      if (isNaN(minNFTsValue) || minNFTsValue < 0) {
        alert("Please enter a valid minimum NFT count (positive integer).");
        return;
      }
    }

    setIsLoading(true);
    setShowInfoPopup(true);
    setFetchError("");
    setHolderCount("");
    setResult([]);
    setFilteredResult([]);
    setCollectionMetadata(null);

    setTimeout(() => {
      setShowInfoPopup(false);
    }, 5000);

    try {
      const { holders, metadata } = await fetchAllNFTHolders(addressToFetch);
      if (holders.length > 0) {
        const filteredHolders = filterHolders(holders, minNFTsValue);
        setHolderCount(`Number of Holders holding at least ${minNFTs || 1} NFT(s): ${filteredHolders.length}`);
        setResult(filteredHolders);
        setFilteredResult(filteredHolders);
        setCollectionMetadata(metadata);
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Fetching Completed", {
            body: `Fetched ${filteredHolders.length} holders for the collection!`,
          });
        }
        setShowCompletion(true);
      } else {
        setHolderCount("Number of holders: 0");
        setResult([]);
        setFilteredResult([]);
        setCollectionMetadata(null);
        setShowCompletion(true);
        setFetchError("No holders found for this contract address.");
      }
    } catch (error) {
      setFetchError(`Failed to fetch holders: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSearchInput("");
    setContractAddress("");
    setSuggestions([]);
    setMinNFTs("");
    setHolderCount("");
    setResult([]);
    setFilteredResult([]);
    setHolderSearch("");
    setCollectionMetadata(null);
    setFetchError("");
  };

  const handleDownload = () => {
    const addresses = filteredResult.map((holder) => holder.ownerAddress).filter((addr) => addr);
    if (addresses.length === 0) {
      alert("No holders to download.");
      return;
    }

    if (fileFormat === "pdf") {
      const doc = new jsPDF();
      const lineHeight = 10;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 10;
      let y = margin;

      addresses.forEach((addr, index) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(addr, margin, y);
        y += lineHeight;
      });

      doc.save("holders.pdf");
    } else if (fileFormat === "xml") {
      const xmlContent = `<holders>\n${addresses
        .map((addr) => `    <address>${addr}</address>`)
        .join("\n")}\n</holders>`;
      const blob = new Blob([xmlContent], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "holders.xml";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Blurred content when access not granted */}
      <div className={accessGranted ? "" : "blur-content"}>
        {/* Main Content */}
        <div className="container">
          {fetchError && (
            <div className="error-message">
              {fetchError}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <label htmlFor="searchInput">NFT Collection Name or Contract Address:</label>
            <div className="suggestion-container">
              <input
                type="text"
                id="searchInput"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="e.g., Molandaks Mint Pass or 0x..."
                required
                aria-required="true"
              />
              {suggestions.length > 0 && (
                <ul className="suggestion-list">
                  {suggestions.map((collection, index) => (
                    <li
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(collection)}
                    >
                      {collection.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label htmlFor="minNFTs">Minimum NFTs (optional, default is 1):</label>
            <input
              type="number"
              id="minNFTs"
              value={minNFTs}
              onChange={(e) => setMinNFTs(e.target.value)}
              min="1"
              placeholder="Enter minimum NFT count"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : fetchError ? "Try Again" : "Find Holders"}
            </button>
            <button type="button" onClick={handleReset} disabled={isLoading}>
              Reset
            </button>
          </form>

          {collectionMetadata && (
            <div className="metadata-section">
              <h2 className="metadata-heading">Collection Details</h2>
              <div className="metadata-content">
                <div className="text-info">
                  <h3>
                    {collectionMetadata.name}
                    {collectionMetadata.verified && (
                      <img
                        src="https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreicacmtobxh4luaqxt2zwl4wbf6snbzotzvxxr5doxtbzbt3ph2o64"
                        alt="Verified Badge"
                        className="verified-badge"
                      />
                    )}
                  </h3>
                  <p>Supply: {collectionMetadata.supply}</p>
                  {collectionMetadata.marketplaceLink && (
                    <a
                      href={collectionMetadata.marketplaceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="marketplace-link"
                    >
                      View on Marketplace
                    </a>
                  )}
                </div>
                <div className="image-and-logos">
                  <img
                    src={collectionMetadata.image}
                    alt={`${collectionMetadata.name} collection`}
                    className="collection-image"
                  />
                  <div className="social-logos">
                    {collectionMetadata.twitter && (
                      <a href={collectionMetadata.twitter} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter social-logo" aria-label="Twitter"></i>
                      </a>
                    )}
                    {collectionMetadata.discord && (
                      <a href={collectionMetadata.discord} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-discord social-logo" aria-label="Discord"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!collectionMetadata && holderCount && (
            <p className="metadata-unavailable">
              Collection metadata not available for this contract address. Contact the OctoNads Team to get it uploaded.
            </p>
          )}

          {holderCount && <div id="holderCount">{holderCount}</div>}
          <div id="result">
            {isLoading ? (
              <div className="spinner"></div>
            ) : result.length > 0 ? (
              <>
                <div className="holder-search-container">
                  <label htmlFor="holderSearch">Search Holders:</label>
                  <input
                    type="text"
                    id="holderSearch"
                    className="holder-search-input"
                    value={holderSearch}
                    onChange={(e) => setHolderSearch(e.target.value)}
                    placeholder="Enter holder address..."
                  />
                </div>
                {Array.isArray(filteredResult) && filteredResult[0]?.ownerAddress ? (
                  filteredResult.length > 0 ? (
                    <ul>
                      {filteredResult.map((holder, index) => (
                        <li key={index}>
                          {holder.ownerAddress} - Amount: {holder.amount}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No holders match your search.</p>
                  )
                ) : (
                  <p>{filteredResult[0]}</p>
                )}
              </>
            ) : (
              <p>Holders will appear here...</p>
            )}
          </div>

          <div id="downloadOptions">
            <label htmlFor="fileFormat">Download as:</label>
            <select
              id="fileFormat"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="xml">XML</option>
            </select>
            <button onClick={handleDownload} disabled={!filteredResult.length || isLoading}>
              Download
            </button>
          </div>
        </div>

        {/* Floating texts */}
        {floatingTextStyles.map((style, index) => (
          <div
            key={index}
            className="floating-text"
            style={{ ...style, MozTransition: style.transition, WebkitTransition: style.transition }}
          >
            {["GMONAD", "GOCTO", "GCHOG", "GCHOGSTAR", "GMOO", "GDAKS", "G10K", "GBLOCK", "GMEOW", "GMOPO", "GCANZ"][index]}
          </div>
        ))}
      </div>

      {/* Access Modal */}
      <div className="modal" style={{ display: accessGranted ? "none" : "block" }} id="accessModal">
        <div className="modal-content">
          <h2>Access Required</h2>
          <p>Please type "GOCTO" to access the snapshot tool.</p>
          <form onSubmit={handleAccessSubmit}>
            <input
              type="text"
              id="accessInput"
              value={accessInput}
              onChange={(e) => setAccessInput(e.target.value)}
              placeholder="Type GOCTO"
              autoFocus
              required
              aria-required="true"
            />
            <button type="submit">Submit</button>
          </form>
          {accessError && (
            <p id="accessError" className="error-message">
              Incorrect input. Please try again.
            </p>
          )}
        </div>
      </div>

      {/* Info Popup Modal */}
      {showInfoPopup && (
        <div className="modal" id="infoModal">
          <div className="modal-content">
            <h2>Fetching in Progress</h2>
            <p>The Result will Display in some mins. Please sit back Relax we will notify you.</p>
            <p>In case of Any Failure Try again.</p>
            <button onClick={() => setShowInfoPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletion && (
        <div className="modal" id="completionModal">
          <div className="modal-content">
            <h2>Fetching Completed</h2>
            <p>NFT holders have been successfully fetched!</p>
            <button onClick={() => setShowCompletion(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnapshotTool;