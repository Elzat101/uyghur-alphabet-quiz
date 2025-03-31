import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/authUtils";

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="profile">
      <h2>Profile</h2>
      {user ? (
        <>
          <p>Welcome, {user}!</p>
          <button onClick={() => navigate("/stats")}>View Stats</button>
          <button
            onClick={() => {
              logoutUser(); // ✅ Clear user and progress
              onLogout();
              navigate("/home");
            }}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <p>You are a guest.</p>
        </>
      )}
      <button className="back-button" onClick={() => navigate("/")}>
        Exit
      </button>
    </div>
  );
}
