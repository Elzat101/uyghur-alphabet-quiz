import React, { useState, useEffect } from "react";
import ModeSelection from "./components/ModeSelection";
import StartScreen from "./components/StartScreen";
import ULYHome from "./components/ULYHome";
import Learn from "./components/Learn";
import Quiz from "./components/Quiz";
import Practice from "./components/Practice";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Profile from "./components/Profile";

export default function App() {
  const [user, setUser] = useState(null);
  const [learningMode, setLearningMode] = useState(
    localStorage.getItem("learningMode") || null
  );
  const [stage, setStage] = useState("login");
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setUser(savedUser);
      setStage("modeSelect");
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("loggedInUser", username);
    setStage("modeSelect");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    setStage("login");
  };

  const handleModeSelect = (mode) => {
    setLearningMode(mode);
    localStorage.setItem("learningMode", mode);
    setStage("home");
  };

  const handleLearningModeSelection = (mode, category) => {
    setSelectedMode(mode);
    setSelectedCategory(category);
    setStage(mode);
  };

  return (
    <div className="app">
      {stage !== "login" && (
        <Navbar
          user={user}
          learningMode={learningMode}
          onNavigate={setStage}
          onSwitchMode={() => setStage("modeSelect")}
        />
      )}

      {stage === "login" && <Login onLogin={handleLogin} />}
      {stage === "profile" && (
        <Profile
          user={user}
          learningMode={learningMode}
          onLogout={handleLogout}
          onLogin={() => setStage("login")}
        />
      )}

      {stage === "modeSelect" && (
        <ModeSelection onSelectMode={handleModeSelect} />
      )}

      {stage === "home" &&
        (learningMode === "uyghur" ? (
          <StartScreen onSelectMode={handleLearningModeSelection} />
        ) : (
          <ULYHome onSelectMode={handleLearningModeSelection} />
        ))}

      {/* Uyghur Mode */}
      {learningMode === "uyghur" && stage === "learn" && (
        <Learn category={selectedCategory} onBack={() => setStage("home")} />
      )}
      {learningMode === "uyghur" && stage === "quiz" && (
        <Quiz category={selectedCategory} onBack={() => setStage("home")} />
      )}
      {learningMode === "uyghur" && stage === "practice" && (
        <Practice category={selectedCategory} onBack={() => setStage("home")} />
      )}

      {/* ULY Mode */}
      {learningMode === "uly" && stage === "learn" && (
        <Learn
          category={selectedCategory}
          ulyMode={true}
          onBack={() => setStage("home")}
        />
      )}
      {learningMode === "uly" && stage === "quiz" && (
        <Quiz
          category={selectedCategory}
          ulyMode={true}
          onBack={() => setStage("home")}
        />
      )}
      {learningMode === "uly" && stage === "practice" && (
        <Practice
          category={selectedCategory}
          ulyMode={true}
          onBack={() => setStage("home")}
        />
      )}
    </div>
  );
}
