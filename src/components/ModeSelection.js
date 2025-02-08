import React from "react";

export default function ModeSelection({
  selectedMode,
  onSelectCategory,
  onBack,
}) {
  return (
    <div className="mode-selection">
      <h2>Choose a Category</h2>
      <p>What do you want to {selectedMode}?</p>
      <div className="options">
        <button onClick={() => onSelectCategory("letters")}>🔤 Letters</button>
        <button onClick={() => onSelectCategory("numbers")}>🔢 Numbers</button>
        <button onClick={() => onSelectCategory("phrases")}>
          🗣️ Common Phrases
        </button>
      </div>
      <button className="back-button" onClick={onBack}>
        🔙 Back
      </button>
    </div>
  );
}
