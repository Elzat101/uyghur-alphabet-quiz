import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { lessonDataMap } from "./lessonLoader";
import LessonCompleteButton from "./LessonCompleteButton";
import "./LessonPage.css";

export default function LessonPage() {
  const { lessonId } = useParams();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("flashcard");
  const [mistakes, setMistakes] = useState({});
  const [repeatQueue, setRepeatQueue] = useState([]);
  const [repeatMode, setRepeatMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const [sentence, setSentence] = useState([]);

  useEffect(() => {
    const lesson = lessonDataMap[lessonId];
    if (lesson && lesson.words) {
      setWords(lesson.words);
    }
  }, [lessonId]);

  const currentWord = words[currentIndex];

  const getEmojiFor = (choice) => {
    const item = words.find(
      (w) => w.translation === choice || w.word === choice
    );
    return item?.emoji || "❓";
  };

  const markMistake = (word) => {
    setMistakes((prev) => ({ ...prev, [word]: (prev[word] || 0) + 1 }));
    setRepeatQueue((prev) => [...prev, currentWord]);
  };

  const next = () => {
    setFeedback("");
    setAnswered(false);
    setSentence([]);
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setPhase("flashcard");
    } else if (!repeatMode && repeatQueue.length > 0) {
      setWords(repeatQueue);
      setRepeatQueue([]);
      setRepeatMode(true);
      setCurrentIndex(0);
      setPhase("flashcard");
    } else {
      setCompleted(true);
    }
  };

  const handleChoice = (choice) => {
    setAnswered(true);
    if (phase === "flashcard") {
      if (choice === currentWord.translation) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Incorrect. Correct answer: ${currentWord.translation}`);
        markMistake(currentWord.word);
      }
    }

    if (phase === "multiple") {
      if (choice === currentWord.translation) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback(`❌ Incorrect. Correct answer: ${currentWord.translation}`);
        markMistake(currentWord.word);
      }
    }
  };

  const handleSentenceClick = (word) => {
    setSentence([...sentence, word]);
  };

  const handleSentenceSubmit = () => {
    const userAnswer = sentence.join(" ").toLowerCase().trim();
    const correctAnswer = currentWord.translation.toLowerCase().trim();
    setAnswered(true);
    if (userAnswer === correctAnswer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${currentWord.translation}`);
      markMistake(currentWord.word);
    }
  };

  if (!currentWord)
    return <div className="lesson-container">Loading lesson...</div>;

  if (completed) {
    return (
      <div className="lesson-container">
        <h2>🎉 You completed the lesson!</h2>
        <LessonCompleteButton lessonId={lessonId} />
        <button onClick={() => window.history.back()}>⬅ Back to Path</button>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentIndex + 1) / words.length) * 100}%`,
          }}
        />
      </div>

      {phase === "flashcard" && (
        <>
          <p className="question">
            Which one is <strong>{currentWord.word}</strong>?
          </p>
          <div className="flashcard-grid">
            {[currentWord.translation, ...currentWord.distractors]
              .sort(() => 0.5 - Math.random())
              .map((choice) => (
                <div
                  key={choice}
                  className="flashcard"
                  onClick={() => !answered && handleChoice(choice)}
                >
                  <span className="emoji">{getEmojiFor(choice)}</span>
                  <span>{choice}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {phase === "multiple" && (
        <>
          <p className="question">
            What does <strong>{currentWord.word}</strong> mean?
          </p>
          <div className="button-row">
            {[currentWord.translation, ...currentWord.distractors]
              .sort(() => 0.5 - Math.random())
              .map((choice) => (
                <button
                  key={choice}
                  className="option-button"
                  onClick={() => !answered && handleChoice(choice)}
                >
                  {choice}
                </button>
              ))}
          </div>
        </>
      )}

      {phase === "type" && (
        <>
          <p className="question">
            Write the following phrase in Uyghur:{" "}
            <strong>"{currentWord.word}"</strong>
          </p>

          <div
            className="sentence-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const word = e.dataTransfer.getData("text");
              if (!sentence.includes(word)) {
                setSentence([...sentence, word]);
              }
            }}
          >
            {sentence.map((word, index) => (
              <span
                key={index}
                className="word-bank-option"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text", word);
                  e.dataTransfer.setData("index", index);
                }}
                onDrop={(e) => {
                  const draggedWord = e.dataTransfer.getData("text");
                  const fromIndex = Number(e.dataTransfer.getData("index"));
                  const newSentence = [...sentence];
                  newSentence.splice(fromIndex, 1); // remove from old
                  newSentence.splice(index, 0, draggedWord); // insert new
                  setSentence(newSentence);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="button-row">
            {Array.from(
              new Set([
                ...currentWord.translation.split(" "),
                ...currentWord.distractors.flatMap((d) => d.split(" ")),
              ])
            )
              .sort(() => 0.5 - Math.random())
              .filter((word) => !sentence.includes(word)) // hide if used
              .map((word, index) => (
                <div
                  key={index}
                  className="word-bank-option"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text", word)}
                >
                  {word}
                </div>
              ))}
          </div>

          {!answered && (
            <button className="submit-button" onClick={handleSentenceSubmit}>
              Submit
            </button>
          )}
        </>
      )}

      {feedback && <div className="feedback">{feedback}</div>}
      {answered && (
        <button
          onClick={() => {
            setFeedback("");
            setAnswered(false);
            if (phase === "flashcard") setPhase("multiple");
            else if (phase === "multiple") setPhase("type");
            else next();
          }}
          className="next-button"
        >
          Next
        </button>
      )}
    </div>
  );
}
