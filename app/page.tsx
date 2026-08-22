import Image from "next/image";
import EditorToggle from "./editor-toggle";
import HomepageEditor, { EditableHomepageTitle } from "./homepage-editor";
import InlineTextEditor from "./inline-text-editor";

type Project = {
  id: string;
  title: string;
  category: "Architecture" | "Electronic Engineering";
  image: string;
  alt: string;
  year: string;
  summary: string;
  notes: string[];
};

const projects: Project[] = [
  {
    id: "micro-shelter",
    title: "Micro Shelter",
    category: "Architecture",
    image: "/portfolio/micro-shelter.jpg",
    alt: "Architectural concept image for a compact Hong Kong micro shelter.",
    year: "2026",
    summary:
      "A compact housing study exploring privacy, density, and livable space in a small urban footprint.",
    notes: [
      "Studied Hong Kong micro-living conditions and spatial constraints.",
      "Tested how furniture, circulation, and daylight can make a small room feel usable.",
      "Developed the project through reference images, model views, and final presentation studies.",
    ],
  },
  {
    id: "river-house",
    title: "River House",
    category: "Architecture",
    image: "/portfolio/river-house.png",
    alt: "River House architectural study with site and form exploration.",
    year: "2026",
    summary:
      "A residential design that studies how a building can sit near water while keeping a calm connection to landscape.",
    notes: [
      "Explored massing, views, and the relationship between structure and terrain.",
      "Used multiple views to test how the house meets the river edge.",
      "Focused on balance between shelter, openness, and site movement.",
    ],
  },
  {
    id: "villa-savoye",
    title: "Villa Savoye Plastic Set",
    category: "Architecture",
    image: "/portfolio/villa-savoye.jpg",
    alt: "Plastic model study inspired by Villa Savoye.",
    year: "2023",
    summary:
      "A physical architecture study using plastic components to understand proportion, elevation, and modernist form.",
    notes: [
      "Built from modular pieces to study planes, columns, and clean architectural geometry.",
      "Observed how simple forms can create strong spatial rhythm.",
      "Used the model as a way to learn from an important architectural precedent.",
    ],
  },
  {
    id: "fallingwater",
    title: "Fallingwater Wood Set",
    category: "Architecture",
    image: "/portfolio/fallingwater.jpg",
    alt: "Wood architectural model study inspired by Fallingwater.",
    year: "2025",
    summary:
      "A wood model study focused on layered horizontal forms, cantilevers, and the dialogue between building and nature.",
    notes: [
      "Explored material warmth and structural layering through model construction.",
      "Compared overlapping planes and supports to understand balance.",
      "Practiced precision, patience, and assembly through a physical build.",
    ],
  },
  {
    id: "forgotten-peak",
    title: "Forgotten Peak Middle-High School",
    category: "Architecture",
    image: "/portfolio/forgotten-peak.jpg",
    alt: "Architecture project image for Forgotten Peak Middle-High School.",
    year: "2026",
    summary:
      "A school design concept considering learning spaces, circulation, and a memorable campus identity.",
    notes: [
      "Designed around how students move between public, shared, and quieter areas.",
      "Explored how a school can feel both structured and welcoming.",
      "Used the project to connect architecture with daily student experience.",
    ],
  },
  {
    id: "contemporary-museum",
    title: "Contemporary Museum",
    category: "Architecture",
    image: "/portfolio/contemporary-museum.jpg",
    alt: "Contemporary museum architecture study.",
    year: "2026",
    summary:
      "A museum concept studying public space, exhibition flow, and the way visitors encounter art and architecture.",
    notes: [
      "Organized galleries and open areas around the visitor journey.",
      "Considered how scale and light can make a museum feel calm but active.",
      "Developed the project as both an architecture and art-viewing experience.",
    ],
  },
  {
    id: "highrise-building",
    title: "Highrise Building",
    category: "Architecture",
    image: "/portfolio/highrise-building.jpg",
    alt: "Highrise building architecture study.",
    year: "2026",
    summary:
      "A vertical architecture study exploring height, structure, and repeated spatial systems.",
    notes: [
      "Studied repeated floors, facade rhythm, and the relationship between base and tower.",
      "Used multiple views to compare the overall massing with smaller details.",
      "Practiced organizing a complex building into a clear visual system.",
    ],
  },
  {
    id: "motel-hotel",
    title: "Motel / Hotel",
    category: "Architecture",
    image: "/portfolio/motel-hotel.jpg",
    alt: "Motel and hotel architecture study.",
    year: "2026",
    summary:
      "A hospitality design study about rooms, circulation, privacy, and the feeling of arrival.",
    notes: [
      "Considered how guests move from public entry spaces into more private rooms.",
      "Tested repeated room modules and how they combine into a larger building.",
      "Focused on making the project readable as both a plan and an experience.",
    ],
  },
  {
    id: "cradle-cafe",
    title: "Cradle-Cafe",
    category: "Architecture",
    image: "/portfolio/cradle-cafe.jpg",
    alt: "Cradle-Cafe architecture study.",
    year: "2026",
    summary:
      "A small public-space concept combining cafe atmosphere with a soft, welcoming architectural form.",
    notes: [
      "Explored how a cafe can feel protected, warm, and open at the same time.",
      "Used form and enclosure to suggest a calm place for gathering.",
      "Balanced expressive shape with practical circulation and seating space.",
    ],
  },
  {
    id: "church",
    title: "Church",
    category: "Architecture",
    image: "/portfolio/church.jpg",
    alt: "Church architecture study.",
    year: "2026",
    summary:
      "A sacred-space study focused on light, quietness, gathering, and architectural atmosphere.",
    notes: [
      "Studied how height, openings, and simple forms can create a contemplative mood.",
      "Explored procession and the relationship between entrance, seating, and focal space.",
      "Practiced designing emotional experience through architecture.",
    ],
  },
  {
    id: "dorm",
    title: "Something Like a Dorm",
    category: "Architecture",
    image: "/portfolio/dorm.jpg",
    alt: "Dorm architecture study.",
    year: "2026",
    summary:
      "A student-housing concept exploring shared living, privacy, and daily routines.",
    notes: [
      "Organized spaces around the balance between individual rooms and common areas.",
      "Considered how circulation can make a dorm feel social but not crowded.",
      "Connected the project to boarding-school life and how students use space every day.",
    ],
  },
  {
    id: "freehand-sketch",
    title: "Freehand Sketches",
    category: "Architecture",
    image: "/portfolio/freehand-sketch.jpg",
    alt: "Freehand sketch study showing observation and drawing practice.",
    year: "2026",
    summary:
      "A chronological sketching study showing observation, line confidence, and form exploration.",
    notes: [
      "Practiced drawing by hand to improve proportion and visual memory.",
      "Used quick linework to capture structure before adding detail.",
      "Kept the work loose enough to show process and decision-making.",
    ],
  },
  {
    id: "circuits",
    title: "Circuit Studies",
    category: "Electronic Engineering",
    image: "/portfolio/circuits.jpg",
    alt: "Electronic engineering circuit prototype with wires and components.",
    year: "2022",
    summary:
      "Electronic Engineering experiments with circuits, components, testing, and hands-on prototyping.",
    notes: [
      "Built and tested circuit arrangements with physical components.",
      "Used wiring and boards to understand how systems connect and respond.",
      "Shows curiosity across making, engineering, and visual design.",
    ],
  },
];

