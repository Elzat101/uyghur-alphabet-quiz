import React from "react";

export default function Profile({ user, learningMode, onLogout, onLogin }) {
  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user ? (
        <>
          <p>
            Logged in as: <strong>{user}</strong>
          </p>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <p>You are a guest. Log in to save progress.</p>
          <button onClick={onLogin}>Log In</button>
        </>
      )}
      <p>
        <strong>Current Learning Mode:</strong>{" "}
        {learningMode === "uly" ? "ULY (Uyghur Latin Alphabet)" : "Uyghur Mode"}
      </p>
    </div>
  );
}
