import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import ModeSelection from "./components/ModeSelection";
import Learn from "./components/Learn";
import Quiz from "./components/Quiz";
import Practice from "./components/Practice";

export default function App() {
  const [stage, setStage] = useState("start"); // Controls what screen to show
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Step 1: User clicks Learn, Quiz, or Practice
  const handleModeSelect = (newStage, mode) => {
    setStage(newStage);
    setSelectedMode(mode);
  };

  // Step 2: User selects "Letters", "Numbers", or "Phrases"
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStage(selectedMode); // Move to Learn, Quiz, or Practice based on selection
  };

  return (
    <div className="app">
      {stage === "start" && <StartScreen onSelectMode={handleModeSelect} />}
      {stage === "modeSelect" && (
        <ModeSelection
          selectedMode={selectedMode}
          onSelectCategory={handleCategorySelect}
          onBack={() => setStage("start")}
        />
      )}
      {stage === "learn" && (
        <Learn
          category={selectedCategory}
          onBack={() => setStage("modeSelect")}
        />
      )}
      {stage === "quiz" && (
        <Quiz
          category={selectedCategory}
          onBack={() => setStage("modeSelect")}
        />
      )}
      {stage === "practice" && (
        <Practice
          category={selectedCategory}
          onBack={() => setStage("modeSelect")}
        />
      )}
    </div>
  );
}
