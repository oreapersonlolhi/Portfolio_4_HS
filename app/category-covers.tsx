"use client";

import { CSSProperties, useEffect, useState } from "react";

type Cover = { slug: string; label: string; href: string; images: string[] };

const defaults: Cover[] = [
  { slug: "architecture", label: "Architecture", href: "/category.html?category=architecture", images: ["/portfolio/river-house.png"] },
  { slug: "electronic-engineering", label: "Electronic Engineering", href: "/category.html?category=electronic-engineering", images: ["/portfolio/circuits.jpg"] },
  { slug: "music", label: "Music", href: "/category.html?category=music", images: ["/portfolio/bloom-nest.jpg"] },
  { slug: "sports", label: "Sports", href: "/category.html?category=sports", images: ["/portfolio/bridge.jpg"] },
];

const projectImages = [
  ["Micro Shelter", "/portfolio/micro-shelter.jpg"],
  ["River House", "/portfolio/river-house.png"],
  ["Villa Savoye", "/portfolio/villa-savoye.jpg"],
  ["Fallingwater", "/portfolio/fallingwater.jpg"],
  ["Forgotten Peak", "/portfolio/forgotten-peak.jpg"],
  ["Contemporary Museum", "/portfolio/contemporary-museum.jpg"],
  ["Highrise Building", "/portfolio/highrise-building.jpg"],
  ["Motel / Hotel", "/portfolio/motel-hotel.jpg"],
  ["Cradle-Cafe", "/portfolio/cradle-cafe.jpg"],
  ["Church", "/portfolio/church.jpg"],
  ["Dorm", "/portfolio/dorm.jpg"],
  ["Freehand Sketches", "/portfolio/freehand-sketch.jpg"],
  ["Circuit Studies", "/portfolio/circuits.jpg"],
] as const;

function appImagePath(image: string) {
  return image.startsWith("public/") ? `/${image.slice("public/".length)}` : image;
}

export default function CategoryCovers() {
  const [covers, setCovers] = useState(defaults);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(localStorage.getItem("portfolio-editor-mode") === "true");
    setCovers(defaults.map((cover) => {
      try {
        const saved = JSON.parse(localStorage.getItem(`category-cover:${cover.slug}`) || "null");
        return Array.isArray(saved) && saved.length ? { ...cover, images: saved } : cover;
      } catch { return cover; }
    }));
    const sync = (event: Event) => setEditing(Boolean((event as CustomEvent).detail));
    window.addEventListener("portfolio-editor-change", sync);
    return () => window.removeEventListener("portfolio-editor-change", sync);
  }, []);

  function saveImages(slug: string, images: string[]) {
    if (!images.length) return;
    localStorage.setItem(`category-cover:${slug}`, JSON.stringify(images));
    setCovers((current) => current.map((cover) => cover.slug === slug ? { ...cover, images } : cover));
  }

  return <div className="category-cover-grid">
    {covers.map((cover) => <article className="category-cover-card" key={cover.slug}>
      <a className="category-cover" href={cover.href}>
        <span className="category-image-strip">
          {cover.images.map((image, index) => <img key={`${image}-${index}`} src={appImagePath(image)} alt={`${cover.label} project ${index + 1}`} style={{ "--fade-index": index, "--fade-count": cover.images.length } as CSSProperties} />)}
        </span>
        <span className="category-cover-label">{cover.label}</span>
      </a>
      {editing && <form className="cover-editor" onSubmit={(event) => {
        event.preventDefault();
        saveImages(cover.slug, new FormData(event.currentTarget).getAll("images").map(String));
      }}>
        <label htmlFor={`cover-${cover.slug}`}>Choose one or more project pictures</label>
        <select id={`cover-${cover.slug}`} name="images" multiple size={7} defaultValue={cover.images.map(appImagePath)}>
          {projectImages.map(([title, image]) => <option value={image} key={image}>{title}</option>)}
        </select>
        <button type="submit">Save pictures</button>
      </form>}
    </article>)}
  </div>;
}
