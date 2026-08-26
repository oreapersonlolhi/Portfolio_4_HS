(() => {
  const cards = [...document.querySelectorAll(".category-cover-card")];

  function storedImages(card) {
    try {
      const saved = JSON.parse(localStorage.getItem(`category-cover:${card.dataset.category}`) || "null");
      return Array.isArray(saved) && saved.length ? saved : card.dataset.defaultImages.split("|");
    } catch { return card.dataset.defaultImages.split("|"); }
  }

  function render() {
    const editing = localStorage.getItem("portfolio-editor-mode") === "true";
    cards.forEach((card) => {
      const images = storedImages(card);
      card.querySelector(".category-image-strip").innerHTML = images.map((image, index) => {
        const source = image.startsWith("/portfolio/") ? `public${image}` : image;
        return `<img src="${source}" alt="${card.dataset.label} project ${index + 1}">`;
      }).join("");
      card.querySelector(".cover-editor")?.remove();
      if (!editing) return;
      const form = document.createElement("form");
      form.className = "cover-editor";
      form.innerHTML = `<label>Display pictures—one path per line</label><textarea name="images" rows="4"></textarea><button type="submit">Save pictures</button>`;
      form.querySelector("textarea").value = images.join("\n");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const next = form.elements.images.value.split("\n").map((value) => value.trim()).filter(Boolean);
        if (next.length) localStorage.setItem(`category-cover:${card.dataset.category}`, JSON.stringify(next));
        render();
      });
      card.appendChild(form);
    });
  }

  document.addEventListener("click", (event) => { if (event.target.closest(".editor-toggle")) setTimeout(render); });
  render();
})();
