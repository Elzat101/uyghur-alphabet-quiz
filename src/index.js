import React from "react";
import ReactDOM from "react-dom/client"; // Use react-dom/client for React 18
import UyghurAlphabetQuiz from "./UyghurAlphabetQuiz"; // Import your main component
import "./styles.css"; // Import your styles

// Find the root element in index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using createRoot
root.render(
  <React.StrictMode>
    <UyghurAlphabetQuiz />
  </React.StrictMode>
);
