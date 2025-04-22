import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { lessonDataMap } from "./lessonLoader";
import LessonCompleteButton from "./LessonCompleteButton";
import "./LessonPage.css";

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [mistakes, setMistakes] = useState([]);
  const [repeatQueue, setRepeatQueue] = useState([]);
  const [repeatMode, setRepeatMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [sentence, setSentence] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isMatched, setIsMatched] = useState(false); // Track if the pair
  // is correct
  const [correctMatches, setCorrectMatches] = useState([]);
  const [incorrectMatches, setIncorrectMatches] = useState([]);
  const [lockedWords, setLockedWords] = useState([]); // Track locked words
  const [matchingPerfect, setMatchingPerfect] = useState(true);
  const [questionsPerfect, setQuestionsPerfect] = useState(true);

  const pairs = useMemo(() => {
    if (!lesson || !Array.isArray(lesson.words)) return [];
    return [...lesson.words].sort(() => 0.5 - Math.random());
  }, [lesson]);
  const left = useMemo(() => {
    if (!pairs || !Array.isArray(pairs)) return [];
    return pairs.map((p) => p.word).sort(() => 0.5 - Math.random());
  }, [pairs]);

  const right = useMemo(() => {
    if (!pairs || !Array.isArray(pairs)) return [];
    return pairs.map((p) => p.translation).sort(() => 0.5 - Math.random());
  }, [pairs]);

  const handleLeftSelect = (word) => {
    setIncorrectMatches([]);
    if (lockedWords.includes(word)) return; // Prevent selecting locked words
    setSelectedLeft(word); // Set the word from the left column
    setIsMatched(false); // Reset match status when a new left word is selected
  };

  const handleRightSelect = (word) => {
    if (lockedWords.includes(word)) return;

    // If no left word selected yet, just select the right word
    if (!selectedLeft) {
      return;
    }

    // Check if this is a correct match
    const isCorrectMatch = lesson.words.some(
      (w) => w.word === selectedLeft && w.translation === word
    );

    if (isCorrectMatch) {
      // Correct match - lock both words
      setCorrectMatches((prev) => [
        ...prev,
        { left: selectedLeft, right: word },
      ]);
      setLockedWords((prev) => [...prev, selectedLeft, word]);
      setMatchedPairs((prev) => [...prev, { left: selectedLeft, right: word }]);
    } else {
      // Incorrect match - show feedback
      setMatchingPerfect(false);
      setIncorrectMatches((prev) => [
        ...prev,
        { left: selectedLeft, right: word },
      ]);
    }

    // Show feedback immediately by setting selectedRight
    setSelectedRight(word);

    // Clear selections after a short delay

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  useEffect(() => {
    if (phase === "matching") {
      setMatchingPerfect(true);
      // Reset other matching states...
    }
    if (phase === "flashcard" && repeatMode) {
      setQuestionsPerfect(true);
    }
  }, [phase, repeatMode]);

  const isMistake = (leftWord, rightWord) =>
    mistakes.some((p) => p.left === leftWord && p.right === rightWord);

  const allMatched = useMemo(() => {
    return pairs.length > 0 && correctMatches.length === pairs.length;
  }, [pairs, correctMatches]);

  const [answerOptions, setAnswerOptions] = useState([]);

  useEffect(() => {
    const l = lessonDataMap[lessonId];
    if (l && l.words) {
      setLesson(l);

      const shuffled = [...l.words].sort(() => 0.5 - Math.random());
      setWords(shuffled);
      const firstWord = shuffled[0];
      const wrong = shuffled
        .filter((w) => w !== firstWord)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [firstWord, ...wrong]
        .map((w) => w.translation)
        .sort(() => 0.5 - Math.random());
      setAnswerOptions(options);
    }
  }, [lessonId]);

  useEffect(() => {
    if (words.length === 0 || !words[currentIndex]) return;

    const sourcePool = repeatMode ? lesson.words : words;
    const current = words[currentIndex];
    const wrong = sourcePool
      .filter((w) => w !== current)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const randomized = [current, ...wrong]
      .map((w) => w.translation)
      .sort(() => 0.5 - Math.random());

    setAnswerOptions(randomized);
  }, [phase, currentIndex, words, repeatMode, lesson]);

  const currentWord = words[currentIndex];

  const getEmojiFor = (choice) => {
    // Check both the current words and original lesson words
    const item = [...words, ...lesson.words].find(
      (w) => w.translation === choice || w.word === choice
    );
    return item?.emoji || "❓";
  };

  const markMistake = (word) => {
    setMistakes((prev) => [...prev, word]);
    setRepeatQueue((prev) => [...prev, currentWord]);
  };

  // Add this function to clear mistakes
  const clearMistakes = () => {
    setMistakes([]);
    setRepeatQueue([]);
  };

  useEffect(() => {
    if (phase === "multiple") {
      setSentence([]);
    }
  }, [phase]);

  const next = () => {
    // ... existing reset code ...

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setPhase("flashcard");
    } else if (repeatMode) {
      if (!matchingPerfect) {
        // After reviewing questions, redo matching if it wasn't perfect
        setCorrectMatches([]);
        setIncorrectMatches([]);
        setLockedWords([]);
        setPhase("matching");
        setMatchingPerfect(true); // Reset to perfect by default
        setRepeatMode(false);
      } else {
        // Everything was perfect - complete lesson
        setCompleted(true);
      }
    } else {
      // Normal flow - go to matching
      setPhase("matching");
    }
  };

  useEffect(() => {
    if (!lesson || !words.length) return;

    // Ensure currentWord exists before rendering
    if (!words[currentIndex]) {
      setCurrentIndex(0); // Reset to first word if invalid index
    }
  }, [words, currentIndex, lesson]);

  // Update your loading check to include words validation
  if (!lesson || !words.length || !words[currentIndex]) {
    return <div className="lesson-container">Loading lesson...</div>;
  }

  const getWrongChoices = (correct) => {
    const pool = words.filter((w) => w.translation !== correct);
    return pool
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.translation);
  };

  const handleChoice = (choice) => {
    if (answered) return;
    setSelectedChoice(choice);
    setAnswered(true);
    if (choice === currentWord.translation) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${currentWord.translation}`);
      setQuestionsPerfect(false);
      markMistake(currentWord.word);
    }
  };
  const handleMatchingCompletion = () => {
    if (mistakes.length > 0 || !matchingPerfect) {
      // Clear all interactive states
      setSentence([]);
      setSelectedChoice(null);
      setAnswered(false);
      setFeedback("");

      // Start review session
      setPhase("review-intro");
    } else {
      setCompleted(true);
    }
  };

  const getLineStyle = (leftWord, rightWord) => {
    if (
      correctMatches.some(
        (match) => match?.left === leftWord && match?.right === rightWord
      )
    ) {
      return { borderColor: "green", borderWidth: "2px" }; // Green line for correct match
    }
    if (
      incorrectMatches.some(
        (match) => match?.left === leftWord && match?.right === rightWord
      )
    ) {
      return { borderColor: "red", borderWidth: "2px" }; // Red line for incorrect match
    }
    return {};
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

  if (!lesson || !currentWord)
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

  if (phase === "intro") {
    return (
      <div className="lesson-container">
        <h2>{lesson.title}</h2>
        <p>{lesson.introText}</p>
        <ul>
          {lesson.words.map((w, i) => (
            <li key={i}>
              {w.emoji} <strong>{w.translation}</strong> = {w.word}
            </li>
          ))}
        </ul>
        <button className="next-button" onClick={() => setPhase("flashcard")}>
          Start Practice
        </button>
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
            {answerOptions.map((choice) => {
              let className = "flashcard";
              if (answered) {
                if (choice === currentWord.translation) className += " correct";
                else if (choice === selectedChoice) className += " incorrect";
              }
              return (
                <div
                  key={choice}
                  className={className}
                  onClick={() => handleChoice(choice)}
                >
                  <span className="emoji">{getEmojiFor(choice)}</span>
                  <span>{choice}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {phase === "multiple" && (
        <>
          <p className="question">
            What does <strong>{currentWord.word}</strong> mean?
          </p>
          <div className="button-row">
            {answerOptions.map((choice) => {
              let className = "option-button";
              if (answered) {
                if (choice === currentWord.translation) className += " correct";
                else if (choice === selectedChoice) className += " incorrect";
              }
              return (
                <button
                  key={choice}
                  className={className}
                  onClick={() => handleChoice(choice)}
                >
                  {choice}
                </button>
              );
            })}
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
            className="trash-zone-visible"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const index = Number(e.dataTransfer.getData("index"));
              if (!isNaN(index)) {
                const updated = [...sentence];
                updated.splice(index, 1);
                setSentence(updated);
              }
            }}
          >
            🗑️ Drop here to remove word
          </div>

          <div
            className="sentence-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const word = e.dataTransfer.getData("text");
              const fromIndex = Number(e.dataTransfer.getData("index"));
              const dropTarget = e.currentTarget;
              const dropInside = dropTarget.contains(
                document.elementFromPoint(e.clientX, e.clientY)
              );
              const updated = [...sentence];

              if (!dropInside && !isNaN(fromIndex)) {
                // Word dragged out of sentence box
                updated.splice(fromIndex, 1);
                setSentence(updated);
              } else if (!sentence.includes(word)) {
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
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const draggedWord = e.dataTransfer.getData("text");
                  const fromIndex = Number(e.dataTransfer.getData("index"));
                  if (fromIndex === index) return;
                  const updated = [...sentence];
                  updated.splice(fromIndex, 1);
                  updated.splice(index, 0, draggedWord);
                  setSentence(updated);
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="button-row">
            {Array.from(
              new Set(
                lesson.words
                  .flatMap((w) => w.translation.split(" "))
                  .filter((w) => !sentence.includes(w))
              )
            )
              .sort(() => 0.5 - Math.random())
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

      {phase === "matching" && (
        <>
          <h2>🧠 Match the English words to their Uyghur translations</h2>
          <div className="matching-grid">
            <div className="column">
              {left.map((word) => (
                <div
                  key={word}
                  className={`matching-left ${
                    selectedLeft === word ? "selected" : ""
                  }
        ${correctMatches.some((match) => match.left === word) ? "correct" : ""}
        ${
          incorrectMatches.some((match) => match.left === word)
            ? "incorrect"
            : ""
        }`}
                  onClick={() => handleLeftSelect(word)} // Select word from the left side
                >
                  {word}
                </div>
              ))}
            </div>

            <div className="column">
              {right.map((trans) => {
                const isSelected = selectedRight === trans;
                const isCorrect = correctMatches.some((m) => m.right === trans);
                const isIncorrect = incorrectMatches.some(
                  (m) => m.right === trans
                );
                const isLocked = lockedWords.includes(trans);

                // Determine the most relevant state to show
                let stateClass = "";
                if (isSelected) {
                  // Check if this selection is correct/incorrect
                  const currentMatch = { left: selectedLeft, right: trans };
                  const isCurrentCorrect = lesson.words.some(
                    (w) => w.word === selectedLeft && w.translation === trans
                  );
                  stateClass = isCurrentCorrect ? "correct" : "incorrect";
                } else if (isCorrect) {
                  stateClass = "correct";
                } else if (isIncorrect) {
                  stateClass = "incorrect";
                }

                return (
                  <div
                    key={trans}
                    className={`matching-right ${stateClass} ${
                      isLocked ? "locked" : ""
                    }`}
                    onClick={() => handleRightSelect(trans)}
                  >
                    {trans}
                  </div>
                );
              })}
            </div>
          </div>
          {allMatched && (
            <button onClick={handleMatchingCompletion} className="next-button">
              {mistakes.length > 0 || !matchingPerfect
                ? "Review Mistakes"
                : "Finish Lesson"}
            </button>
          )}
        </>
      )}
      {answered && (
        <button
          onClick={() => {
            setFeedback("");
            setAnswered(false);
            setSelectedChoice(null);
            if (phase === "flashcard") setPhase("multiple");
            else if (phase === "multiple") setPhase("type");
            else next();
          }}
          className="next-button"
        >
          Next
        </button>
      )}
      {phase === "review-intro" && (
        <div className="review-intro-container">
          <h2>🔁 Review Time</h2>
          <p>
            {matchingPerfect
              ? "Let's practice the questions you missed"
              : "We'll practice missed questions then try matching again"}
          </p>
          <button
            className="next-button"
            onClick={() => {
              const wordsToReview = lesson.words.filter((wordObj) =>
                mistakes.includes(wordObj.word)
              );

              if (wordsToReview.length > 0) {
                setWords(wordsToReview);
                setRepeatMode(true);
                setCurrentIndex(0);
                setPhase("flashcard");
              } else {
                // No missed questions — go directly to matching review
                setCorrectMatches([]);
                setIncorrectMatches([]);
                setLockedWords([]);
                setRepeatMode(false);
                setCurrentIndex(0);
                setPhase("matching");
              }

              clearMistakes();
            }}
          >
            Start Practice
          </button>
        </div>
      )}
    </div>
  );
}
