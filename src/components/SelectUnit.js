// ✅ SelectUnit.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { learningPath } from "./progression/learningPath";

export default function SelectUnit() {
  const navigate = useNavigate();

  const handleUnitSelect = (unitId) => {
    localStorage.setItem("selectedUnit", unitId);
    navigate("/select-lesson");
  };

  return (
    <div className="unit-select">
      <h2>Select Unit</h2>
      {learningPath.map((unit) => (
        <button key={unit.id} onClick={() => handleUnitSelect(unit.id)}>
          {unit.name}
        </button>
      ))}
    </div>
  );
}
