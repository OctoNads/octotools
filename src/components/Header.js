import React from "react";
import "../App.css";

const Header = ({ title, subheading, handleNavigation }) => {
  return (
    <header className="sticky-header">
      <div className="header-left">
        <div onClick={() => handleNavigation("/")}>
          <img
            src="https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq"
            alt="OctoNads Logo"
            className="header-logo"
          />
        </div>
      </div>
      <div className="header-center">
        {title && (
          <div className="header-title">
            <h1>{title}</h1>
            {subheading && <h2 className="subheading">{subheading}</h2>}
          </div>
        )}
      </div>
      <div className="header-right">
        <button
          onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSeLVfvnIiwA03MKEeTzyPDB8DN_J_1qVyTbvijeHnBzrtpF0g/viewform?usp=dialog", "_blank")}
          className="top-right-button"
          aria-label="Upload Project"
        >
          <span className="button-text">Upload Project ?</span>
          <i className="fas fa-upload button-icon"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;