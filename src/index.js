import React from "react";
import ReactDOM from "react-dom/client"; // Ensure React 18 compatibility
import App from "./app"; // Import the new App component
import "./styles/App.css"; // Correct path for styles
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ✅ Here is the correct place */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
