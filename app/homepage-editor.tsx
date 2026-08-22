"use client";

import { FormEvent, useEffect, useState } from "react";

type CustomItem =
  | { id: string; type: "text"; title: string; body: string }
  | { id: string; type: "image"; title: string; image: string }
  | { id: string; type: "project"; title: string; body: string; image: string; category: string };

const TITLE_KEY = "portfolio-main-title";
const ITEMS_KEY = "portfolio-home-custom-items";

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export function EditableHomepageTitle() {
  const [title, setTitle] = useState("Heidi's Portfolio");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(localStorage.getItem(TITLE_KEY) || "Heidi's Portfolio");
    const sync = (event: Event) => setEditing(Boolean((event as CustomEvent).detail));
    setEditing(localStorage.getItem("portfolio-editor-mode") === "true");
    window.addEventListener("portfolio-editor-change", sync);
    return () => window.removeEventListener("portfolio-editor-change", sync);
  }, []);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("title")?.toString().trim();
    if (!value) return;
    localStorage.setItem(TITLE_KEY, value);
    setTitle(value);
  }

  return (
    <>
      <h1>{title}</h1>
      {editing && (
        <form className="inline-title-editor" onSubmit={save}>
          <label htmlFor="homepage-title">Main portfolio title</label>
          <div><input id="homepage-title" name="title" defaultValue={title} /><button type="submit">Save title</button></div>
        </form>
      )}
    </>
  );
}

export default function HomepageEditor() {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<CustomItem[]>([]);

  useEffect(() => {
    setEditing(localStorage.getItem("portfolio-editor-mode") === "true");
    try { setItems(JSON.parse(localStorage.getItem(ITEMS_KEY) || "[]")); } catch { setItems([]); }
    const sync = (event: Event) => setEditing(Boolean((event as CustomEvent).detail));
    window.addEventListener("portfolio-editor-change", sync);
    return () => window.removeEventListener("portfolio-editor-change", sync);
  }, []);

  function save(next: CustomItem[]) {
    setItems(next);
    localStorage.setItem(ITEMS_KEY, JSON.stringify(next));
  }

  function addText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title")?.toString().trim() || "New section";
    const body = data.get("body")?.toString().trim() || "";
    save([...items, { id: newId(), type: "text", title, body }]);
    event.currentTarget.reset();
  }

  function addImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const image = data.get("image")?.toString().trim();
    if (!image) return;
    save([...items, { id: newId(), type: "image", title: data.get("title")?.toString().trim() || "", image }]);
    event.currentTarget.reset();
  }

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = data.get("title")?.toString().trim();
    const image = data.get("image")?.toString().trim();
    if (!title || !image) return;
    save([...items, {
      id: newId(), type: "project", title, image,
      category: data.get("category")?.toString().trim() || "Architecture",
      body: data.get("body")?.toString().trim() || "",
    }]);
    event.currentTarget.reset();
  }

  function update(id: string, field: string, value: string) {
    save(items.map((item) => item.id === id ? { ...item, [field]: value } as CustomItem : item));
  }

  return (
    <>
      {editing && (
        <section className="homepage-editor" aria-label="Homepage editor controls">
          <p className="section-label">Editor mode</p>
          <h2>Add something to your homepage</h2>
          <div className="editor-form-grid">
            <form onSubmit={addText}><h3>Text section</h3><input name="title" placeholder="Section title" /><textarea name="body" placeholder="Write your text" rows={4} /><button type="submit">Add text</button></form>
            <form onSubmit={addImage}><h3>Picture</h3><input name="title" placeholder="Picture caption" /><input name="image" placeholder="Image URL or /portfolio/image.jpg" required /><button type="submit">Add picture</button></form>
            <form onSubmit={addProject}><h3>Project</h3><input name="title" placeholder="Project title" required /><input name="category" placeholder="Category" /><input name="image" placeholder="Image URL or /portfolio/image.jpg" required /><textarea name="body" placeholder="Project description" rows={3} /><button type="submit">Add project</button></form>
          </div>
        </section>
      )}

      {items.length > 0 && <section className="custom-home-grid" aria-label="Custom homepage content">
        {items.map((item) => <article className={`custom-home-item custom-${item.type}`} key={item.id}>
          {"image" in item && <img src={item.image} alt={item.title || "Portfolio image"} />}
          <div className="custom-item-copy">
            {item.type === "project" && <p className="project-kicker">{item.category}</p>}
            <h2>{item.title}</h2>
            {"body" in item && <p>{item.body}</p>}
            {editing && <div className="custom-item-editor">
              <input value={item.title} aria-label="Item title" onChange={(e) => update(item.id, "title", e.target.value)} />
              {"body" in item && <textarea value={item.body} aria-label="Item text" rows={3} onChange={(e) => update(item.id, "body", e.target.value)} />}
              {"image" in item && <input value={item.image} aria-label="Item image" onChange={(e) => update(item.id, "image", e.target.value)} />}
              <button type="button" onClick={() => save(items.filter((current) => current.id !== item.id))}>Remove</button>
            </div>}
          </div>
        </article>)}
      </section>}
    </>
  );
}
