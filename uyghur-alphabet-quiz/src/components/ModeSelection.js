import React from "react";

export default function ModeSelection({ onSelectMode }) {
  return (
    <div className="mode-selection">
      <h2>Select Your Learning Mode</h2>
      <button onClick={() => onSelectMode("uyghur")}>Uyghur Mode</button>
      <button onClick={() => onSelectMode("uly")}>ULY Mode</button>
    </div>
  );
}
