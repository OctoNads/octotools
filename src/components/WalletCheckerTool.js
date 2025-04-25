import React, { useState, useEffect } from "react";
import "../App.css";

const WalletCheckerTool = ({ setIsNavLoading }) => {
  const projects = [
    {
      name: "Chog",
      logo: "https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq",
      twitter: "https://x.com/ChogNFT",
      discord: "https://discord.gg/chog",
    },
    {
      name: "PurpleFrens",
      logo: "https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq",
      twitter: "https://x.com/MonadPad",
      discord: "https://discord.com/invite/mpad",
    },
    {
      name: "Skrumpets",
      logo: "https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq",
      twitter: "https://x.com/skrumpeys",
      discord: "https://discord.gg/chog",
    },
    {
      name: "Spicky",
      logo: "https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq",
      twitter: "https://x.com/spikynads",
      discord: "https://discord.gg/spikynads",
    },
  ];

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [floatingTextStyles, setFloatingTextStyles] = useState([]);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [eligibilityResults, setEligibilityResults] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionError, setSelectionError] = useState("");

  useEffect(() => {
    setIsNavLoading(false);
  }, [setIsNavLoading]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().catch((err) => console.error("Notification permission error:", err));
    }
  }, []);

  useEffect(() => {
    const floatingTexts = ["GMONAD", "GOCTO", "GCHOG", "GCHOGSTAR", "GMOO", "GDAKS", "G10K", "GBLOCK", "GMEOW", "GMOPO", "GCANZ"];
    const initialStyles = floatingTexts.map(() => ({}));
    setFloatingTextStyles(initialStyles);

    const moveFloatingTexts = () => {
      const textWidth = 150; // Approximate width for text at 24px
      const textHeight = 30; // Approximate height
      const maxX = window.innerWidth - textWidth;
      const maxY = window.innerHeight - textHeight;
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

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    const input = accessInput.trim().toUpperCase();
    if (input === "GOCTO") {
      setAccessGranted(true);
      setAccessError(false);
    } else {
      setAccessError(true);
    }
  };

  const validateAddress = (address) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    setAddressError(regex.test(address) ? "" : "Please enter a valid wallet address (e.g., 0x followed by 40 characters).");
  };

  const handleProjectSelection = (projectName) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName) ? prev.filter((p) => p !== projectName) : [...prev, projectName]
    );
    setSelectionError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (selectedProjects.length === 0) {
      setSelectionError("Please select at least one project.");
      return;
    }
    if (!walletAddress || addressError) {
      setFetchError("Please enter a valid wallet address.");
      return;
    }

    setIsLoading(true);
    setShowInfoPopup(true);
    setFetchError("");
    setSelectionError("");
    setEligibilityResults({});

    setTimeout(() => setShowInfoPopup(false), 5000);

    try {
      const response = await fetch('/.netlify/functions/check-eligibility', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, projectNames: selectedProjects }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown server error");
      }

      const data = await response.json();
      const enrichedResults = Object.fromEntries(
        Object.entries(data).map(([project, isEligible]) => [
          project,
          {
            isEligible,
            logo: projects.find((p) => p.name === project)?.logo,
            twitter: projects.find((p) => p.name === project)?.twitter,
            discord: projects.find((p) => p.name === project)?.discord,
          },
        ])
      );

      setEligibilityResults(enrichedResults);

      const eligibleProjects = Object.entries(data)
        .filter(([_, isEligible]) => isEligible)
        .map(([projectName]) => projectName);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Eligibility Check Completed", {
          body: eligibleProjects.length > 0
            ? `Eligible for: ${eligibleProjects.join(", ")}`
            : "Not eligible for selected projects.",
        });
      }
      setShowCompletion(true);
    } catch (err) {
      setFetchError(`An error occurred: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const photoLink = "https://octonads.com/eligibility-photo.jpg";
    const eligibleProjects = Object.keys(eligibilityResults).filter((p) => eligibilityResults[p].isEligible);
    const tweetText = eligibleProjects.length > 0
      ? `I am eligible for ${eligibleProjects.join(", ")} to mint. Check yours at octonads.com! ${photoLink}`
      : `Checked my wallet eligibility at octonads.com! Try it out! ${photoLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank");
  };

  const handleReset = () => {
    setSelectedProjects([]);
    setWalletAddress("");
    setAddressError("");
    setEligibilityResults({});
    setFetchError("");
    setSearchQuery("");
    setSelectionError("");
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <div className={accessGranted ? "" : "blur-content"}>
       
        <div className="checker-container">
          {fetchError && <div className="checker-error">{fetchError}</div>}
          <form className="checker-form" onSubmit={handleSearch}>
            <div className="checker-search-bar-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="checker-search-bar"
              />
            </div>
            <label className="checker-label">Select Projects:</label>
            <div className="checker-card-scroll">
              <div className="checker-project-grid">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project.name}
                      className="checker-project-card"
                      onClick={() => handleProjectSelection(project.name)}
                    >
                      <img src={project.logo} alt={`${project.name} Logo`} />
                      <h3>{project.name}</h3>
                      <div className="checker-social-links">
                        {project.twitter && (
                          <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter checker-social-logo" aria-label="Twitter"></i>
                          </a>
                        )}
                        <div className="checker-spacer"></div>
                        {project.discord && (
                          <a href={project.discord} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-discord checker-social-logo" aria-label="Discord"></i>
                          </a>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.name)}
                        onChange={() => handleProjectSelection(project.name)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="checker-no-results">No projects match your search.</p>
                )}
              </div>
            </div>
            {selectedProjects.length > 0 && (
              <div className="selected-projects">
                <p>
                  You have selected {selectedProjects.length} project{selectedProjects.length > 1 ? "s" : ""}: <span>{selectedProjects.join(", ")}</span>
                </p>
              </div>
            )}
            <label className="checker-label" htmlFor="checker-wallet-address">
              Monad Wallet Address:
            </label>
            <input
              type="text"
              id="checker-wallet-address"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                validateAddress(e.target.value);
              }}
              placeholder="e.g., 0x1234...abcd"
              required
              aria-required="true"
              className="checker-wallet-address"
            />
            {addressError && <p className="checker-error">{addressError}</p>}
            {selectionError && <p className="checker-error">{selectionError}</p>}
            <button
              type="submit"
              disabled={isLoading || selectedProjects.length === 0 || !walletAddress || addressError}
              className="checker-button"
            >
              {isLoading ? "Checking..." : "Check Eligibility"}
            </button>
            <button type="button" onClick={handleReset} disabled={isLoading} className="checker-button">
              Reset
            </button>
          </form>

          <div id="checker-result">
            {isLoading ? (
              <div className="checker-spinner"></div>
            ) : Object.keys(eligibilityResults).length > 0 ? (
              <div>
                <h2 className="checker-result-header">Projects Eligibility for {walletAddress}</h2>
                <p className="checker-result-summary">
                  Eligible for {Object.values(eligibilityResults).filter((r) => r.isEligible).length} project(s)
                </p>
                {Object.entries(eligibilityResults).map(([project, result], index) => (
                  <div key={index} className="checker-result-item">
                    <img src={result.logo} alt={`${project} Logo`} />
                    <div className="checker-result-item-content">
                      <h3>
                        {project}: {result.isEligible ? "Eligible" : "Not Eligible"}
                      </h3>
                      <div className="checker-social-links">
                        {result.twitter && (
                          <a href={result.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter checker-social-logo" aria-label="Twitter"></i>
                          </a>
                        )}
                        {result.discord && (
                          <a href={result.discord} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-discord checker-social-logo" aria-label="Discord"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Eligibility results will appear here...</p>
            )}
          </div>

          {Object.keys(eligibilityResults).length > 0 && (
            <div id="checker-download-options">
              <button onClick={handleShare} className="checker-share-button">
                Share on X
              </button>
            </div>
          )}
        </div>

        {floatingTextStyles.map((style, index) => (
          <div key={index} className="floating-text" style={style}>
            {["GMONAD", "GOCTO", "GCHOG", "GCHOGSTAR", "GMOO", "GDAKS", "G10K", "GBLOCK", "GMEOW", "GMOPO", "GCANZ"][index]}
          </div>
        ))}
      </div>

      {!accessGranted && (
        <div className="modal" id="accessModal">
          <div className="modal-content">
            <h2>Access Required</h2>
            <p>Please type "GOCTO" to access the wallet checker tool.</p>
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
            {accessError && <p className="error-message">Incorrect input. Please try again.</p>}
          </div>
        </div>
      )}

      {showInfoPopup && (
        <div className="modal" id="infoModal">
          <div className="modal-content">
            <h2>Checking in Progress</h2>
            <p>Please wait; results will display shortly. We’ll notify you when complete.</p>
            <button onClick={() => setShowInfoPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showCompletion && (
        <div className="modal" id="completionModal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowCompletion(false)}>×</span>
            <h2>Eligibility Check Completed</h2>
            <p>Wallet eligibility has been successfully checked!</p>
            <div className="eligibility-summary-container">
              <p>
                Eligible for {Object.values(eligibilityResults).filter((r) => r.isEligible).length} out of{" "}
                {Object.keys(eligibilityResults).length} selected projects.
              </p>
              <div className="eligibility-list">
                {Object.entries(eligibilityResults).map(([project, result]) => (
                  <div
                    key={project}
                    className={`eligibility-item ${result.isEligible ? "eligible" : "not-eligible"}`}
                  >
                    <span>{project}</span>: {result.isEligible ? "Eligible" : "Not Eligible"}
                  </div>
                ))}
              </div>
            </div>
            {Object.values(eligibilityResults).some((r) => r.isEligible) && (
              <button onClick={handleShare} className="checker-share-button">
                Share on X
              </button>
            )}
            <button onClick={() => setShowCompletion(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCheckerTool;