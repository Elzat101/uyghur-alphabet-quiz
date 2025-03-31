import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LessonCompleteButton from "./LessonCompleteButton";
import "./LessonPage.css";
import { lessonDataMap } from "./lessonLoader";

export default function LessonPage() {
  const { lessonId } = useParams();
  const [showIntro, setShowIntro] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [intro, setIntro] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctInRow, setCorrectInRow] = useState(0);

  useEffect(() => {
    const data = lessonDataMap[lessonId];
    if (data) {
      setQuestions(data.quiz);
      setIntro(data.intro);
    } else {
      console.error("Lesson data not found for:", lessonId);
    }
  }, [lessonId]);

  const handleChoice = (choice) => {
    setSelected(choice);
    setShowAnswer(true);
    const correct = choice === questions[current].answer;
    setIsCorrect(correct);
    setCorrectInRow(correct ? correctInRow + 1 : 0);
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowAnswer(false);
    setIsCorrect(null);
    setCurrent((prev) => prev + 1);
  };

  if (showIntro) {
    return (
      <div className="lesson-container">
        <div style={{ padding: "20px" }}>
          <h2>📘 Lesson: {lessonId.replace(/-/g, " ")}</h2>
          <pre>{intro}</pre>
          <button
            style={{ marginTop: "20px" }}
            onClick={() => setShowIntro(false)}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <div style={{ padding: "20px" }}>Loading lesson...</div>;
  }

  if (correctInRow === questions.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🎉 You mastered this lesson with all correct answers in a row!</h2>
        <LessonCompleteButton lessonId={lessonId} />
        <br />
        <button onClick={() => window.history.back()}>
          ⬅️ Back to Progression
        </button>
      </div>
    );
  }

  if (current >= questions.length) {
    // Reset to retry from beginning if not all correct
    setCurrent(0);
    return (
      <div style={{ padding: "20px" }}>
        <h2>
          🔁 Let's try again from the beginning to get all answers right in a
          row!
        </h2>
        <button onClick={() => setCorrectInRow(0)}>Retry</button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="lesson-container">
      <div style={{ padding: "20px" }}>
        <h2>📘 Lesson: {lessonId.replace(/-/g, " ")}</h2>
        <p>
          <strong>Question {current + 1}:</strong> {q.question}
        </p>
        <div>
          {q.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              disabled={showAnswer}
              style={{
                display: "block",
                margin: "8px 0",
                backgroundColor:
                  showAnswer && choice === q.answer
                    ? "lightgreen"
                    : showAnswer && choice === selected
                    ? "salmon"
                    : "",
              }}
            >
              {choice}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div style={{ marginTop: "10px" }}>
            {isCorrect ? "✅ Correct!" : "❌ Incorrect."}
            <br />
            <button onClick={nextQuestion} style={{ marginTop: "10px" }}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
