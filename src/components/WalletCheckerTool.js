import React, { useState, useEffect } from "react";
import "../App.css";

const WalletCheckerTool = ({ setIsNavLoading }) => {
  const [projects] = useState([

    {
      name: "Utility_Card",
      logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreid3h7whj3ceib45fzdscmulq7pj2ixlgkqwhvyabgy3s5oael3jlm",
      twitter: "https://x.com/OctoNads",
      discord: "discord.gg/C6EefTRpzd",
      isSoldOut: false,
    },
    {
      name: "Chilpys",
      logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreiec672dcmekxyd6y6yuzeotxdax7tesbatokmc5uolmmkvc4btwgq",
      twitter: "https://x.com/chilpys?s=21",
      discord: "",
      isSoldOut: true,
    },
    {
      name: "Monadoon",
      logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreif4l6h2kkko52lnhr3xqekbkkgjm5bmvvhtnnvpgvtx76cprlj7wa",
      twitter: "https://x.com/Monadoons",
      discord: "https://discord.com/invite/monadoon",
      isSoldOut: true,
    },
    {
      name: "MonadSealsNft",
      logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreieceppvcddmevg22pidzhrxyxf4iqmnbtzcew5dvgm47phsgvxfke",
      twitter: "https://x.com/MonadSealsNFT",
      discord: "https://discord.com/invite/monadseals",
      isSoldOut: true,
    },
    {
      name: "MonApesClub",
      logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreie4drcppth4h5dn4lrmdammq3douanjrqhsdzt4szx5c6xolsnv3i",
      twitter: "https://x.com/MonapesClub_xyz",
      discord: "http://discord.gg/v7aEegVQ",
      isSoldOut: true,
    },
  ]);

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
      const textWidth = 150;
      const textHeight = 30;
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
    const project = projects.find((p) => p.name === projectName);
    if (project.isSoldOut) return;
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
        Object.entries(data).map(([project, result]) => [
          project,
          {
            isEligible: result.eligible,
            phase: result.phase,
            isSoldOut: projects.find((p) => p.name === project)?.isSoldOut,
            logo: projects.find((p) => p.name === project)?.logo,
            twitter: projects.find((p) => p.name === project)?.twitter,
            discord: projects.find((p) => p.name === project)?.discord,
          },
        ])
      );

      setEligibilityResults(enrichedResults);

      const eligibleProjects = Object.entries(data)
        .filter(([_, result]) => result.eligible)
        .map(([projectName, result]) => `${projectName} (${result.phase})`);

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
    const photoLink = "https://octotools.xyz/";
    const getTwitterUsername = (twitterUrl) => {
      if (!twitterUrl) return null;
      const parts = twitterUrl.split('/');
      const username = parts[parts.length - 1];
      return `@${username}`;
    };
    const eligibleUsernames = Object.entries(eligibilityResults)
      .filter(([_, result]) => result.isEligible)
      .map(([_, result]) => getTwitterUsername(result.twitter))
      .filter(username => username !== null);
    const tweetText = eligibleUsernames.length > 0
      ? `I am eligible for ${eligibleUsernames.join(", ")} to mint.\n\nCheck yours at https://octotools.xyz/\n\nTool by @OctoNads\n\n${photoLink}`
      : `Checked my wallet eligibility at https://octotools.xyz/! Try it out!\n\n${photoLink}`;
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
            <label className="checker-label">SELECT PROJECTS FIRST :</label>
            <div className="checker-card-scroll">
              <div className="checker-project-grid">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project.name}
                      className={`checker-project-card ${project.isSoldOut ? 'sold-out' : ''}`}
                      onClick={() => handleProjectSelection(project.name)}
                    >
                      <div className="checker-project-content">
                        <img src={project.logo} alt={`${project.name} Logo`} />
                        <h3>{project.name}</h3>
                        <div className="checker-social-links">
                          {project.twitter && (
                            <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-twitter checker-project-social-logo" aria-label="Twitter"></i>
                            </a>
                          )}
                          <div className="checker-spacer"></div>
                          {project.discord && (
                            <a href={project.discord} target="_blank" rel="noopener noreferrer">
                              <i className="fab fa-discord checker-project-social-logo" aria-label="Discord"></i>
                            </a>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.name)}
                          onChange={() => handleProjectSelection(project.name)}
                          disabled={project.isSoldOut}
                        />
                      </div>
                      {project.isSoldOut && (
                        <div className="sold-out-overlay">
                          <div className="sold-out-text">Minted Out</div>
                        </div>
                      )}
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
              Wallet Address:
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
                        {project}: {result.isEligible ? `Your Wallet Eligible in ${result.phase} phase` : "Not Eligible"}
                        {result.isSoldOut && <span style={{ color: 'red', marginLeft: '10px' }}>Sold Out</span>}
                      </h3>
                      <div className="checker-social-links">
                        {result.twitter && (
                          <a href={result.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter checker-result-social-logo" aria-label="Twitter"></i>
                          </a>
                        )}
                        {result.discord && (
                          <a href={result.discord} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-discord checker-result-social-logo" aria-label="Discord"></i>
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
                    <span>{project}</span>: {result.isEligible ? `Eligible in ${result.phase} phase` : "Not Eligible"}
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