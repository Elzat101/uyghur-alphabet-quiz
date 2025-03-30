import React, { useState, useEffect } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";
import { useNavigate } from "react-router-dom";

export default function Practice({ category, ulyMode, onBack }) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedCategory =
    localStorage.getItem("selectedCategory") || "numbers";
  const [dataSet, setDataSet] = useState([]);
  const learningMode = localStorage.getItem("learningMode") || "Uyghur";

  // ✅ **Use `useEffect` to update dataset whenever `ulyMode` or `selectedCategory` changes**
  useEffect(() => {
    let newDataSet = [];
    if (learningMode === "Uyghur") {
      if (selectedCategory === "letters") newDataSet = [...alphabetQuestions];
      if (selectedCategory === "numbers") newDataSet = [...numbersData];
      if (selectedCategory === "commonWords") newDataSet = [...commonWords];
    } else {
      if (selectedCategory === "numbers") newDataSet = [...ULYNumbers];
      if (ULYCommonWords[selectedCategory]) {
        newDataSet = [...ULYCommonWords[selectedCategory]];
      }
    }

    setDataSet(newDataSet);
    setCurrentIndex(0); // ✅ Reset index when dataset changes
  }, [ulyMode, learningMode, selectedCategory]); // ✅ Runs whenever ULY mode or category changes

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dataSet.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dataSet.length - 1 : prevIndex - 1
    );
  };

  const shuffleCards = () => {
    setFlipped(false);
    const shuffledData = [...dataSet].sort(() => Math.random() - 0.5);
    setDataSet(shuffledData); // 🔹 **Fix: Now actually updates the dataset**
    setCurrentIndex(0);
  };

  return (
    <div className="practice">
      <h2>
        Practice -{" "}
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h2>
      <div className="flashcard-container">
        <div className="flashcard" onClick={() => setFlipped(!flipped)}>
          <p className="flashcard-text">
            {flipped
              ? dataSet[currentIndex]?.correctAnswer || "⚠️ No Data"
              : ulyMode
              ? dataSet[currentIndex]?.uly || "⚠️ No ULY Data"
              : dataSet[currentIndex]?.questionText ||
                dataSet[currentIndex]?.uyghur ||
                dataSet[currentIndex]?.uly}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ width: "120px" }} onClick={prevCard}>
            ←
          </button>
          <button style={{ width: "120px" }} onClick={nextCard}>
            →
          </button>
        </div>
        <button onClick={shuffleCards} style={{ width: "250px" }}>
          Shuffle
        </button>
        <button
          className="back-button"
          style={{ marginTop: "-10px", width: "250px" }}
          onClick={() => navigate("/home")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
