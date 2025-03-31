import React from "react";
import { Link } from "react-router-dom";
import { learningPath } from "../../data/learningPath";
import { getCompletedLessons } from "../../utils/ProgressUtils";

const LearningTree = () => {
  const completedLessons = getCompletedLessons();

  const isLessonUnlocked = (unit, index, lesson) => {
    if (index === 0) return true;
    const prevLessonId = unit.lessons[index - 1].id;
    return completedLessons.includes(prevLessonId);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Learning Path</h1>
      {learningPath.map((unit) => (
        <div key={unit.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{unit.name}</h2>
          <div className="grid grid-cols-2 gap-3">
            {unit.lessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(unit, index);
              const completed = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="p-3 border rounded shadow-md bg-white"
                >
                  {unlocked ? (
                    <Link
                      to={`/lesson/${lesson.id}`}
                      style={{
                        fontWeight: "500",
                        color: completed ? "green" : "blue",
                        textDecoration: "underline",
                      }}
                    >
                      {lesson.title}
                    </Link>
                  ) : (
                    <span className="text-gray-400">🔒 {lesson.title}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningTree;
