import EditorToggle from "../editor-toggle";
import PhotoGalleryClient from "./photo-gallery-client";

export default function PhotoGalleryPage() {
  return <main className="photo-gallery-page">
    <div className="corner-tools"><EditorToggle /></div>
    <p className="story-number">Personal Archive</p>
    <h1>Life in Frames</h1>
    <p className="gallery-intro">A growing collection of people, places, and everyday moments beyond the project work.</p>
    <PhotoGalleryClient />
    <p className="gallery-back"><a href="/index.html">Back to Heidi&apos;s portfolio</a></p>
  </main>;
}
