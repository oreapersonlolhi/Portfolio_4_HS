"use client";

import { useState } from "react";

const projects = [
  ["micro-shelter", "Micro Shelter"],
  ["river-house", "River House"],
  ["villa-savoye", "Villa Savoye Plastic Set"],
  ["fallingwater", "Fallingwater Wood Set"],
  ["forgotten-peak", "Forgotten Peak Middle-High School"],
  ["contemporary-museum", "Contemporary Museum"],
  ["highrise-building", "Highrise Building"],
  ["motel-hotel", "Motel / Hotel"],
  ["cradle-cafe", "Cradle-Cafe"],
  ["church", "Church"],
  ["dorm", "Something Like a Dorm"],
  ["freehand-sketch", "Freehand Sketches"],
  ["circuits", "Circuit Studies"],
] as const;

export default function AdminPage() {
  const [status, setStatus] = useState("");

  function setEditorMode(enabled: boolean) {
    localStorage.setItem("portfolio-editor-mode", String(enabled));
    setStatus(enabled ? "Editor mode is on in this browser." : "Editor mode is off.");
  }

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Private workspace</p>
        <h1>Portfolio Editor</h1>
      </header>
      <section className="admin-panel">
        <p>
          Turn editor mode on, then open the homepage or a project. Your editing
          controls will appear on those pages.
        </p>
        <div className="admin-actions">
          <button type="button" onClick={() => setEditorMode(true)}>Turn editor on</button>
          <button type="button" onClick={() => setEditorMode(false)}>Turn editor off</button>
          <a href="/index.html">Edit homepage</a>
          <a href="/index.html">View portfolio</a>
        </div>
        <p className="admin-status" aria-live="polite">{status}</p>
        <h2>Edit a project</h2>
        <div className="admin-projects">
          {projects.map(([id, title]) => (
            <a key={id} href={`/project.html?project=${id}`}>{title}</a>
          ))}
        </div>
      </section>
    </main>
  );
}
