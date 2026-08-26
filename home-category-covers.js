(() => {
  const cards = [...document.querySelectorAll(".category-cover-card")];
  const timers = new WeakMap();

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
      const link = card.querySelector(".category-cover");
      link.onmouseenter = () => {
        const pictures = [...link.querySelectorAll("img")];
        if (pictures.length < 2) return;
        let active = 0;
        link.classList.add("is-hovering");
        pictures[0].classList.add("is-active");
        timers.set(link, setInterval(() => {
          pictures[active].classList.remove("is-active");
          active = (active + 1) % pictures.length;
          pictures[active].classList.add("is-active");
        }, 1000));
      };
      link.onmouseleave = () => {
        clearInterval(timers.get(link));
        link.classList.remove("is-hovering");
        link.querySelectorAll("img").forEach((image) => image.classList.remove("is-active"));
      };
      card.querySelector(".cover-editor")?.remove();
      if (!editing) return;
      const form = document.createElement("form");
      form.className = "cover-editor";
      const choices = window.PORTFOLIO_PROJECTS.map((project) => `<option value="${project.cover}" ${images.includes(project.cover) ? "selected" : ""}>${project.title}</option>`).join("");
      form.innerHTML = `<label>Choose one or more project pictures</label><select name="images" multiple size="7">${choices}</select><button type="submit">Save pictures</button>`;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const next = [...form.elements.images.selectedOptions].map((option) => option.value);
        if (next.length) localStorage.setItem(`category-cover:${card.dataset.category}`, JSON.stringify(next));
        render();
      });
      card.appendChild(form);
    });
  }

  document.addEventListener("click", (event) => { if (event.target.closest(".editor-toggle")) setTimeout(render); });
  render();
})();
