import React, { useState } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";

export default function Practice({ category, onBack }) {
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataSet, setDataSet] = useState(
    category === "letters"
      ? [...alphabetQuestions]
      : category === "numbers"
      ? [...numbersData]
      : [...commonWords]
  );

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dataSet.length);
  };

  const shuffleCards = () => {
    setFlipped(false);
    const shuffledData = [...dataSet].sort(() => Math.random() - 0.5);
    setDataSet(shuffledData);
    setCurrentIndex(0);
  };

  return (
    <div className="practice">
      <h2>Practice - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className="flashcard-container">
        <div className="flashcard" onClick={() => setFlipped(!flipped)}>
          <p className="flashcard-text">
            {flipped
              ? dataSet[currentIndex].correctAnswer
              : dataSet[currentIndex].uyghur ||
                dataSet[currentIndex].questionText}
          </p>
        </div>
      </div>
      <button onClick={nextCard}>Next</button>
      <button onClick={shuffleCards}>Shuffle</button>
      <button className="back-button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
