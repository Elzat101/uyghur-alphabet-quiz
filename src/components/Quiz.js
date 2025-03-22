import React, { useState, useEffect } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";
import { useNavigate } from "react-router-dom";

export default function Quiz({ category, onBack }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const learningMode = localStorage.getItem("learningMode") || "Uyghur";
  const ulyMode = learningMode === "ULY";
  const selectedCategory =
    localStorage.getItem("selectedCategory") || "numbers";

  useEffect(() => {
    let selectedQuestions = [];
    let answerPool = [];

    if (learningMode === "Uyghur") {
      if (selectedCategory === "letters") {
        selectedQuestions = [...alphabetQuestions];
        answerPool = alphabetQuestions.map((q) => q.correctAnswer);
      }
      if (selectedCategory === "numbers") {
        selectedQuestions = [...numbersData];
        answerPool = numbersData.map((q) => q.correctAnswer);
      }
      if (selectedCategory === "commonWords") {
        selectedQuestions = [...commonWords];
        answerPool = commonWords.map((q) => q.correctAnswer);
      }
    } else {
      if (selectedCategory === "numbers") {
        selectedQuestions = [...ULYNumbers];
        answerPool = ULYNumbers.map((q) => q.correctAnswer);
      }
      if (ULYCommonWords[selectedCategory]) {
        selectedQuestions = [...ULYCommonWords[selectedCategory]];
        answerPool = ULYCommonWords[selectedCategory].map(
          (q) => q.correctAnswer
        );
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
  }, [selectedCategory, selectedAmount, ulyMode, learningMode]);

  const generateAnswerChoices = (correctAnswer, answerPool) => {
    let wrongAnswers = answerPool.filter((a) => a !== correctAnswer);
    wrongAnswers = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
  };

  const loadStats = () => {
    const storedStats = localStorage.getItem("quizStats");
    return storedStats ? JSON.parse(storedStats) : {};
  };

  const saveStats = (newStats) => {
    localStorage.setItem("quizStats", JSON.stringify(newStats));
  };

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return; // Prevent double-click

    const current = questions[currentQuestion];
    const isCorrect = answer === current.correctAnswer;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    setAnswers([
      ...answers,
      {
        question: ulyMode
          ? current.uly
          : current.uyghur || current.questionText,
        correct: current.correctAnswer,
        selected: answer,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
      const stats = loadStats();
      const key = `${ulyMode ? "ULY" : "Uyghur"}-${selectedCategory}-${
        ulyMode ? current.uly : current.uyghur || current.questionText
      }`;
      if (!stats[key]) stats[key] = 0;
      if (stats[key] < 10) stats[key] += 1;
      saveStats(stats);
    }
  };

  const handleNext = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowReview(true);
    }
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
        <button className="back-button" onClick={() => navigate("/home")}>
          Exit
        </button>
      </div>
    );
  }

  if (questions.length === 0)
    return <p className="loading-text">Loading questions...</p>;

  const currentQ = questions[currentQuestion];
  const questionText = ulyMode
    ? currentQ.uly
    : currentQ.questionText || currentQ.uyghur;

  return (
    <div className="quiz">
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
          <button className="back-button" onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      ) : (
        <>
          <h2 className="big-text">
            Quiz -{" "}
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </h2>
          <p className="question-text">{questionText}</p>

          <div className="grid">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={!!selectedAnswer}
                style={{
                  backgroundColor:
                    showFeedback && option === currentQ.correctAnswer
                      ? "#28a745"
                      : showFeedback && option === selectedAnswer
                      ? "#dc3545"
                      : "",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="feedback">
              <p>
                {selectedAnswer === currentQ.correctAnswer
                  ? "✅ Correct!"
                  : "❌ Incorrect."}
              </p>
              {selectedAnswer !== currentQ.correctAnswer && (
                <p>
                  Correct Answer: <strong>{currentQ.correctAnswer}</strong>
                </p>
              )}
              <button onClick={handleNext}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
