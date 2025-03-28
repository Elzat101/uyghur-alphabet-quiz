import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ModeSelection from "./components/ModeSelection";
import Home from "./components/Home";
import Learn from "./components/Learn";
import Quiz from "./components/Quiz";
import Practice from "./components/Practice";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Profile from "./components/Profile";
import StatsSelection from "./components/StatsSelection";
import StatsView from "./components/StatsView";
import SelectCategoryScreen from "./components/SelectCategoryScreen";
import StatsCommonWordsSelect from "./components/StatsCommonWordsSelect"; // adjust path
import "./styles/general.css";
import "./styles/navbar.css";
import "./styles/learn.css";
import "./styles/flashcards.css";
import "./styles/buttons.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [learningMode, setLearningMode] = useState(
    localStorage.getItem("learningMode") || null
  );
  const [stage, setStage] = useState("login");
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

  return (
    <Router>
      <Navbar />
      <div className="app">
        {stage !== "login" && (
          <Navbar
            user={user}
            learningMode={learningMode}
            onNavigate={setStage}
            onSwitchMode={() => setStage("modeSelect")}
          />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />

          <Route path="/select-category" element={<SelectCategoryScreen />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route path="/learn" element={<Learn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/" element={<ModeSelection />} />

          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                learningMode={learningMode}
                onLogout={handleLogout}
                onLogin={() => setStage("login")}
              />
            }
          />
          <Route
            path="/stats"
            element={<StatsSelection learningMode={learningMode} />}
          />
          <Route
            path="/stats/:category"
            element={<StatsView learningMode={learningMode} />}
          />
          <Route
            path="/modeSelect"
            element={<ModeSelection onSelectMode={handleModeSelect} />}
          />
          <Route path="/home" element={<Home />} />

          {/* Uyghur Mode */}
          <Route
            path="/learn"
            element={
              <Learn
                category={selectedCategory}
                onBack={() => setStage("home")}
              />
            }
          />
          <Route
            path="/quiz"
            element={
              <Quiz
                category={selectedCategory}
                onBack={() => setStage("home")}
              />
            }
          />
          <Route
            path="/stats/commonWordsSelect"
            element={<StatsCommonWordsSelect />}
          />
          <Route
            path="/practice"
            element={
              <Practice
                category={selectedCategory}
                onBack={() => setStage("home")}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
