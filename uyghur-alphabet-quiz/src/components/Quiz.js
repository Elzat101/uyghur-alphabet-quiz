import React, { useState, useEffect } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";

export default function Quiz({ category, ulyMode, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);

  useEffect(() => {
    let selectedQuestions = [];
    let answerPool = [];

    if (!ulyMode) {
      if (category === "letters") {
        selectedQuestions = [...alphabetQuestions];
        answerPool = alphabetQuestions.map((q) => q.correctAnswer);
      }
      if (category === "numbers") {
        selectedQuestions = [...numbersData];
        answerPool = numbersData.map((q) => q.correctAnswer);
      }
      if (category === "commonWords") {
        selectedQuestions = [...commonWords];
        answerPool = commonWords.map((q) => q.correctAnswer);
      }
    } else {
      if (category === "numbers") {
        selectedQuestions = [...ULYNumbers];
        answerPool = ULYNumbers.map((q) => q.correctAnswer);
      }
      if (category === "commonWords") {
        selectedQuestions = [...ULYCommonWords];
        answerPool = ULYCommonWords.map((q) => q.correctAnswer);
      }
    }

    selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

    if (selectedAmount) {
      selectedQuestions = selectedQuestions.slice(0, selectedAmount);
    }

    setQuestions(
      selectedQuestions.map((q) => ({
        ...q,
        options: generateAnswerChoices(q.correctAnswer, answerPool),
      }))
    );
  }, [category, selectedAmount, ulyMode]);

  const generateAnswerChoices = (correctAnswer, answerPool) => {
    let wrongAnswers = answerPool.filter((a) => a !== correctAnswer);
    wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
  };

  if (!selectedAmount) {
    return (
      <div className="quiz">
        <h2>Select Number of Questions</h2>
        <div className="grid">
          {[5, 10, 15, questions.length].map((num, index) => (
            <button key={index} onClick={() => setSelectedAmount(num)}>
              {num === questions.length ? "All" : num} Questions
            </button>
          ))}
        </div>
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  if (questions.length === 0)
    return <p className="loading-text">Loading questions...</p>;

  const handleAnswerClick = (answer) => {
    setAnswers([
      ...answers,
      {
        question: ulyMode
          ? questions[currentQuestion].uly
          : questions[currentQuestion].questionText,
        correct: questions[currentQuestion].correctAnswer,
        selected: answer,
      },
    ]);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowReview(true);
    }
  };

  return (
    <div className="quiz">
      <button className="back-button" onClick={onBack}>
        Back
      </button>

      {showReview ? (
        <div className="review">
          <h2 className="big-text">
            Quiz Complete! Score: {score} / {questions.length}
          </h2>
          <ul className="review-list">
            {answers.map((ans, index) => (
              <li
                key={index}
                className="review-item"
                style={{
                  color: ans.selected === ans.correct ? "green" : "red",
                }}
              >
                {ans.question} - Your Answer: {ans.selected} | Correct:{" "}
                {ans.correct}
              </li>
            ))}
          </ul>
          <button onClick={onBack}>Back</button>
        </div>
      ) : (
        <>
          <h2 className="big-text">
            Quiz - {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          <p className="question-text">
            {ulyMode
              ? questions[currentQuestion].uly
              : questions[currentQuestion].questionText}
          </p>

          <div className="grid">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
