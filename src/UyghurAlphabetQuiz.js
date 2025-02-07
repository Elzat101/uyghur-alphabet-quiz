import React, { useState, useEffect } from "react";
import "./styles.css"; // Ensure your CSS file exists

const allQuestions = [
  { questionText: "ا", correctAnswer: "A" },
  { questionText: "ب", correctAnswer: "B" },
  { questionText: "پ", correctAnswer: "P" },
  { questionText: "ت", correctAnswer: "T" },
  { questionText: "ج", correctAnswer: "J" },
  { questionText: "چ", correctAnswer: "Ch" },
  { questionText: "خ", correctAnswer: "X" },
  { questionText: "د", correctAnswer: "D" },
  { questionText: "ر", correctAnswer: "R" },
  { questionText: "ز", correctAnswer: "Z" },
  { questionText: "ژ", correctAnswer: "Zh" },
  { questionText: "س", correctAnswer: "S" },
  { questionText: "ش", correctAnswer: "Sh" },
  { questionText: "غ", correctAnswer: "Gh" },
  { questionText: "ف", correctAnswer: "F" },
];

export default function UyghurAlphabetQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const shuffledQuestions = allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // Randomize and limit to 10 questions
    setQuestions(shuffledQuestions);
  }, []);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setShowFeedback(false);

    const shuffledQuestions = allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuestions(shuffledQuestions);
  };

  if (!quizStarted) {
    return (
      <div className="start-screen">
        <h1>Uyghur Alphabet Quiz</h1>
        <p>
          Test your knowledge of the Uyghur alphabet and its Latin equivalents!
        </p>
        <button onClick={handleStartQuiz}>Start Quiz</button>
      </div>
    );
  }

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          <h2>Quiz Complete!</h2>
          <p>
            You scored <strong>{score}</strong> out of{" "}
            <strong>{questions.length}</strong>.
          </p>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].questionText}
            </div>
          </div>
          <div className="answer-section">
            {["A", "B", "P", "T", "Ch", "X"].map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={showFeedback}
                style={{
                  backgroundColor:
                    showFeedback &&
                    answer === questions[currentQuestion].correctAnswer
                      ? "green"
                      : showFeedback && answer === selectedAnswer
                      ? "red"
                      : "",
                  color: showFeedback ? "white" : "black",
                }}
              >
                {answer}
              </button>
            ))}
          </div>
          {showFeedback && (
            <div className="feedback-section">
              {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                <p>✅ Correct!</p>
              ) : (
                <p>
                  ❌ Incorrect! The correct answer is{" "}
                  <strong>{questions[currentQuestion].correctAnswer}</strong>.
                </p>
              )}
              <button onClick={handleNextQuestion}>Next Question</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
