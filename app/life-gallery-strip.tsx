"use client";

import { ChangeEvent, useEffect, useState } from "react";

export type LifePhoto = { id: string; src: string; alt: string };

export const defaultLifePhotos: LifePhoto[] = [
  { id: "creative-01", src: "/portfolio/bloom-nest.jpg", alt: "A creative study from Heidi's everyday making practice" },
  { id: "creative-02", src: "/portfolio/bridge.jpg", alt: "A structural study representing curiosity and exploration" },
  { id: "creative-03", src: "/portfolio/freehand-sketch.jpg", alt: "A sketch from Heidi's personal creative process" },
  { id: "creative-04", src: "/portfolio/circuits.jpg", alt: "An electronic experiment from Heidi's hands-on practice" },
];

export const LIFE_PHOTOS_KEY = "portfolio-life-photos";

export function readLifePhotos(): LifePhoto[] {
  if (typeof window === "undefined") return defaultLifePhotos;
  try {
    const saved = JSON.parse(localStorage.getItem(LIFE_PHOTOS_KEY) || "null");
    return Array.isArray(saved) && saved.length ? saved : defaultLifePhotos;
  } catch { return defaultLifePhotos; }
}

function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not read this image."));
      image.onload = () => {
        const maxSide = 1500;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function LifeGalleryStrip() {
  const [photos, setPhotos] = useState<LifePhoto[]>(defaultLifePhotos);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPhotos(readLifePhotos());
    setEditing(localStorage.getItem("portfolio-editor-mode") === "true");
    const sync = (event: Event) => setEditing(Boolean((event as CustomEvent).detail));
    window.addEventListener("portfolio-editor-change", sync);
    return () => window.removeEventListener("portfolio-editor-change", sync);
  }, []);

  function save(next: LifePhoto[]) {
    setPhotos(next);
    localStorage.setItem(LIFE_PHOTOS_KEY, JSON.stringify(next));
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files || [])].slice(0, Math.max(0, 12 - photos.length));
    if (!files.length) return;
    try {
      const added = await Promise.all(files.map(async (file, index) => ({ id: `life-${Date.now()}-${index}`, src: await resizePhoto(file), alt: file.name.replace(/\.[^.]+$/, "") })));
      save([...photos, ...added]);
      setStatus(`${added.length} photo${added.length === 1 ? "" : "s"} added.`);
    } catch { setStatus("One of those photos could not be added."); }
    event.target.value = "";
  }

  return <>
    <div className="life-film" aria-label="Scrollable life photo strip">
      {photos.map((photo, index) => <article className="life-frame" key={photo.id}>
        <a href={`/photo-gallery?photo=${index + 1}`} aria-label={`Open ${photo.alt} in the photo gallery`}><img src={photo.src} alt={photo.alt} /></a>
        {editing && <button type="button" onClick={() => {
          const next = photos.filter((item) => item.id !== photo.id);
          save(next.length ? next : defaultLifePhotos);
          setStatus("Photo removed.");
        }}>Remove</button>}
      </article>)}
    </div>
    {editing && <div className="life-editor editor-only">
      <label className="life-upload">Add personal photos<input type="file" accept="image/*" multiple onChange={addPhotos} /></label>
      <button type="button" onClick={() => { localStorage.removeItem(LIFE_PHOTOS_KEY); setPhotos(defaultLifePhotos); setStatus("Life photos reset."); }}>Reset photos</button>
      <p aria-live="polite">{status}</p>
    </div>}
  </>;
}
