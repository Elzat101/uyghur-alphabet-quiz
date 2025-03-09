import React, { useState } from "react";

export default function ULYHome({ onSelectMode }) {
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="uly-home">
      {selectedMode === null ? (
        <>
          <h2>ULY Learning Mode</h2>
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
          <button onClick={() => onSelectMode(selectedMode, "numbers")}>
            🔢 Numbers
          </button>
          <button onClick={() => onSelectMode(selectedMode, "commonWords")}>
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
