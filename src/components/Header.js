import React from "react";
import "../App.css";

const Header = ({ title, subheading, handleNavigation }) => {
  return (
    <header className="sticky-header">
      <div onClick={() => handleNavigation("/")}>
        <img
          src="https://amethyst-worthy-gayal-734.mypinata.cloud/ipfs/bafkreiguhll5qwfac6x36v362nv2mhgl7so45dd262zpulwq7c4tfwbedq"
          alt="OctoNads Logo"
          className="header-logo"
        />
      </div>
      {title && (
        <div className="header-title">
          <h1>{title}</h1>
          {subheading && <h2 className="subheading">{subheading}</h2>}
        </div>
      )}
      <div className="header-spacer"></div>
    </header>
  );
};

export default Header;