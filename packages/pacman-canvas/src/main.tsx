"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import Preview from "./components/Preview.js";
import Logger from "js-logger";

const rootId = "root";

const container = document.getElementById(rootId);

// don't log debug messages
Logger.setLevel(Logger.ERROR);

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>

      <Preview />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  throw new Error(`Root Element not found with id: ${rootId}`);
}
