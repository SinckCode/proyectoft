import React from "react";
import { createRoot } from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextContextProvider } from "./context/AuthContext";

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextContextProvider>
        <App />
      </AuthContextContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
