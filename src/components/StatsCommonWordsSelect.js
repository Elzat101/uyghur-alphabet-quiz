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

export default function StatsCommonWordsSelect() {
  const navigate = useNavigate();

  const handleCategorySelect = (key) => {
    localStorage.setItem("selectedCategory", key);
    navigate("/stats/commonWords");
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
        <button
          onClick={() => navigate("/stats")}
          className="text-sm text-gray-600 underline"
        >
          Back
        </button>
      </div>
    </div>
  );
}
