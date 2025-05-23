import React, { useEffect, useState } from "react";
import { alphabetQuestions } from "../data/alphabetQuestions";
import { numbersData } from "../data/numbersQuestions";
import { commonWords } from "../data/commonWords";
import { ULYNumbers } from "../data/ULYNumbers";
import { ULYCommonWords } from "../data/ULYCommonWords";
import { useNavigate } from "react-router-dom";
import { lessonDataMap } from "./progression/lessonLoader";

export default function Learn({ onBack }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [ulyMode, setUlyMode] = useState(false);
  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    const selectedLessonId = localStorage.getItem("selectedLesson");
    const learningMode = localStorage.getItem("learningMode") || "Uyghur";

    const lesson = lessonDataMap[selectedLessonId];

    if (lesson && lesson.words) {
      const formatted = lesson.words.map((w) => ({
        ...w,
        questionText: w.uyghur || w.uly || w.word,
        correctAnswer: w.correctAnswer || w.translation,
      }));
      setDataSet(formatted);
    }
  }, []);

  if (dataSet.length === 0) return <p>Loading...</p>;

  return (
    <div className="learn">
      <h2>Learn - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>

      <div className="grid-container">
        {dataSet.map((item, index) => (
          <div key={index} className="card">
            <p className="uyghur">
              {item.uly ? item.uly : item.questionText || item.uyghur}
            </p>
            <p className="latin">{item.correctAnswer}</p>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate("/home")}>
        Back
      </button>
    </div>
  );
}