const frontPageProjects = projects.slice(0, 6);
function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      className="project-card"
      href={`/project.html?project=${project.id}`}
      id={project.id}
    >
      <div className="project-image-wrap">
        <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />
      </div>
      <div className="project-copy">
        <div className="project-kicker">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="notes-label">Process notes</div>
        <ul>
          {project.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <span className="open-link">Open project gallery</span>
      </div>
    </a>
  );
}

export default function Home() {
  return (
    <main>
      <InlineTextEditor />
      <header className="hero">
        <div className="corner-tools">
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
        <p className="eyebrow">Personal Portfolio</p>
        <EditableHomepageTitle />
        <div className="intro-row">
          <div>
            <h2>Selected Work</h2>
            <div className="rule" />
          </div>
          <p>
            A collection of selected works exploring form, structure, systems,
            and the creative process behind making things by hand.
          </p>
        </div>
      </header>

      <section className="category-intro" id="architecture">
        <p className="section-label">Architecture + Physical Work</p>
        <h2>Selected models, spatial studies, and physical builds</h2>
      </section>

      <section className="project-grid" aria-label="Selected portfolio projects">
        {frontPageProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </section>

      <div className="category-link-row">
        <a href="/category.html?category=architecture">See all architecture projects</a>
      </div>

      <HomepageEditor />

      <footer id="electronic-engineering">
        <p>Thank you for taking the time to explore my work.</p>
        <p>I look forward to continuing to learn, create, and build.</p>
      </footer>
    </main>
  );
}
