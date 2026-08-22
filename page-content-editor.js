(() => {
  const pageKey = `${location.pathname}${location.search}`;
  const storageKey = `custom-page-items:${pageKey}`;
  const main = document.querySelector("main");
  if (!main) return;

  const editor = document.createElement("section");
  editor.className = "page-content-editor editor-only";
  editor.innerHTML = `
    <p class="section-label">Page editor</p>
    <h2>Add something to this page</h2>
    <div class="page-editor-forms">
      <form data-add="text"><h3>Text</h3><input name="title" placeholder="Title"><textarea name="body" rows="4" placeholder="Write your text"></textarea><button type="submit">Add text</button></form>
      <form data-add="image"><h3>Picture</h3><input name="title" placeholder="Caption"><input name="image" required placeholder="Image URL or public/portfolio/image.jpg"><button type="submit">Add picture</button></form>
      <form data-add="project"><h3>Project</h3><input name="title" required placeholder="Project title"><input name="category" placeholder="Category"><input name="image" required placeholder="Image URL or public/portfolio/image.jpg"><textarea name="body" rows="3" placeholder="Project description"></textarea><button type="submit">Add project</button></form>
    </div>`;

  const output = document.createElement("section");
  output.className = "page-custom-content";
  output.setAttribute("aria-label", "Custom page content");
  const footer = main.querySelector("footer");
  main.insertBefore(editor, footer || null);
  main.insertBefore(output, footer || null);

  function items() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  }

  function save(next) {
    localStorage.setItem(storageKey, JSON.stringify(next));
    render();
  }

  function escapeHTML(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function render() {
    output.innerHTML = items().map((item) => `
      <article class="page-custom-item" data-id="${item.id}">
        ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title || "Portfolio image")}">` : ""}
        <div class="page-custom-copy">
          ${item.category ? `<p class="project-kicker">${escapeHTML(item.category)}</p>` : ""}
          <h2>${escapeHTML(item.title)}</h2>${item.body ? `<p>${escapeHTML(item.body)}</p>` : ""}
          <div class="page-custom-edit editor-only">
            <input data-field="title" value="${escapeHTML(item.title)}" aria-label="Item title">
            ${"body" in item ? `<textarea data-field="body" rows="3" aria-label="Item text">${escapeHTML(item.body)}</textarea>` : ""}
            ${item.image ? `<input data-field="image" value="${escapeHTML(item.image)}" aria-label="Item image">` : ""}
            <button type="button" data-remove>Remove</button>
          </div>
        </div>
      </article>`).join("");
    output.querySelectorAll(".page-custom-item").forEach((card) => {
      card.querySelectorAll("[data-field]").forEach((field) => field.addEventListener("change", () => {
        save(items().map((item) => item.id === card.dataset.id ? { ...item, [field.dataset.field]: field.value } : item));
      }));
      card.querySelector("[data-remove]")?.addEventListener("click", () => save(items().filter((item) => item.id !== card.dataset.id)));
    });
  }

  editor.querySelectorAll("form").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = form.dataset.add;
    const next = { id: self.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, type, title: data.get("title")?.trim() || (type === "project" ? "New project" : "") };
    if (type !== "image") next.body = data.get("body")?.trim() || "";
    if (type !== "text") next.image = data.get("image")?.trim() || "";
    if (type === "project") next.category = data.get("category")?.trim() || "Architecture";
    save([...items(), next]);
    form.reset();
  }));

  render();
})();
