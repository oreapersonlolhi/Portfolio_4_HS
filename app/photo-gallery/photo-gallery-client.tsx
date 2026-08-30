"use client";

import { useEffect, useState } from "react";
import { defaultLifePhotos, LifePhoto, readLifePhotos } from "../life-gallery-strip";

export default function PhotoGalleryClient() {
  const [photos, setPhotos] = useState<LifePhoto[]>(defaultLifePhotos);
  useEffect(() => setPhotos(readLifePhotos()), []);
  return <div className="life-gallery-grid">
    {photos.map((photo, index) => <figure id={`photo-${index + 1}`} key={photo.id}>
      <img src={photo.src} alt={photo.alt} />
      <figcaption>{String(index + 1).padStart(2, "0")} / {photo.alt}</figcaption>
    </figure>)}
  </div>;
}
