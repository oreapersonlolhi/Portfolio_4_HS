"use client";

import { useEffect, useRef, useState } from "react";

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
  const [activeImages, setActiveImages] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || editing) return;

    const centerStrip = () => {
      grid.scrollTop = grid.scrollHeight / 3;
    };
    const frame = requestAnimationFrame(centerStrip);
    const keepCircular = () => {
      const cycleHeight = grid.scrollHeight / 3;
      if (!cycleHeight) return;
      if (grid.scrollTop < cycleHeight * 0.5) grid.scrollTop += cycleHeight;
      if (grid.scrollTop >= cycleHeight * 1.5) grid.scrollTop -= cycleHeight;
    };
    grid.addEventListener("scroll", keepCircular, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      grid.removeEventListener("scroll", keepCircular);
    };
  }, [editing, covers]);

  function startFade(cover: Cover) {
    if (cover.images.length < 2) return;
    setActiveImages((current) => ({ ...current, [cover.slug]: 0 }));
    timers.current[cover.slug] = setInterval(() => {
      setActiveImages((current) => ({ ...current, [cover.slug]: ((current[cover.slug] ?? 0) + 1) % cover.images.length }));
    }, 1000);
  }

  function stopFade(slug: string) {
    clearInterval(timers.current[slug]);
    delete timers.current[slug];
    setActiveImages((current) => { const next = { ...current }; delete next[slug]; return next; });
  }

  function saveImages(slug: string, images: string[]) {
    if (!images.length) return;
    localStorage.setItem(`category-cover:${slug}`, JSON.stringify(images));
    setCovers((current) => current.map((cover) => cover.slug === slug ? { ...cover, images } : cover));
  }

  const displayedCovers = editing
    ? covers.map((cover) => ({ cover, cycle: 0 }))
    : [0, 1, 2].flatMap((cycle) => covers.map((cover) => ({ cover, cycle })));

  return <div className="category-cover-grid" ref={gridRef}>
    {displayedCovers.map(({ cover, cycle }) => <article className="category-cover-card" key={`${cycle}-${cover.slug}`}>
      <a className={`category-cover ${activeImages[cover.slug] !== undefined ? "is-hovering" : ""}`} href={cover.href} onMouseEnter={() => startFade(cover)} onMouseLeave={() => stopFade(cover.slug)}>
        <span className="category-image-strip">
          {cover.images.map((image, index) => <img className={activeImages[cover.slug] === index ? "is-active" : ""} key={`${image}-${index}`} src={appImagePath(image)} alt={`${cover.label} project ${index + 1}`} />)}
        </span>
        <span className="category-cover-label">{cover.label}</span>
      </a>
      {editing && cycle === 0 && <form className="cover-editor" onSubmit={(event) => {
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
