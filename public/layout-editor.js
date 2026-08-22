(() => {
  const key = `freeform-layout:${location.pathname}${location.search}`;
  let mode = null;
  let start = null;
  let draft = null;

  const toolbar = document.createElement("div");
  toolbar.className = "layout-editor-toolbar editor-only";
  toolbar.innerHTML = `<strong>Place anywhere</strong><button type="button" data-mode="text">Text box</button><button type="button" data-mode="image">Image box</button><button type="button" data-cancel>Cancel</button><span>Choose a type, then drag on the page.</span>`;

  const canvas = document.createElement("div");
  canvas.className = "freeform-layout-canvas";
  document.body.append(canvas, toolbar);

  const style = document.createElement("style");
  style.textContent = `
    .layout-editor-toolbar{position:fixed;left:50%;bottom:18px;z-index:1002;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:10px 12px;transform:translateX(-50%);border:1px solid #d9d4c9;border-radius:8px;background:#fffdf8;box-shadow:0 10px 32px rgba(23,26,31,.18);font:14px Arial,sans-serif}
    .layout-editor-toolbar button{padding:8px 10px;border:1px solid #d9d4c9;background:white;color:#24577a;font:inherit;font-weight:700;cursor:pointer}.layout-editor-toolbar button.active{background:#24577a;color:white}.layout-editor-toolbar span{color:#6c716d;font-size:12px}
    .freeform-layout-canvas{position:absolute;inset:0 0 auto 0;z-index:900;min-height:100%;pointer-events:none}.freeform-layout-canvas.drawing{pointer-events:auto;cursor:crosshair;background:rgba(36,87,122,.025)}
    .freeform-item{position:absolute;z-index:1;min-width:60px;min-height:40px;overflow:auto;background:rgba(255,253,248,.94)}body.editor-mode .freeform-item{pointer-events:auto;resize:both;outline:1px dashed #24577a}.freeform-item img{display:block;width:100%;height:100%;object-fit:cover}.freeform-text{padding:38px 10px 10px;white-space:pre-wrap}.freeform-remove{position:absolute;top:6px;right:6px;z-index:3;display:none;padding:5px 8px;border:0;border-radius:4px;background:#7b3434;color:white;font:700 11px Arial,sans-serif;cursor:pointer}body.editor-mode .freeform-remove{display:block}.freeform-draft{border:2px solid #24577a;background:rgba(36,87,122,.12)}
    body:not(.editor-mode) .layout-editor-toolbar{display:none!important}@media(max-width:700px){.layout-editor-toolbar{align-items:stretch;flex-wrap:wrap}.layout-editor-toolbar span{width:100%}}
  `;
  document.head.appendChild(style);

  function items() { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
  function save(next) { localStorage.setItem(key, JSON.stringify(next)); render(); }
  function pagePoint(event) { return { x: event.clientX + scrollX, y: event.clientY + scrollY }; }
  function setMode(next) {
    mode = next;
    canvas.classList.toggle("drawing", Boolean(mode));
    toolbar.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  }

  function render() {
    canvas.querySelectorAll(".freeform-item").forEach((item) => item.remove());
    canvas.style.height = `${Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)}px`;
    items().forEach((item) => {
      const box = document.createElement("div");
      box.className = `freeform-item freeform-${item.type}`;
      box.dataset.id = item.id;
      Object.assign(box.style, { left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` });
      if (item.type === "text") {
        const text = document.createElement("div"); text.className = "freeform-text"; text.contentEditable = localStorage.getItem("portfolio-editor-mode") === "true" ? "true" : "false"; text.textContent = item.content;
        text.addEventListener("blur", () => save(items().map((current) => current.id === item.id ? { ...current, content: text.textContent } : current)));
        box.appendChild(text);
      } else {
        const image = document.createElement("img"); image.src = item.content; image.alt = item.alt || "Portfolio image"; box.appendChild(image);
      }
      const remove = document.createElement("button"); remove.className = "freeform-remove"; remove.type = "button"; remove.textContent = "Remove"; remove.setAttribute("aria-label", `Remove ${item.type} box`);
      remove.addEventListener("click", () => save(items().filter((current) => current.id !== item.id))); box.appendChild(remove);
      box.addEventListener("pointerup", () => {
        if (!document.body.classList.contains("editor-mode")) return;
        const rect = box.getBoundingClientRect();
        save(items().map((current) => current.id === item.id ? { ...current, width: Math.round(rect.width), height: Math.round(rect.height) } : current));
      });
      canvas.appendChild(box);
    });
  }

  toolbar.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  toolbar.querySelector("[data-cancel]").addEventListener("click", () => setMode(null));
  canvas.addEventListener("pointerdown", (event) => {
    if (!mode || event.target !== canvas) return;
    start = pagePoint(event); draft = document.createElement("div"); draft.className = "freeform-item freeform-draft"; canvas.appendChild(draft); canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!start || !draft) return; const point = pagePoint(event);
    Object.assign(draft.style, { left: `${Math.min(start.x, point.x)}px`, top: `${Math.min(start.y, point.y)}px`, width: `${Math.abs(point.x-start.x)}px`, height: `${Math.abs(point.y-start.y)}px` });
  });
  canvas.addEventListener("pointerup", (event) => {
    if (!start || !draft) return; const point = pagePoint(event); const width = Math.max(80, Math.abs(point.x-start.x)); const height = Math.max(50, Math.abs(point.y-start.y));
    const content = mode === "image" ? prompt("Paste the image URL or portfolio image path:", "") : "Type here…";
    if (content !== null) save([...items(), { id: self.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, type: mode, x: Math.min(start.x,point.x), y: Math.min(start.y,point.y), width, height, content }]);
    draft.remove(); draft = null; start = null; setMode(null);
  });

  document.addEventListener("click", (event) => { if (event.target.closest(".editor-toggle")) setTimeout(render); });
  window.addEventListener("portfolio-editor-change", render); window.addEventListener("resize", render); render();
})();
