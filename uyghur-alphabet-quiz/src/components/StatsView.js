import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";

export default function StatsView() {
  const navigate = useNavigate();
  const { category } = useParams();
  const learningMode = localStorage.getItem("learningMode") || "Uyghur";
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedStats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setStats(storedStats);

    // ✅ Load correct dataset
    if (learningMode === "Uyghur") {
      if (category === "letters") setData([...alphabetQuestions]);
      if (category === "numbers") setData([...numbersData]);
      if (category === "commonWords") setData([...commonWords]);
    } else {
      if (category === "numbers") setData([...ULYNumbers]);
      if (category === "commonWords") setData([...ULYCommonWords]);
    }
  }, [category, learningMode]);

  // ✅ Reset Stats for Displayed Category
  const resetStats = () => {
    const updatedStats = { ...stats };
    data.forEach((item) => {
      const key = `${learningMode}-${category}-${
        item.questionText || item.uly
      }`;
      updatedStats[key] = 0;
    });
    setStats(updatedStats);
    localStorage.setItem("quizStats", JSON.stringify(updatedStats));
  };

  return (
    <div className="stats-view">
      <h2>Progress - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="grid-container">
        {data.map((item, index) => {
          const key = `${learningMode}-${category}-${
            item.questionText || item.uly
          }`;
          const score = stats[key] || 0;
          const isMastered = score === 10;

          return (
            <div
              key={index}
              className="card"
              style={{ backgroundColor: isMastered ? "#4CAF50" : "" }}
            >
              <p className="uyghur">{item.questionText || item.uly}</p>
              <p className="latin">{item.correctAnswer}</p>
              <p>{isMastered ? "10/10 Mastered!" : `${score}/10`}</p>
            </div>
          );
        })}
      </div>
      <button className="reset-button" onClick={resetStats}>
        Reset Stats
      </button>
      <button className="back-button" onClick={() => navigate("/profile")}>
        Back
      </button>
    </div>
  );
}
