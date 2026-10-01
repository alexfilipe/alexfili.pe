// Project detail content for the `/projects` index and `/projects/<id>` detail pages.
//
// This extends the lightweight `projects.ts` seed (used by the home carousel)
// with the full narrative each detail page needs. Keyed by `id`, which is also
// the URL slug used to deep-link into the carousel (e.g. /projects/labstocker).
//
// The line-art glyph for each project is a React node, so it lives in
// components/ProjectGlyphs.tsx keyed by this same `id` — not here (data files
// stay JSX-free).
//
// NOTE: narrative copy is Álex's own where known and illustrative elsewhere;
// review before shipping.

export type ProjectMetaValue = string | string[];
export type ProjectMeta = Record<string, ProjectMetaValue>;

export type ProjectSection = {
  heading: string;
  body: string | string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectLogo = {
  initials: string;
  accent: string;
  webpSrc?: string;
  pngSrc?: string;
  scale?: number;
};

export type ProjectPreview = {
  webpSrc: string;
  pngSrc: string;
};

export type ProjectPage = {
  id: string;
  name: string;
  focus: string[];
  period: string;
  tagline: string;
  lede: string;
  /** A "stub" project has its own external home — render just the hero + CTA. */
  stub?: boolean;
  tags: string[];
  preview: ProjectPreview;
  logo: ProjectLogo;
  sections?: ProjectSection[];
  meta?: ProjectMeta;
  link?: ProjectLink | null;
};

export const projectPages: ProjectPage[] = [
  {
    id: "aetherloom",
    name: "Aetherloom",
    focus: ["macOS", "AI systems"],
    period: "2026 — Present",
    tagline: "Your files, safely interwoven.",
    stub: true,
    lede: "An AI-first native macOS app for safe, local-first sync across iCloud Drive, Google Drive, OneDrive, and NAS-backed storage — built from a belief that your files should stay private, under your control, and never trapped inside a single cloud.",
    link: { label: "Visit aetherloom.app", href: "https://aetherloom.app/" },
    preview: {
      webpSrc: "/images/project-previews/aetherloom.webp",
      pngSrc: "/images/project-previews/aetherloom.png"
    },
    logo: {
      initials: "Ae",
      accent: "#9fc7bd",
      webpSrc: "/images/project-logos/aetherloom.webp",
      pngSrc: "/images/project-logos/aetherloom.png"
    },
    tags: ["macOS", "Swift", "Local-first", "Multi-cloud", "AI-first development", "Open source"]
  }  ,
  {
    id: "inspirasonho",
    name: "InspiraSonho",
    focus: ["Social impact", "Education"],
    period: "2015 — 2018",
    tagline: "Opportunities should not depend on who happens to hear about them.",
    lede: "A social-impact platform connecting Brazilian students to academic, extracurricular, and professional development opportunities — from scholarships and exchanges to olympiads, volunteering, and learning experiences beyond the classroom.",
    sections: [
      {
        heading: "The idea",
        body: [
          "InspiraSonho began from a simple but powerful insight: many students are not missing ambition — they are missing access to information.",
          "After returning from the Youth Ambassadors Program in the United States, my co-founder Larissa Moreira started giving talks in schools about exchange programs and academic opportunities. Again and again, students would say they had never heard of those programs before. The problem was not a lack of interest: information about opportunities was not reaching the people who could benefit from it.",
          "Talks could inspire a room. The internet could reach a country.",
          "That became the premise of InspiraSonho: use the web to connect Brazilian students with meaningful learning experiences outside the classroom — opportunities that could expand their sense of possibility, strengthen their development, and help them imagine futures they had not been shown before."
        ]
      },
      {
        heading: "What we built",
        body: [
          "Together with Larissa Moreira, I co-founded InspiraSonho and led the technical side of the project as CTO.",
          "I developed and deployed *inspirasonho.com.br*, leading the system architecture, full-stack web development, database design and administration, and production hosting. The platform became a public portal where students could discover opportunities such as scholarships, exchanges, scientific olympiads, volunteering, academic programs, and other experiences beyond the traditional classroom.",
          "The work wasn't just technical, but required translating a social mission into a usable product: making opportunities easier to find, organizing information clearly, supporting a growing team, and building a platform that could serve students across Brazil."
        ]
      },
      {
        heading: "Why it mattered",
        body: [
          "For many students, especially outside major centers of privilege, opportunity is unevenly distributed long before applications begin. Some students hear about scholarships, exchange programs, olympiads, and leadership programs through schools, networks, or family. Others only discover them too late — or never at all.",
          "InspiraSonho tried to reduce that gap.",
          "The platform’s mission was to connect students with meaningful learning experiences outside school, and its vision was to help create a new educational experience that empowered young people in their development.",
          "That mission shaped both the product and the community around it. InspiraSonho was not just a database of links. It was a way to tell students: there are paths you may not have heard about yet, and you deserve access to them."
        ]
      },
      {
        heading: "My role",
        body: [
          "As CTO, I was responsible for turning the idea into a working platform.",
          "I designed the system architecture, built the web application, modeled and administered the database, handled deployment and production hosting, and helped the team think through how the product should grow. This was one of my first experiences building software not as an isolated technical artifact, but as infrastructure for a mission-driven organization.",
          "It also taught me how much engineering depends on clarity: clear data models, clear user flows, clear editorial workflows, and clear product decisions. The platform had to make opportunity feel searchable, approachable, and actionable."
        ]
      },
      {
        heading: "Community and reach",
        body: [
          "InspiraSonho grew into a national youth-led initiative with a distributed team across Brazil. The organization described itself around values like passion, transparency, cooperation, simplicity, and creating a legacy for Brazil.",
          "The project reached more than 20,000 students and became a space where young people could discover opportunities, share experiences, and see themselves as part of a broader community of students pursuing academic, personal, and professional growth."
        ]
      },
      {
        heading: "Looking back",
        body: [
          "InspiraSonho was one of the projects that shaped how I think about technology.",
          "It showed me that software can be more than a product interface. It can be a bridge between information and people; between a student and an opportunity; between someone's current environment and a future they did not yet know how to reach.",
          "It was also where I learned to connect engineering, mission, product, and community. I was not just building pages and databases, but helping build a system for access — one that tried to make opportunity travel farther than privilege usually does."
        ]
      }
    ],
    meta: {
      Role: "Co-founder & CTO",
      Timeline: "2015 — 2018",
      Stack: ["JavaScript", "jQuery", "PHP", "MySQL", "System architecture", "Production hosting"],
      Focus: ["Access to opportunity", "Student empowerment", "Educational equity"],
      Impact: "20,000+ students reached",
      Status: ["Archived", "Handed off"]
    },
    // link: { label: "Visit inspirasonho.com.br", href: "https://www.inspirasonho.com.br/" },
    preview: {
      webpSrc: "/images/project-previews/inspirasonho.webp",
      pngSrc: "/images/project-previews/inspirasonho.png"
    },
    logo: {
      initials: "IS",
      accent: "#d8a85f",
      webpSrc: "/images/project-logos/inspirasonho.webp",
      pngSrc: "/images/project-logos/inspirasonho.png",
      scale: 1.08
    },
    tags: ["Social impact", "Education", "Full-stack", "Product strategy", "Databases"]
  },
  {
    id: "home-intelligence",
    name: "Home Intelligence",
    focus: ["Spatial interfaces", "Shared home control"],
    period: "2025–Present",
    tagline: "An interface shaped by the home itself.",
    lede: "Home Intelligence, a system I’m developing at [Living Intelligence](https://livingintelligence.xyz/), brings home automation, spatial interfaces, and custom hardware together into a single system. Built around the layout and daily life of each home, it makes connected spaces easier to understand, control, and enjoy.",
    sections: [
      {
        heading: "What it does for the home",
        body: [
          "A home is understood through its rooms, the things we do in them, and the people we share them with. Its technology should follow that same familiar structure. Adjusting the lighting or choosing where music plays should feel connected to the space around you.",
          "Home Intelligence uses the home itself to organize everything. You begin with a place, see what is happening there, and reach the controls relevant to what you want to do. Everyday actions stay close at hand, with more detailed control available when needed.",
          "The aim is shared understanding: a home that feels approachable to the people who live there and to someone visiting for the first time, who should be able to change the lights around them without asking how. That means making the relationship between a control, a room, and its effect immediately clear."
        ]
      },
      {
        heading: "What I’m building",
        body: [
          "The foundation is a spatial interface that connects the whole home to its individual rooms, activities, and devices. Each home begins with its own layout and existing systems. Lighting, music, and other controls share one interface, with what’s on or playing shown in the room where it’s happening.",
          "Music is a central focus of the current work: making playback easier to start in a room, move between spaces, and manage throughout the home. Alongside that, I’m developing more complete control of lighting and entertainment, with particular attention to making it clear where each action goes and what it will do.",
          "I’m designing the software and hardware together, shaped by what it’s like to live in a space and what people need in the moment."
        ]
      },
      {
        heading: "Why it matters",
        body: [
          "This work began in my own home, through small moments of friction: adjusting music, changing the atmosphere of a room, or helping someone else use the systems around them. Those moments made the design problem concrete.",
          "A shared space needs controls that belong to everyone in it.",
          "As a musician and engineer, I care about how a space feels as much as how its systems work. Sound, light, responsiveness, and the ease of making a small adjustment all shape whether technology feels at home in a room.",
          "Home Intelligence grows from the belief that people should be able to entrust routine complexity to a system while keeping authority over their surroundings. Automation should stay easy to follow and easy to correct. The measure of success is how much attention people can give back to the life happening around them."
        ]
      },
      {
        heading: "Engineering direction",
        body: [
          "The current system builds on Home Assistant, with custom interface work and integrations shaped by practical needs. I’m developing reusable foundations while keeping the layout, equipment, and preferences of each home distinct. Designing for daily life also means planning for setup, maintenance, and recovery from the beginning.",
          "The engineering priorities are responsive control, local operation wherever practical, accurate device state, and clear behavior when something becomes unavailable. Interoperability matters because a useful system should help the equipment people already own work together, while leaving room for future choices.",
          "Privacy and human agency guide the interaction design. Ordinary controls should remain dependable when AI or contextual sensing is unavailable. More adaptive behavior will be built around actions people can understand, correct, and override."
        ]
      },
      {
        heading: "Roadmap",
        body: [
          "Working prototypes are already in daily use in my home, where living with them is helping refine the design. The immediate focus is music in each room, moving playback between spaces, and whole-home controls, followed by deeper entertainment control and contextual behavior people can rely on.",
          "Over time, I want Home Intelligence to grow more attuned to the relationships between people, rooms, and activities, with AI helping in ways people can always see and adjust. The direction stays grounded in everyday usefulness: a home that is easier to understand, more enjoyable to live in, and able to adapt while leaving people in control."
        ]
      }
    ],
    meta: {
      Role: "Creator, product design & engineering",
      Timeline: "2025–Present",
      Stack: ["Home Assistant", "Python", "HTML", "CSS", "JavaScript", "YAML", "REST APIs"],
      Focus: ["Spatial interfaces", "Shared home control", "Local-first automation"],
      Status: ["Working prototypes", "In active development"]
    },
    // link: { label: "View on GitHub", href: "https://github.com/alexfilipe" },
    preview: {
      webpSrc: "/images/project-previews/home-intelligence.webp",
      pngSrc: "/images/project-previews/home-intelligence.png"
    },
    logo: {
      initials: "HI",
      accent: "#8fb2df",
      webpSrc: "/images/project-logos/home-intelligence.webp",
      pngSrc: "/images/project-logos/home-intelligence.png",
      scale: 1.18
    },
    tags: ["Home Assistant", "Python", "HTML", "CSS", "JavaScript", "YAML", "REST APIs", "Spatial interfaces", "Local-first"]
  },
  {
    id: "labstocker",
    name: "LabStocker",
    focus: ["Full-stack", "Chemistry research"],
    period: "2014 — 2015",
    tagline: "The project that taught me systems.",
    lede: "A cloud inventory platform for chemistry labs — built from my own research-lab experience, published at Brazilian chemistry conferences, and recognized among top national student chemistry projects.",
    sections: [
      {
        heading: "The problem",
        body: [
          "Before I studied computer science, I spent two years working in a chemistry research lab. A lot of the work depended on simple things going right: knowing which reagents were available, where they were stored, who had used them, whether they were expired, and when new materials needed to be ordered.",
          "That sounds administrative, but in a lab it affects everything. A missing reagent can stall an experiment. Poor visibility can lead to waste. Incorrect storage can create safety risks. And when the system is mostly spreadsheets, memory, and informal coordination, the lab becomes harder to run as more students, professors, and projects depend on the same materials.",
          "LabStocker came from that frustration. I wanted to build a real inventory system for chemistry labs — one that treated reagents, safety, usage, and purchasing as connected parts of the same workflow."
        ]
      },
      {
        heading: "What I built",
        body: [
          "LabStocker started as a Java desktop application and later expanded into a cloud-based web platform for managing chemical reagents and laboratory inventory.",
          "The system tracked reagents, lots, quantities, expiration dates, storage locations, users, responsible parties, loans, returns, and compatibility groups for safer chemical storage. It also included dashboards and reports for stock levels, usage patterns, and early predictive reorder planning.",
          "The goal was not only to catalog chemicals, but to help a lab make better decisions: reduce waste, avoid running out of critical materials, improve safety practices, and plan purchases with more context."
        ]
      },
      {
        heading: "Research and recognition",
        body: [
          "Under the guidance of Prof. Roberto Lima, LabStocker became both a software project and a chemistry research project — eventually presented at national conferences and recognized among Brazil's top student chemistry projects.",
          "In 2015, the project returned as *LabStocker.com*, a web platform for reagent management. That version emphasized productivity, waste reduction, safer storage through compatibility groups, cost planning, dashboards, statistical consumption forecasts, and simultaneous access across desktop, tablet, and smartphone devices.",
          "The project was also recognized among the top three Brazilian student chemistry projects at the National Brazilian Chemistry Congress in 2015 and 2016."
        ]
      },
      {
        heading: "Business prototype",
        body: [
          "LabStocker also became my first experience thinking about software as a product, not just an application.",
          "Together with two classmates, Amanda Myris and Bruno Valniery, I worked on business creation and development around the platform: who the users were, how laboratories might adopt it, how different institutions could have customized versions, and how a technical tool could become a service for schools, universities, and research labs.",
          "That part mattered: it was the first time I saw engineering, user needs, research, and product strategy meet in the same project."
        ]
      },
      {
        heading: "Engineering depth",
        body: [
          "LabStocker was one of the first projects where I had to connect engineering with real operational use cases: inventory workflows, lab safety, purchasing decisions, and the practical constraints of people sharing the same materials across different experiments.",
          "It pushed me to think beyond code complexity alone. Beyond building screens and database tables, the challenge was modeling a real domain carefully enough that the system could support decisions: what was available, what was running low, what was expiring, what needed to be reordered, and how usage patterns could inform future demand.",
          "That experience shaped how I think about software as product infrastructure — not just something that works technically, but as something that helps people coordinate, plan, and make better decisions in a real environment."
        ]
      }
    ],
    meta: {
      Role: "Co-creator & engineer",
      Timeline: "2014 — 2015",
      Stack: ["Java", "Web", "MySQL", "SQL", "Dashboards", "Predictive models"],
      Surfaces: "Desktop + web clients",
      Status: "Archived",
      Recognition: ["Published at CBQ 2014 and CBQ 2015 / Top 3 national student chemistry project"]
    },
    link: null,
    preview: {
      webpSrc: "/images/project-previews/labstocker.webp",
      pngSrc: "/images/project-previews/labstocker.png"
    },
    logo: {
      initials: "LS",
      accent: "#cda0b4",
      webpSrc: "/images/project-logos/labstocker.webp",
      pngSrc: "/images/project-logos/labstocker.png",
      scale: 1.16
    },
    tags: ["Java", "Web", "SQL", "Dashboards", "Predictive models", "Chemistry research"]
  }
];
