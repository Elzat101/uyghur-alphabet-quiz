import React from "react";
import { markLessonComplete } from "../../utils/ProgressUtils";

export default function LessonCompleteButton({ lessonId }) {
  const handleClick = () => {
    markLessonComplete(lessonId);
    alert("Lesson marked as complete!");
  };

  return <button onClick={handleClick}>✅ Mark Lesson Complete</button>;
}
