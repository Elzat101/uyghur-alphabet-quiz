import React from "react";
import { Link } from "react-router-dom";
import { learningPath } from "./learningPath";
import { getCompletedLessons } from "../../utils/ProgressUtils";
import "./LearningTree.css";

const LearningTree = () => {
  const completedLessons = getCompletedLessons();

  // Flatten all lesson steps for linear lock logic
  const allSteps = learningPath.flatMap((unit) => unit.steps);
  const nextStepIndex = allSteps.findIndex(
    (step) => !completedLessons.includes(step.id)
  );
  const unlockedStepId =
    nextStepIndex !== -1 ? allSteps[nextStepIndex].id : null;

  return (
    <div className="learning-tree-container">
      <h1 className="tree-title">📚 Your Learning Journey</h1>
      <div className="learning-path">
        {learningPath.map((unit) => (
          <div className="unit-block" key={unit.id}>
            <div className="unit-label">{unit.name}</div>
            <div className="unit-steps">
              {unit.steps.map((step, stepIndex) => {
                const isDone = completedLessons.includes(step.id);
                const isCurrent = step.id === unlockedStepId;

                let shiftClass = "shift-0"; // Default centered
                const isFirst = stepIndex === 0;
                const isLast = stepIndex === unit.steps.length - 1;
                const totalSteps = unit.steps.length;

                if (isFirst || isLast) {
                  shiftClass = "shift-0"; // Center first and last step
                } else {
                  const distanceFromEdge = Math.min(
                    stepIndex,
                    totalSteps - 1 - stepIndex
                  );
                  const shiftDirection =
                    learningPath.indexOf(unit) % 2 === 0 ? -1 : 1;
                  shiftClass = `shift-${distanceFromEdge * shiftDirection}`;
                }

                return (
                  <div className={`step-wrapper ${shiftClass}`} key={step.id}>
                    <Link
                      to={
                        isDone || isCurrent
                          ? step.isQuiz
                            ? `/unitquiz/${step.id}`
                            : `/lesson/${step.id}`
                          : "#"
                      }
                      className={`step-node ${
                        isDone ? "done" : isCurrent ? "current" : "locked"
                      } ${step.isQuiz ? "quiz-node" : ""}`}
                      style={{
                        pointerEvents: isDone || isCurrent ? "auto" : "none",
                      }}
                    >
                      <div className="wave-inner">
                        {isDone
                          ? "✓"
                          : isCurrent
                          ? step.isQuiz
                            ? "Quiz"
                            : "Start"
                          : step.isQuiz
                          ? "🏆"
                          : "🔒"}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningTree;
