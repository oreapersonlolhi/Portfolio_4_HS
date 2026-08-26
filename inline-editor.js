(() => {
  const selector = "h1, h2, h3, p, li, .project-kicker span, .section-label, .eyebrow, .notes-label";
  const excluded = ".editor-only, .corner-tools, form, button, .status, .open-link, .hero h1, .project-description";
  let applying = false;

  function editableElements() {
    return [...document.querySelectorAll(selector)].filter((element) => !element.closest(excluded));
  }

  function keyFor(element, index) {
    return `inline-text:${location.pathname}:${element.id || element.dataset.editKey || index}`;
  }

  function applyInlineEditing() {
    if (applying) return;
    applying = true;
    const enabled = localStorage.getItem("portfolio-editor-mode") === "true";
    editableElements().forEach((element, index) => {
      const key = keyFor(element, index);
      if (!element.dataset.inlineEditorRestored) {
        const saved = localStorage.getItem(key);
        if (saved !== null) element.textContent = saved;
        element.dataset.inlineEditorRestored = "true";
      }
      element.contentEditable = enabled ? "true" : "false";
      element.classList.toggle("inline-editable", enabled);
      if (!element.dataset.inlineEditorBound) {
        element.addEventListener("blur", () => localStorage.setItem(key, element.textContent.trim()));
        element.addEventListener("keydown", (event) => {
          if (event.key === "Escape") element.blur();
        });
        element.dataset.inlineEditorBound = "true";
      }
    });
    applying = false;
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest(".editor-toggle")) setTimeout(applyInlineEditing);
  });
  window.addEventListener("portfolio-editor-change", applyInlineEditing);
  window.addEventListener("storage", applyInlineEditing);
  new MutationObserver(applyInlineEditing).observe(document.body, { childList: true, subtree: true });
  applyInlineEditing();
})();
