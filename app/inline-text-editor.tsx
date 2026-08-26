"use client";

import { useEffect } from "react";

export default function InlineTextEditor() {
  useEffect(() => {
    const selector = "h1, h2, h3, p, li, .project-kicker span, .section-label, .eyebrow, .notes-label";
    const excluded = ".homepage-editor, .inline-title-editor, .custom-item-editor, .corner-tools, form, button, .open-link, .hero h1, .project-notes-list";

    function apply() {
      const enabled = localStorage.getItem("portfolio-editor-mode") === "true";
      const elements = [...document.querySelectorAll<HTMLElement>(selector)].filter((element) => !element.closest(excluded));
      elements.forEach((element, index) => {
        const key = `inline-text:${location.pathname}:${element.id || element.dataset.editKey || index}`;
        if (!element.dataset.inlineEditorRestored) {
          const saved = localStorage.getItem(key);
          if (saved !== null) element.textContent = saved;
          element.dataset.inlineEditorRestored = "true";
        }
        element.contentEditable = enabled ? "true" : "false";
        element.classList.toggle("inline-editable", enabled);
        if (element.dataset.inlineEditorBound) return;
        element.addEventListener("blur", () => localStorage.setItem(key, element.textContent?.trim() || ""));
        element.addEventListener("keydown", (event) => { if (event.key === "Escape") element.blur(); });
        element.dataset.inlineEditorBound = "true";
      });
    }

    apply();
    window.addEventListener("portfolio-editor-change", apply);
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("portfolio-editor-change", apply); observer.disconnect(); };
  }, []);
  return null;
}
