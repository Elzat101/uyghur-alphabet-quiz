import React from "react";

export default function Navbar({
  user,
  learningMode,
  onNavigate,
  onSwitchMode,
}) {
  return (
    <nav className="navbar">
      <button onClick={() => onNavigate("home")}>Home</button>
      <button onClick={onSwitchMode}>Switch Learning Mode</button>
      <button onClick={() => onNavigate("profile")}>
        {user ? `Profile (${user})` : "Profile"}
      </button>
    </nav>
  );
}
