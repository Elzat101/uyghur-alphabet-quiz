import React, { useEffect, useState } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";

export default function Learn({ category, ulyMode, onBack }) {
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    let newDataSet = [];
    if (!ulyMode) {
      if (category === "letters") newDataSet = [...alphabetQuestions];
      if (category === "numbers") newDataSet = [...numbersData];
      if (category === "commonWords") newDataSet = [...commonWords];
    } else {
      if (category === "numbers") newDataSet = [...ULYNumbers];
      if (category === "commonWords") newDataSet = [...ULYCommonWords];
    }

    setDataSet(newDataSet);
  }, [category, ulyMode]);

  if (dataSet.length === 0) return <p>Loading...</p>;

  return (
    <div className="learn">
      <h2>Learn - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="grid-container">
        {dataSet.map((item, index) => (
          <div key={index} className="card">
            <p className="uyghur">
              {ulyMode ? item.uly : item.questionText || item.uyghur}
            </p>
            <p className="latin">{item.correctAnswer}</p>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
