import React, { useState, useEffect } from "react";
import {
  Search, Wallet, Twitter, Disc, CheckCircle, XCircle, Share2, Lock,
  Calendar, Tag, Layers, Rocket, Trophy, Clock, Flame
} from "lucide-react";

const WalletCheckerTool = ({ setIsNavLoading }) => {
  const [projects] = useState([
    
    { name: "Utility_Card", logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreid3h7whj3ceib45fzdscmulq7pj2ixlgkqwhvyabgy3s5oael3jlm", twitter: "https://x.com/OctoNads", discord: "discord.gg/C6EefTRpzd", isSoldOut: false, isTrending: true },
    { name: "Chilpys", logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreiec672dcmekxyd6y6yuzeotxdax7tesbatokmc5uolmmkvc4btwgq", twitter: "https://x.com/chilpys?s=21", discord: "", isSoldOut: true, isTrending: false },
    { name: "Monadoon", logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreif4l6h2kkko52lnhr3xqekbkkgjm5bmvvhtnnvpgvtx76cprlj7wa", twitter: "https://x.com/Monadoons", discord: "https://discord.com/invite/monadoon", isSoldOut: true, isTrending: false },
    { name: "MonadSealsNft", logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreieceppvcddmevg22pidzhrxyxf4iqmnbtzcew5dvgm47phsgvxfke", twitter: "https://x.com/MonadSealsNFT", discord: "https://discord.com/invite/monadseals", isSoldOut: true, isTrending: false },
    { name: "MonApesClub", logo: "https://red-kind-moose-832.mypinata.cloud/ipfs/bafkreie4drcppth4h5dn4lrmdammq3douanjrqhsdzt4szx5c6xolsnv3i", twitter: "https://x.com/MonapesClub_xyz", discord: "http://discord.gg/v7aEegVQ", isSoldOut: true, isTrending: false },
  ]);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Access State
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState(false);

  // Results State
  const [eligibilityResults, setEligibilityResults] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionError, setSelectionError] = useState("");

  // Animation & Modal State
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countDown, setCountDown] = useState(5);

  useEffect(() => { if (setIsNavLoading) setIsNavLoading(false); }, [setIsNavLoading]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      if (countDown > 0) {
        timer = setTimeout(() => setCountDown((prev) => prev - 1), 1000);
      } else {
        setShowSuccessModal(false);
      }
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, countDown]);

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (accessInput.trim().toUpperCase() === "GOCTO") {
      setAccessGranted(true);
      setAccessError(false);
    } else {
      setAccessError(true);
    }
  };

  const validateAddress = (addr) => {
    const valid = /^0x[a-fA-F0-9]{40}$/i.test(addr);
    setAddressError(valid ? "" : "Invalid wallet address");
    return valid;
  };

  const handleProjectSelection = (name) => {
    const proj = projects.find(p => p.name === name);
    if (proj.isSoldOut) return;
    setSelectedProjects(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
    if (selectedProjects.length === 0) setSelectionError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (selectedProjects.length === 0) {
      setSelectionError("Select Project First to check");
      return;
    }

    if (!walletAddress || addressError) {
      setFetchError("Enter valid wallet");
      return;
    }

    setSelectionError("");
    setFetchError("");
    setIsLoading(true);
    setEligibilityResults({});
    setShowConfetti(false);
    setShowSuccessModal(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await fetch("/.netlify/functions/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: walletAddress.trim(), projectNames: selectedProjects }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      const enriched = {};
      let hasSuccess = false;

      selectedProjects.forEach(name => {
        const rawResult = data[name] || { eligible: false, entries: [] };
        const info = projects.find(p => p.name === name);

        // Keep all entries for multi-phase display
        const entries = Array.isArray(rawResult.entries) ? rawResult.entries : [];

        enriched[name] = {
          eligible: rawResult.eligible === true,
          entries: entries.map(e => ({
            spotType: e.spotType || "TBA",
            phase: e.phase || "TBA",
            mintDate: e.mintDate || "TBA",
            mintLaunchpad: e.mintLaunchpad || "TBA"
          })),
          ...info
        };

        if (rawResult.eligible) hasSuccess = true;
      });

      setEligibilityResults(enriched);
      if (hasSuccess) {
        setShowConfetti(true);
        setCountDown(5);
        setShowSuccessModal(true);
      }

    } catch (err) {
      setFetchError("Failed to fetch results. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTwitterHandle = (url) => {
    try {
      const pathname = new URL(url).pathname;
      const username = pathname.slice(1).split('/')[0].split('?')[0];
      return username ? `@${username}` : '';
    } catch {
      return '';
    }
  };

  const handleShare = () => {
    const eligibleProjects = Object.values(eligibilityResults).filter(r => r.eligible);

    const handles = eligibleProjects.map(p => extractTwitterHandle(p.twitter));
    const uniqueHandles = [...new Set(handles.filter(Boolean))].join(' ');

    const hasEligible = eligibleProjects.length > 0;

    const text = hasEligible
      ? `I'm Eligible to mint ${uniqueHandles} on Monad Mainnet ! 🚀\n Powered By @OctoNads \nCheck yours → https://octotools.xyz/wallet-checker`
      : `Checked my Monad whitelist status! 🚀 @OctoNads\nCheck yours → https://octotools.xyz/wallet-checker`;

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const eligibleCount = Object.values(eligibilityResults).filter(r => r.eligible).length;


  return (
    <div className="checker-page-wrapper">

      {/* CONFETTI BACKGROUND */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffffff', '#d500f9'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 5 + 5}px`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        /* === MAIN PAGE LAYOUT === */
        .checker-page-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 100px 20px 40px 20px;
          background: linear-gradient(135deg, #4a148c, #3f1b9a);
          color: #f8ceff;
          font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
          box-sizing: border-box;
          position: relative;
          overflow-x: hidden;
        }

        /* === MOBILE RESPONSIVENESS ADJUSTMENTS === */
        @media (max-width: 768px) {
            .checker-page-wrapper {
                padding: 80px 12px 30px 12px;
            }
            .checker-split-layout {
                flex-direction: column !important;
            }
            .checker-right-panel {
                position: static !important;
                width: 100%;
                margin-top: 20px;
            }
            .panel-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .search-wrapper {
                width: 100%;
                max-width: 100%;
                margin-top: 10px;
            }
            .projects-grid {
                grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
                gap: 10px !important;
            }
            .project-card {
                padding: 12px !important;
            }
            .card-image-container {
                width: 60px !important;
                height: 60px !important;
            }
            .card-title {
                font-size: 13px !important;
            }
            .result-header-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            .status-badge {
                align-self: flex-start;
            }
            .result-details-grid {
                grid-template-columns: 1fr !important;
            }
        }

        /* === TRENDING BADGE (NEW) === */
        .trending-badge {
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(45deg, #ff512f, #dd2476);
            color: white;
            padding: 4px 8px 4px 6px;
            border-bottom-right-radius: 12px;
            border-top-left-radius: 16px;
            font-size: 10px;
            font-weight: 900;
            display: flex;
            align-items: center;
            gap: 3px;
            z-index: 20;
            box-shadow: 2px 2px 10px rgba(221, 36, 118, 0.6);
            animation: firePulse 1.5s infinite;
            border-right: 1px solid rgba(255,255,255,0.3);
            border-bottom: 1px solid rgba(255,255,255,0.3);
            letter-spacing: 0.5px;
        }

        .fire-icon {
            animation: flicker 0.4s infinite alternate;
        }

        @keyframes firePulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 81, 47, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(255, 81, 47, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 81, 47, 0); }
        }

        @keyframes flicker {
            from { transform: scale(1) rotate(-5deg); opacity: 1; }
            to { transform: scale(1.2) rotate(5deg); opacity: 0.8; }
        }

        /* === CONFETTI ANIMATION === */
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        .confetti {
          position: absolute;
          top: -20px;
          animation: fall linear forwards;
        }
        @keyframes fall {
          to { transform: translateY(105vh) rotate(720deg); }
        }
        .confetti:nth-child(odd) { animation-duration: 2.5s; }
        .confetti:nth-child(even) { animation-duration: 3.5s; }

        /* === BLUR STATE === */
        .blur-locked {
          filter: blur(12px);
          pointer-events: none;
          user-select: none;
          transition: filter 0.5s ease;
        }
        .access-granted {
          filter: blur(0);
          transition: filter 0.5s ease;
        }

        /* === SPLIT LAYOUT GRID === */
        .checker-split-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        @media (min-width: 900px) {
          .checker-split-layout {
            flex-direction: row;
            align-items: flex-start;
          }
          .checker-left-panel { flex: 1 1 60%; }
          .checker-right-panel { 
            flex: 1 1 40%;
            position: sticky;
            top: 100px;
            min-width: 300px;
          }
        }

        /* === LEFT PANEL: PROJECTS === */
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .panel-header h2 {
          margin: 0;
          font-size: 24px;
          text-shadow: 0 0 10px rgba(225, 190, 231, 0.5);
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 300px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 32%;
          transform: translateY(-50%);
          color: #6a1b9a;
        }
        .modern-search-input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border-radius: 20px;
          border: 2px solid transparent;
          background: rgba(243, 229, 245, 0.9);
          color: #4a148c;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .modern-search-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(165, 104, 200, 0.4);
          border-color: #ab47bc;
        }

        /* PROJECTS GRID */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          padding-bottom: 20px;
        }
        .project-card {
          position: relative;
          background: linear-gradient(145deg, #351748, #4527a0);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .project-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 20px rgba(245, 187, 255, 1);
        }
        .project-card.selected {
            border-color: #f3e5f5;
            background: linear-gradient(145deg, #fbffce, #351748);
            box-shadow: 0 0 15px rgba(174, 234, 0, 0.5);
        }
        .project-card.sold-out {
          filter: grayscale(0.8);
          opacity: 0.8;
          cursor: not-allowed;
        }
        .selected-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          animation: popIn 0.3s ease;
          z-index: 10;
        }
        .card-image-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.1);
          margin-bottom: 10px;
          background: #311b92;
        }
        .card-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-title {
          margin: 0;
          font-size: 15px;
          text-align: center;
          color: white;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-socials {
          display: flex;
          gap: 10px;
          margin-top: 8px;
          opacity: 0.7;
        }
        .card-socials a {
          color: white;
          transition: transform 0.2s;
        }
        .card-socials a:hover {
          transform: scale(1.2);
          color: #e1bee7;
        }
        .sold-out-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }
        .sold-out-overlay span {
          background: #d32f2f;
          color: white;
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
          transform: rotate(-10deg);
        }
        .selection-summary {
          text-align: right;
          font-size: 14px;
          color: #e1bee7;
          margin-top: -10px;
        }

        /* === RIGHT PANEL: CHECKER FORM === */
        .glass-panel {
          background: rgba(52, 7, 92, 1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 2px solid rgba(249, 193, 244, 1);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 32px rgba(0, 0, 0, 0.3);
          width: 100%;
          box-sizing: border-box;
        }
        .panel-title {
          margin-top: 0;
          text-align: center;
          border-bottom: 1px solid rgb(248 206 255);
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .checker-form-modern {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }
        /* === UPDATE: Ensure Input Group is full width to match button === */
        .input-group {
            width: 100%;
        }
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #d1c4e9;
        }
        .input-with-icon {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 32%;
          transform: translateY(-50%);
          color: #7e57c2;
        }
        .checker-form-modern input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          font-size: 16px;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .checker-form-modern input:focus {
          outline: none;
          border-color: #ab47bc;
          background: rgba(0, 0, 0, 0.3);
        }
        .error-input { border-color: #ef5350 !important; }
        
        .field-error {
          color: #ef5350;
          font-size: 12px;
          margin-top: 5px;
          display: block;
          font-weight: bold;
          animation: shake 0.3s;
        }

        .check-btn-modern {
          background: linear-gradient(90deg, #8e24aa, #ab47bc);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 5px 15px rgba(171, 71, 188, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%; /* Ensures it matches the input width */
          margin-top: 15px;
        }
        .check-btn-modern:hover:not(:disabled) {
          transform: scale(1.05);
          background: linear-gradient(90deg, #ab47bc, #ce93d8);
        }
        .check-btn-modern:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        /* RESULTS AREA */
        .results-area {
          margin-top: 25px;
          min-height: 100px;
        }
        .empty-state {
          text-align: center;
          padding: 20px;
          color: rgba(255,255,255,0.4);
          font-style: italic;
        }

        /* --- CARD STYLES --- */
        .result-card-modern {
          background: rgba(0,0,0,0.3);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: transform 0.3s ease;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .result-card-modern.celebrate {
          border: 2px solid #ffd700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          animation: pulseGlow 2s infinite;
          background: linear-gradient(145deg, rgba(0,0,0,0.4), rgba(74, 20, 140, 0.6));
        }
        
        .result-header-row {
          display: flex;
          align-items: center;
          padding: 16px;
          background: rgba(255,255,255,0.05);
          justify-content: space-between;
        }
        
        .result-identity {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .result-big-logo {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          object-fit: cover;
        }
        
        .result-project-name {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .status-badge.success { background: #4caf50; color: white; }
        .status-badge.fail { background: #d32f2f; color: white; }

        /* Details Grid */
        .result-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px;
        }
        
        .detail-item {
          background: rgba(255,255,255,0.05);
          padding: 10px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-label {
          font-size: 11px;
          color: #b39ddb;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .detail-value {
          font-size: 14px;
          font-weight: bold;
          color: white;
        }

        .share-btn-modern {
          width: 100%;
          margin-top: 15px;
          background: #1da1f2;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .share-btn-modern:hover {
          background: #4db6f6;
          transform: translateY(-2px);
        }

        /* === SUCCESS POPUP MODAL === */
        .success-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 4000;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .success-modal-card {
          background: linear-gradient(160deg, #2a0a4a, #4a148c);
          border: 2px solid #ffd700;
          border-radius: 30px;
          padding: 40px 30px;
          width: 100%;
          max-width: 450px;
          text-align: center;
          position: relative;
          box-shadow: 0 0 50px rgba(255, 215, 0, 0.4), inset 0 0 30px rgba(255, 215, 0, 0.1);
          animation: modalPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPopIn {
          from { transform: scale(0.5) translateY(100px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .success-icon-wrapper {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #ffd700, #ffecb3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          animation: bounceIcon 1s infinite alternate ease-in-out;
        }
        
        @keyframes bounceIcon {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        .success-title {
          font-size: 32px;
          color: #fff;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 4px 0 rgba(0,0,0,0.3);
        }

        .success-subtitle {
          font-size: 18px;
          color: #e1bee7;
          margin-bottom: 30px;
        }
        
        .highlight-text {
          color: #ffd700;
          font-weight: bold;
          font-size: 1.2em;
        }

        

        /* === NEW: Countdown Timer Style === */
        .auto-close-timer {
            position: absolute;
            top: 22px;
            right: 60px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* === LOCK MODAL === */
        .lock-modal {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px);
          padding: 20px;
        }
        .lock-content {
          background: #4a148c;
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 2px solid #7b1fa2;
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-sizing: border-box;
        }
        .lock-icon-bg {
          width: 80px;
          height: 80px;
          background: #7b1fa2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .lock-content input {
          width: 100%;
          padding: 15px;
          margin: 20px 0;
          border-radius: 12px;
          border: none;
          text-align: center;
          font-size: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
          box-sizing: border-box;
        }
        .lock-content button {
          background: #f8ceff;
          color: #4a148c;
          border: none;
          padding: 12px 40px;
          font-size: 18px;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
          width: 100%;
        }
        .lock-content button:hover { transform: scale(1.02); }

        /* ANIMATIONS */
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
          100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
        }
        .loader {
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        .shake-text {
          color: #ef5350;
          animation: shake 0.5s;
          margin-top: 10px;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className={`checker-content ${accessGranted ? "access-granted" : "blur-locked"}`}>
        <div className="checker-split-layout">
          {/* LEFT PANEL - unchanged */}
          <div className="checker-left-panel">
            <div className="panel-header">
              <h2>Select Projects</h2>
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="      Search collections..." className="modern-search-input" />
              </div>
            </div>
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.name} className={`project-card ${project.isSoldOut ? "sold-out" : ""} ${selectedProjects.includes(project.name) ? "selected" : ""}`} onClick={() => handleProjectSelection(project.name)}>
                  
                  {/* TRENDING BADGE (NEW) */}
                  {project.isTrending && (
                    <div className="trending-badge">
                      <Flame size={12} fill="#fff" className="fire-icon" />
                      <span>HOT</span>
                    </div>
                  )}

                  {selectedProjects.includes(project.name) && <div className="selected-badge"><CheckCircle size={20} fill="#aeea00" color="#000" /></div>}
                  <div className="card-image-container"><img src={project.logo} alt={project.name} className="card-logo" /></div>
                  <h3 className="card-title">{project.name}</h3>
                  <div className="card-socials">
                    {project.twitter && <a href={project.twitter} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}><Twitter size={14} /></a>}
                    {project.discord && <a href={project.discord} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}><Disc size={14} /></a>}
                  </div>
                  {project.isSoldOut && <div className="sold-out-overlay"><span>MINTED OUT</span></div>}
                </div>
              ))}
            </div>
            {selectedProjects.length > 0 && <div className="selection-summary">Selected: <strong>{selectedProjects.length}</strong> projects</div>}
          </div>

          {/* RIGHT PANEL - UPDATED RESULTS DISPLAY */}
          <div className="checker-right-panel">
            <div className="glass-panel">
              <h2 className="panel-title">Did you Check ?</h2>
              {fetchError && <div style={{ color: "#ff5252", textAlign: "center", marginBottom: "15px" }}>{fetchError}</div>}

              <form onSubmit={handleSearch} className="checker-form-modern">
                <div className="input-group">
                  <label>Enter Wallet Address</label>
                  <div className="input-with-icon">
                    <Wallet className="input-icon" size={18} />
                    <input type="text" value={walletAddress} onChange={(e) => { setWalletAddress(e.target.value); validateAddress(e.target.value); }} placeholder="0x..." className={addressError ? "error-input" : ""} />
                  </div>
                  {addressError && <span className="field-error">{addressError}</span>}
                  {selectionError && <span className="field-error">{selectionError}</span>}
                </div>

                <button type="submit" className="check-btn-modern" disabled={isLoading || !walletAddress || !!addressError}>
                  {isLoading ? <div className="loader" /> : "Check Eligibility"}
                </button>
              </form>

              <div className="results-area">
                {Object.keys(eligibilityResults).length > 0 ? (
                  <>
                    {Object.entries(eligibilityResults).map(([name, r]) => (
                      <div key={name} className={`result-card-modern ${r.eligible ? "celebrate" : ""}`}>
                        <div className="result-header-row">
                          <div className="result-identity">
                            <img src={r.logo} alt="" className="result-big-logo" />
                            <h4 className="result-project-name">{name}</h4>
                          </div>
                          <div className={`status-badge ${r.eligible ? "success" : "fail"}`}>
                            {r.eligible ? <> <CheckCircle size={14} /> Whitelisted</> : <> <XCircle size={14} /> Not Eligible</>}
                          </div>
                        </div>

                        {r.eligible && r.entries.length > 0 && (
                          <div style={{ padding: "0 16px 16px" }}>
                            {r.entries.map((entry, idx) => (
                              <div key={idx} style={{ marginBottom: idx < r.entries.length - 1 ? "16px" : "0" }}>
                                {r.entries.length > 1 && <div style={{ fontSize: "12px", color: "#ffd700", marginBottom: "8px", fontWeight: "bold" }}>Spot #{idx + 1}</div>}
                                <div className="result-details-grid">
                                  <div className="detail-item">
                                    <div className="detail-label"><Tag size={10} /> Spot Type</div>
                                    <div className="detail-value">{entry.spotType}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="detail-label"><Layers size={10} /> Phase</div>
                                    <div className="detail-value">{entry.phase}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="detail-label"><Calendar size={10} /> Mint Date</div>
                                    <div className="detail-value">{entry.mintDate}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="detail-label"><Rocket size={10} /> Launchpad</div>
                                    <div className="detail-value">{entry.mintLaunchpad}</div>
                                  </div>
                                </div>
                                {idx < r.entries.length - 1 && <hr style={{ border: "1px dashed rgba(255,255,255,0.2)", margin: "12px 0" }} />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {Object.values(eligibilityResults).some(r => r.eligible) && (
                      <button onClick={handleShare} className="share-btn-modern">
                        <Share2 size={16} /> Share Result
                      </button>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    Select projects and enter your wallet address to check eligibility.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auto-close-timer"><Clock size={12} /> Closing in {countDown}s</div>
            <div className="success-icon-wrapper"><Trophy size={50} color="#4a148c" fill="#4a148c" /></div>
            <h2 className="success-title">Congratulations!</h2>
            <p className="success-subtitle">
              You are Eligible for <span className="highlight-text">{eligibleCount}</span> Project{eligibleCount > 1 ? "s" : ""}!
            </p>
            <button onClick={handleShare} className="check-btn-modern" style={{ marginTop: '0' }}>
              <Twitter size={20} style={{ marginRight: '10px' }} /> Share on X
            </button>
          </div>
        </div>
      )}

      {!accessGranted && (
        <div className="lock-modal">
          <div className="lock-content">
            <div className="lock-icon-bg"><Lock size={40} color="#fff" /></div>
            <h2>Want to Access ?</h2>
            <p>Enter the access code (GOCTO) to get enter OCTONADS Kingdom.</p>
            <form onSubmit={handleAccessSubmit}>
              <input value={accessInput} onChange={(e) => setAccessInput(e.target.value)} placeholder="Code (GOCTO)" autoFocus />
              <button type="submit">Unlock</button>
            </form>
            {accessError && <p className="shake-text">Access Denied</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCheckerTool;