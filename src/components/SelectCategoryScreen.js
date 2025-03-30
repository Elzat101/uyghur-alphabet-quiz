import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Food", key: "food" },
  { name: "Animals", key: "animals" },
  { name: "School", key: "school" },
  { name: "Family", key: "family" },
  { name: "Greetings", key: "greetings" },
  { name: "Verbs", key: "verbs" },
];

export default function SelectCategoryScreen() {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    localStorage.setItem("selectedCategory", category);

    const learningType = localStorage.getItem("learningType");
    if (learningType === "learn") {
      navigate("/learn");
    } else if (learningType === "quiz") {
      navigate("/quiz");
    } else if (learningType === "practice") {
      navigate("/practice");
    } else {
      console.error("Invalid learningType in localStorage");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Select a Category</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategorySelect(cat.key)}
            className="bg-blue-700 text-white py-3 px-4 rounded-2xl shadow hover:bg-blue-800 transition"
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
}
