import React from "react";
import { useNavigate } from "react-router-dom";

export default function StatsSelection() {
  const navigate = useNavigate();
  const learningMode = localStorage.getItem("learningMode") || "Uyghur";

  return (
    <div className="stats-selection">
      <h2>Select a Category</h2>

      {learningMode === "Uyghur" && (
        <button onClick={() => navigate("/stats/letters")}>Letters</button>
      )}
      <button onClick={() => navigate("/stats/numbers")}>Numbers</button>
      <button onClick={() => navigate("/stats/commonWords")}>
        Common Words
      </button>
      <button className="back-button" onClick={() => navigate("/profile")}>
        Back
      </button>
    </div>
  );
}
