import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";

const ulyCategories = [
  { name: "Food", key: "food" },
  { name: "Animals", key: "animals" },
  { name: "School", key: "school" },
  { name: "Family", key: "family" },
  { name: "Greetings", key: "greetings" },
  { name: "Verbs", key: "verbs" },
];

export default function StatsView() {
  const navigate = useNavigate();
  const { category } = useParams();
  const learningMode = localStorage.getItem("learningMode") || "Uyghur";
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedStats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setStats(storedStats);

    if (learningMode === "Uyghur") {
      if (category === "letters") setData([...alphabetQuestions]);
      else if (category === "numbers") setData([...numbersData]);
      else if (category === "commonWords") setData([...commonWords]);
    } else {
      if (category === "numbers") setData([...ULYNumbers]);
      else if (category === "commonWords")
        setData([]); // grid view for subcategories
      else if (ULYCommonWords[category]) setData([...ULYCommonWords[category]]);
    }
  }, [category, learningMode]);

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

  const renderGridSelector = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Select a Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ulyCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => navigate(`/stats/${cat.key}`)}
            className="bg-blue-700 text-white py-3 px-4 rounded-2xl shadow hover:bg-blue-800 transition"
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/stats")}
          className="text-sm text-gray-600 underline"
        >
          Back
        </button>
      </div>
    </div>
  );

  if (learningMode === "ULY" && category === "commonWords") {
    return renderGridSelector();
  }

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
