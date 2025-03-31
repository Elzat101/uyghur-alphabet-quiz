import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <span className="navbar-title">Uyghur Language App</span>
        <div className="navbar-right">
          <button
            className="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </div>

      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        <button onClick={() => handleNavClick("/home")}>Home</button>
        <button onClick={() => handleNavClick("/progression")}>
          Progression
        </button>
        <button onClick={() => handleNavClick("/modeSelect")}>
          Switch Mode
        </button>
        <button onClick={() => handleNavClick("/profile")}>Profile</button>
      </div>
    </nav>
  );
}
