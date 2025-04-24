import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import SnapshotTool from "./components/SnapshotTool";
import WalletCheckerTool from "./components/WalletCheckerTool";
import Header from "./components/Header";
import Landing from "./components/Landing";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (location.pathname === path) return;
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 2000); s
  };

  const title = location.pathname === "/snapshot" ? "SNAPSHOT TOOL" : location.pathname === "/wallet-checker" ? "WALLET CHECKER TOOL" : "";
  const subheading = title ? "(Monad Testnet)" : "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <Header handleNavigation={handleNavigation} title={title} subheading={subheading} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing setIsNavLoading={setIsLoading} handleNavigation={handleNavigation} />} />
          <Route path="/snapshot" element={<SnapshotTool setIsNavLoading={setIsLoading} />} />
          <Route path="/wallet-checker" element={<WalletCheckerTool setIsNavLoading={setIsLoading} />} />
        </Routes>
      </div>
      <footer>
        <div className="copyright">© 2025</div>
        <div className="powered-by">Powered by OctoNads</div>
        <div className="social-icons">
          <a href="https://x.com/OctoNads" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter social-logo" aria-label="Twitter"></i>
          </a>
          <a href="https://discord.gg/C6EefTRpzd" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-discord social-logo" aria-label="Discord"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;