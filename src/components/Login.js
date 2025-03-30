import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/buttons.css";
import "../styles/general.css";

export default function Login({ onLogin, onLogout }) {
  const [screen, setScreen] = useState("start");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetUsername, setResetUsername] = useState("");

  const navigate = useNavigate();
  const users = JSON.parse(localStorage.getItem("users")) || {};

  const resetFields = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setResetUsername("");
    setError("");
  };

  const handleLogin = () => {
    if (users[username] === password) {
      onLogin(username);
      navigate("/home");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleCreateAccount = () => {
    if (users[username]) {
      setError("Username already exists");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      onLogin(username);
      navigate("/home");
    }
  };

  const handleResetRequest = () => {
    if (users[resetUsername]) {
      setScreen("resetPassword");
      resetFields();
    } else {
      setError("Username not found");
    }
  };

  const handlePasswordReset = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      users[resetUsername] = password;
      localStorage.setItem("users", JSON.stringify(users));
      setScreen("login");
      resetFields();
    }
  };

  return (
    <div className="login-screen app">
      {screen === "start" && (
        <>
          <h1>Welcome to the Uyghur Language Learning App</h1>
          <p>Choose how you'd like to begin:</p>
          <div className="button-container">
            <button
              onClick={() => {
                onLogout();
                navigate("/home");
              }}
            >
              Continue as Guest
            </button>
            <button
              onClick={() => {
                setScreen("login");
                resetFields();
              }}
            >
              Log In
            </button>
          </div>
        </>
      )}

      {screen === "login" && (
        <>
          <h2>Log In</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Log In</button>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("createAccount");
              resetFields();
            }}
          >
            Create an Account
          </p>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("resetRequest");
              resetFields();
            }}
          >
            Reset Password
          </p>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("start");
              resetFields();
            }}
          >
            Back
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {screen === "createAccount" && (
        <>
          <h2>Create an Account</h2>
          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button onClick={handleCreateAccount}>Create Account</button>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("login");
              resetFields();
            }}
          >
            Back to Log In
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {screen === "resetRequest" && (
        <>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Enter Username"
            value={resetUsername}
            onChange={(e) => setResetUsername(e.target.value)}
          />
          <button onClick={handleResetRequest}>Next</button>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("login");
              resetFields();
            }}
          >
            Back to Log In
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {screen === "resetPassword" && (
        <>
          <h2>Enter New Password</h2>
          <div className="input-container">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button onClick={handlePasswordReset}>Set New Password</button>
          <p
            className="clickable-text"
            onClick={() => {
              setScreen("login");
              resetFields();
            }}
          >
            Back to Log In
          </p>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}
