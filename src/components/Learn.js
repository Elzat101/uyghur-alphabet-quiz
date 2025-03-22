import React, { useEffect, useState } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";
import { useNavigate } from "react-router-dom";

export default function Learn({ onBack }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [ulyMode, setUlyMode] = useState(false);
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    const selectedCategory =
      localStorage.getItem("selectedCategory") || "numbers";
    const learningMode = localStorage.getItem("learningMode") || "Uyghur";
    setCategory(selectedCategory);
    setUlyMode(learningMode === "ULY");

    let newDataSet = [];
    if (!ulyMode) {
      if (selectedCategory === "letters") newDataSet = [...alphabetQuestions];
      if (selectedCategory === "numbers") newDataSet = [...numbersData];
      if (selectedCategory === "commonWords") newDataSet = [...commonWords];
    } else {
      if (selectedCategory === "numbers") newDataSet = [...ULYNumbers];
      else if (ULYCommonWords[selectedCategory]) {
        newDataSet = [...ULYCommonWords[selectedCategory]];
      }
    }

    setDataSet(newDataSet);
  }, [ulyMode]);

  if (dataSet.length === 0) return <p>Loading...</p>;

  return (
    <div className="learn">
      <h2>Learn - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="grid-container">
        {dataSet.map((item, index) => (
          <div key={index} className="card">
            <p className="uyghur">
              {item.uly ? item.uly : item.questionText || item.uyghur}
            </p>
            <p className="latin">{item.correctAnswer}</p>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate("/home")}>
        Back
      </button>
    </div>
  );
}
