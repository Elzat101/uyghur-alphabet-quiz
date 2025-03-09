import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="profile">
      <h2>Profile</h2>
      {user ? (
        <>
          <p>Welcome, {user}!</p>
          <button onClick={() => navigate("/stats")}>View Stats</button>
          <button onClick={onLogout}>Log Out</button>
        </>
      ) : (
        <>
          <p>You are a guest.</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </>
      )}
      <button className="back-button" onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
}
