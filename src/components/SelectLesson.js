// SelectLesson.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { learningPath } from "./progression/learningPath";

export default function SelectLesson() {
  const navigate = useNavigate();
  const unitId = localStorage.getItem("selectedUnit");
  const mode = localStorage.getItem("learningType");
  const unit = learningPath.find((u) => u.id === unitId);

  const handleLessonSelect = (lessonId) => {
    localStorage.setItem("selectedLesson", lessonId);
    navigate(`/${mode}`);
  };

  return (
    <div>
      <h2>Select Lesson</h2>
      {unit.steps
        .filter((s) => !s.isQuiz) // skip quiz button here if needed
        .map((lesson) => (
          <button key={lesson.id} onClick={() => handleLessonSelect(lesson.id)}>
            {lesson.id.replace(/-/g, " ")}
          </button>
        ))}
    </div>
  );
}
