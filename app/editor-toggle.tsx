"use client";

import { useEffect, useState } from "react";

export default function EditorToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem("portfolio-editor-mode") === "true");
  }, []);

  function toggleEditor() {
    const next = !enabled;
    localStorage.setItem("portfolio-editor-mode", String(next));
    setEnabled(next);
    document.body.classList.toggle("editor-mode", next);
    window.dispatchEvent(new CustomEvent("portfolio-editor-change", { detail: next }));
  }

  return (
    <button
      className="tool-icon"
      type="button"
      aria-label={enabled ? "Turn off portfolio editor" : "Turn on portfolio editor"}
      aria-pressed={enabled}
      title={enabled ? "Turn editor off" : "Turn editor on"}
      onClick={toggleEditor}
    >
      <span aria-hidden="true">🔧</span>
    </button>
  );
}
