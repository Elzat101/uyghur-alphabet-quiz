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

  const handleSelectCategory = (mode) => {
    localStorage.setItem("learningType", mode);
    navigate("/select-unit");
  };

  return (
    <div className="home">
      {selectedMode === null ? (
        <>
          <h2>{learningMode} Learning Mode</h2>
          <p>Select a mode to begin!</p>
          <button onClick={() => handleSelectCategory("learn")}>
            📚 Learn
          </button>
          <button onClick={() => handleSelectCategory("quiz")}>🎯 Quiz</button>
          <button onClick={() => handleSelectCategory("practice")}>
            🃏 Practice
          </button>
        </>
      ) : (
        <>
          <h2>Loading unit options...</h2>
          <button className="back-button" onClick={() => setSelectedMode(null)}>
            Back
          </button>
        </>
      )}
    </div>
  );
}
