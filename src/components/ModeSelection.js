import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModeSelection() {
  const navigate = useNavigate();

  const handleSelectMode = (mode) => {
    localStorage.setItem("learningMode", mode);
    if (mode === "Uyghur") {
      navigate("/home"); // ✅ Navigates to Uyghur Home
    } else {
      navigate("/home"); // ✅ Navigates to ULY Home
    }
  };

  return (
    <div className="mode-selection">
      <h2>Select Your Learning Mode</h2>
      <button onClick={() => handleSelectMode("Uyghur")}>Uyghur Mode</button>
      <button onClick={() => handleSelectMode("ULY")}>ULY Mode</button>
    </div>
  );
}
