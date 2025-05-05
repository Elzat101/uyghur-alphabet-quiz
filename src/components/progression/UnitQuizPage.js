import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { learningPath } from "./learningPath";
import { lessonDataMap } from "./lessonLoader";
import "./LessonPage.css";

export default function UnitQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [lives, setLives] = useState(3);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [answered, setAnswered] = useState(false);
  const questionsRef = useRef([]);
  const [options, setOptions] = useState([]);
  const currentQuestion = questions[currentIndex];
  const handleNext = () => {
    const isWrong = selected !== currentQuestion.translation;

    if (isWrong) {
      setMistakes((prev) => [
        ...prev,
        {
          question: currentQuestion.word,
          correct: currentQuestion.translation,
        },
      ]);
      if (lives === 1) {
        setReviewMode(true);
        return;
      }
      setLives((prev) => prev - 1);
    }

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      setPassed(lives - (isWrong ? 1 : 0) > 0);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  useEffect(() => {
    if (!currentQuestion) return;

    const wrongChoices = questions
      .filter((q) => q.translation !== currentQuestion.translation)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((q) => q.translation);

    const combined = [...wrongChoices, currentQuestion.translation].sort(
      () => 0.5 - Math.random()
    );

    setOptions(combined);
  }, [currentQuestion, questions]);

  useEffect(() => {
    if (questionsRef.current.length === 0) {
      const unit = learningPath.find(
        (u) => u.id === quizId.replace("quiz-", "")
      );
      if (!unit) return;

      let allWords = [];
      unit.steps.forEach((step) => {
        if (!step.isQuiz) {
          const lesson = lessonDataMap[step.id];
          if (lesson?.words) {
            allWords = allWords.concat(lesson.words);
          }
        }
      });

      const shuffled = [...allWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);
      questionsRef.current = shuffled;
      setQuestions(shuffled);
    } else {
      setQuestions(questionsRef.current);
    }
  }, [quizId]);

  const handleAnswer = (choice) => {
    if (!currentQuestion || answered) return; // prevent double-clicks
    setSelected(choice);
    setAnswered(true);

    if (choice !== currentQuestion.translation) {
      setMistakes((prev) => [
        ...prev,
        {
          question: currentQuestion.word,
          correct: currentQuestion.translation,
        },
      ]);
    }
  };

  const handleContinueAfterReview = () => {
    setReviewMode(false);
    setLives(Infinity);
    setSelected(null);
  };

  if (!questions.length)
    return <div className="lesson-container">Loading quiz...</div>;

  if (reviewMode) {
    return (
      <div className="lesson-container">
        <h2>💔 You lost all lives!</h2>
        <p>Here are the mistakes you made:</p>
        <ul className="mistakes-list">
          {mistakes.map((m, idx) => (
            <li key={idx}>
              <strong>{m.question}</strong> → {m.correct}
            </li>
          ))}
        </ul>
        <button className="next-button" onClick={handleContinueAfterReview}>
          Continue for Practice
        </button>
        <button className="submit-button" onClick={() => navigate("/")}>
          Exit to Home
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="lesson-container">
        <h2>
          {passed ? "🎉 You passed the Unit Quiz!" : "✅ Practice Complete!"}
        </h2>
        <button
          className="next-button"
          onClick={() => window.location.reload()}
        >
          🔄 Restart Quiz
        </button>
        <button className="submit-button" onClick={() => navigate("/")}>
          🏠 Back to Path
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      {lives !== Infinity && (
        <div style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} style={{ color: "red", marginRight: "5px" }}>
              ❤️
            </span>
          ))}
        </div>
      )}

      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        What does "<strong>{currentQuestion.word}</strong>" mean?
      </p>

      <div className="button-row">
        {options.map((choice) => (
          <button
            key={choice}
            className={`option-button ${
              answered
                ? choice === currentQuestion.translation
                  ? "correct"
                  : selected === choice
                  ? "incorrect"
                  : ""
                : ""
            }`}
            onClick={() => handleAnswer(choice)}
            disabled={answered}
          >
            {choice}
          </button>
        ))}
      </div>

      {answered && (
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      )}
    </div>
  );
}
