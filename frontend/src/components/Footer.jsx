import React from "react";
import "../styles/Footer.css";

const Footer = ({ onScroll }) => {
  return (
    <div className="footer">
      <div className="bt-prev" onClick={() => onScroll(-1)}>
        <i className="bi bi-chevron-up"></i>
      </div>
      <div className="bt-next" onClick={() => onScroll(1)}>
        <i className="bi bi-chevron-down"></i>
      </div>
    </div>
  );
};

export default Footer;
