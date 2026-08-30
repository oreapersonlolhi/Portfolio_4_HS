"use client";

import { useEffect, useRef, useState } from "react";

type Interest = { slug: string; title: string; description: string; images: string[]; href: string };

const interests: Interest[] = [
  { slug: "architecture", title: "Architecture", description: "Spaces, models, structures, and the ideas that shape how people live.", images: ["/portfolio/river-house-2.jpg"], href: "/category.html?category=architecture" },
  { slug: "electronic-engineering", title: "Electronic Engineering", description: "Circuits, prototypes, and hands-on experiments with connected systems.", images: ["/portfolio/circuits.jpg"], href: "/category.html?category=electronic-engineering" },
  { slug: "sports", title: "Sports", description: "Movement, teamwork, discipline, and the energy of being active.", images: ["/portfolio/bridge.jpg"], href: "/category.html?category=sports" },
  { slug: "music", title: "Music", description: "Rhythm, expression, listening, and the creative life beyond design.", images: ["/portfolio/bloom-nest.jpg"], href: "/category.html?category=music" },
];

function imagePath(image: string) {
  return image.startsWith("public/") ? `/${image.slice("public/".length)}` : image;
}

export default function InterestOrbits() {
  const [items, setItems] = useState(interests);
  const [active, setActive] = useState<Record<string, number | undefined>>({});
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    setItems(interests.map((interest) => {
      try {
        const saved = JSON.parse(localStorage.getItem(`category-cover:${interest.slug}`) || "null");
        return Array.isArray(saved) && saved.length ? { ...interest, images: saved.map(String) } : interest;
      } catch { return interest; }
    }));
    return () => Object.values(timers.current).forEach(clearInterval);
  }, []);

  function start(interest: Interest) {
    if (interest.images.length < 2 || timers.current[interest.slug]) return;
    setActive((current) => ({ ...current, [interest.slug]: 0 }));
    timers.current[interest.slug] = setInterval(() => {
      setActive((current) => ({ ...current, [interest.slug]: ((current[interest.slug] ?? 0) + 1) % interest.images.length }));
    }, 1000);
  }

  function stop(slug: string) {
    clearInterval(timers.current[slug]);
    delete timers.current[slug];
    setActive((current) => ({ ...current, [slug]: undefined }));
  }

  return <div className="interest-orbits">
    {items.map((interest, index) => {
      const activeImage = active[interest.slug];
      return <a className="interest-orbit" data-category={interest.slug} href={interest.href} key={interest.title}
        onMouseEnter={() => start(interest)} onMouseLeave={() => stop(interest.slug)}
        onFocus={() => start(interest)} onBlur={() => stop(interest.slug)}>
        <span className={`interest-image ${activeImage !== undefined ? "is-cycling" : ""}`}>
          {interest.images.map((image, imageIndex) => <img className={activeImage === imageIndex ? "is-active" : ""}
            src={imagePath(image)} alt={`${interest.title} project ${imageIndex + 1}`} key={`${image}-${imageIndex}`} />)}
          <span className="interest-index">0{index + 1}</span>
        </span>
        <strong>{interest.title}</strong>
        <span className="interest-description">{interest.description}</span>
      </a>;
    })}
  </div>;
}
