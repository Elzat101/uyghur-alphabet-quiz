import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [learningMode, setLearningMode] = useState("Uyghur"); // Default to Uyghur

  useEffect(() => {
    const mode = localStorage.getItem("learningMode") || "Uyghur";
    setLearningMode(mode);
  }, []);

  const handleSelectCategory = (category, mode) => {
    localStorage.setItem("selectedCategory", category); // ✅ Update localStorage
    navigate(`/${mode}`); // ✅ Navigate to the selected mode (learn, quiz, or practice)
  };

  return (
    <div className="home">
      {selectedMode === null ? (
        <>
          <h2>{learningMode} Learning Mode</h2>
          <p>Select a mode to begin!</p>
          <button onClick={() => setSelectedMode("learn")}>📚 Learn</button>
          <button onClick={() => setSelectedMode("quiz")}>🎯 Quiz</button>
          <button onClick={() => setSelectedMode("practice")}>
            🃏 Practice
          </button>
        </>
      ) : (
        <>
          <h2>Select Category</h2>
          <p>Choose what to practice:</p>
          {learningMode === "Uyghur" && (
            <button
              onClick={() => handleSelectCategory("letters", selectedMode)}
            >
              🔠 Letters
            </button>
          )}
          <button onClick={() => handleSelectCategory("numbers", selectedMode)}>
            🔢 Numbers
          </button>
          <button
            onClick={() => handleSelectCategory("commonWords", selectedMode)}
          >
            🗣️ Common Words
          </button>

          <button className="back-button" onClick={() => setSelectedMode(null)}>
            🔙 Back
          </button>
        </>
      )}
    </div>
  );
}
