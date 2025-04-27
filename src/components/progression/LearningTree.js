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
                    <div
                      className={`step-node ${
                        isDone ? "done" : isCurrent ? "current" : "locked"
                      }`}
                    >
                      <div className="wave-inner">
                        {isCurrent ? (
                          <Link to={`/lesson/${step.id}`} className="step-link">
                            Start
                          </Link>
                        ) : isDone ? (
                          <span className="step-link">✓</span>
                        ) : (
                          <span className="step-link">🔒</span>
                        )}
                      </div>
                    </div>
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
