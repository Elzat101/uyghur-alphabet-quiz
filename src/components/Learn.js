import React, { useEffect, useState } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";

export default function Learn({ category, onBack }) {
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    let newDataSet = [];
    if (category === "letters") newDataSet = [...alphabetQuestions];
    if (category === "numbers") newDataSet = [...numbersData];
    if (category === "phrases") newDataSet = [...commonWords];

    setDataSet(newDataSet);
  }, [category]);

  if (dataSet.length === 0) return <p>Loading...</p>;

  return (
    <div className="learn">
      <h2>Learn - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="grid-5">
        {dataSet.map((item, index) => (
          <div key={index} className="card">
            <p className="uyghur">{item.questionText || item.uyghur}</p>
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
