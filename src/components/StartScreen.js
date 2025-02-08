import React from "react";

export default function StartScreen({ onSelectMode }) {
  return (
    <div className="start-screen">
      <h1>Uyghur Language Learning</h1>
      <p>Select a mode to begin!</p>
      <div className="options">
        <button onClick={() => onSelectMode("modeSelect", "learn")}>
          📚 Learn
        </button>
        <button onClick={() => onSelectMode("modeSelect", "quiz")}>
          🎯 Quiz
        </button>
        <button onClick={() => onSelectMode("modeSelect", "practice")}>
          🃏 Practice
        </button>
      </div>
    </div>
  );
}
