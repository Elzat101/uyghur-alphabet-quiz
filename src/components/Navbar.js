import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, learningMode }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button onClick={() => navigate("/home")}>Home</button>
      <button onClick={() => navigate("/modeSelect")}>Switch Mode</button>
      <button onClick={() => navigate("/profile")}>
        {user ? `Profile (${user})` : "Profile (Guest)"}
      </button>
    </nav>
  );
}
