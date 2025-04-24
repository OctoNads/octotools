import React, { useEffect } from "react";
import "../App.css";

const Landing = ({ setIsNavLoading, handleNavigation }) => {
  useEffect(() => {
    setIsNavLoading(false); // Reset loading state on mount
  }, [setIsNavLoading]);

  return (
    <div className="landing-container">
      <h1>Welcome to OctoNads Tools</h1>
      <div className="button-group">
        <button className="tool-button" onClick={() => handleNavigation("/snapshot")}>
          SNAPSHOT TOOL
        </button>
        <button className="tool-button" onClick={() => handleNavigation("/wallet-checker")}>
          WALLET CHECKER TOOL
        </button>
      </div>
    </div>
  );
};

export default Landing;