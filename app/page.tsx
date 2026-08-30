import EditorToggle from "./editor-toggle";
import InlineTextEditor from "./inline-text-editor";
import LifeGalleryStrip from "./life-gallery-strip";

const interests = [
  { title: "Architecture", description: "Spaces, models, structures, and the ideas that shape how people live.", image: "/portfolio/river-house-2.jpg", href: "/category.html?category=architecture" },
  { title: "Electronic Engineering", description: "Circuits, prototypes, and hands-on experiments with connected systems.", image: "/portfolio/circuits.jpg", href: "/category.html?category=electronic-engineering" },
  { title: "Sports", description: "Movement, teamwork, discipline, and the energy of being active.", image: "/portfolio/bridge.jpg", href: "/category.html?category=sports" },
  { title: "Music", description: "Rhythm, expression, listening, and the creative life beyond design.", image: "/portfolio/bloom-nest.jpg", href: "/category.html?category=music" },
];

export default function Home() {
  return (
    <main className="story-home">
      <InlineTextEditor />
      <div className="corner-tools story-tools">
        <EditorToggle />
        <details className="category-menu">
          <summary className="tool-icon" aria-label="Open category menu" title="Categories">
            <span aria-hidden="true" className="menu-lines"><i /><i /><i /></span>
          </summary>
          <nav aria-label="Portfolio categories">
            <a href="/">Main Page</a>
            <a href="/category.html?category=architecture">Architecture</a>
            <a href="/category.html?category=electronic-engineering">Electronic Engineering</a>
            <a href="/category.html?category=sports">Sports</a>
            <a href="/category.html?category=music">Music</a>
          </nav>
        </details>
      </div>

      <header className="story-intro story-section">
        <p className="story-number">01 / Who I Am</p>
        <h1>Heidi&apos;s Portfolio</h1>
        <div className="story-copy story-copy-wide">
          <p>I&apos;m Heidi, a student designer and maker who enjoys turning ideas into spaces, objects, and working systems. I learn best by drawing, building, testing, and improving the details one decision at a time.</p>
          <p>My interests move between architecture, electronic engineering, sports, and music. Together, they shape how I think: structure gives me clarity, movement gives me energy, and creativity gives me room to explore.</p>
        </div>
      </header>

      <section className="interest-section story-section" aria-labelledby="interests-title">
        <div className="story-heading-row">
          <p className="story-number">02 / My Interests</p>
          <h2 id="interests-title">Four directions I keep returning to</h2>
        </div>
        <div className="interest-orbits">
          {interests.map((interest, index) => (
            <a className="interest-orbit" href={interest.href} key={interest.title}>
              <span className="interest-image">
                <img src={interest.image} alt="" />
                <span className="interest-index">0{index + 1}</span>
              </span>
              <strong>{interest.title}</strong>
              <span className="interest-description">{interest.description}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="personal-section story-section" aria-labelledby="beyond-title">
        <p className="story-number">03 / Beyond the Projects</p>
        <div className="personal-grid">
          <h2 id="beyond-title">The person behind the portfolio</h2>
          <div className="story-copy">
            <p>Outside the studio, I value curiosity, practice, and the small routines that make ambitious work possible. Sport teaches me persistence and how to contribute to a team; music gives me another language for mood, timing, and expression.</p>
            <p>I&apos;m interested not only in finished results, but in the experiences around them—people I learn from, places that stay in my memory, and everyday moments that reveal something new about how I see the world.</p>
          </div>
        </div>
      </section>

      <section className="life-section story-section" aria-labelledby="life-title">
        <div className="life-heading">
          <div>
            <p className="story-number">04 / Life in Frames</p>
            <h2 id="life-title">A few moments beyond the work</h2>
          </div>
          <a className="gallery-link" href="/photo-gallery">Open photo gallery</a>
        </div>
        <LifeGalleryStrip />
      </section>
    </main>
  );
}
