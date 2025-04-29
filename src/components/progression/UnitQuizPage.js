import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const unit = learningPath.find((u) => u.id === quizId.replace("quiz-", ""));
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

    const shuffled = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 20);

    setQuestions(shuffled);
  }, [quizId]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (choice) => {
    if (!currentQuestion) return;
    setSelected(choice);

    let loseLife = false;
    if (choice !== currentQuestion.translation) {
      loseLife = true;
      setMistakes((prev) => [
        ...prev,
        {
          question: currentQuestion.word,
          correct: currentQuestion.translation,
        },
      ]);
    }

    setTimeout(() => {
      if (loseLife && lives === 1) {
        setReviewMode(true);
      } else if (currentIndex + 1 >= questions.length) {
        setFinished(true);
        setPassed(lives - (loseLife ? 1 : 0) > 0);
      } else {
        setCurrentIndex((prev) => prev + 1);
        if (loseLife) setLives((prev) => prev - 1);
        setSelected(null);
      }
    }, 1000);
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

  const getOptions = () => {
    const wrongChoices = questions
      .filter((q) => q.translation !== currentQuestion.translation)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((q) => q.translation);

    return [...wrongChoices, currentQuestion.translation].sort(
      () => 0.5 - Math.random()
    );
  };

  const options = getOptions();

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
              selected === choice
                ? choice === currentQuestion.translation
                  ? "correct"
                  : "incorrect"
                : ""
            }`}
            onClick={() => handleAnswer(choice)}
            disabled={selected !== null}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
