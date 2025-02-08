import React from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";

export default function Learn({ category, onBack }) {
  let dataSet =
    category === "letters"
      ? alphabetQuestions
      : category === "numbers"
      ? numbersData
      : commonWords;

  if (!category) return <p>Error: No category selected</p>;

  return (
    <div className="learn">
      <h2>Learn - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="grid-5">
        {dataSet.map((item, index) => (
          <div key={index} className="card">
            <p className="uyghur">{item.uyghur || item.questionText}</p>
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
