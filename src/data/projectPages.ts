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
    focus: ["Systems", "Automation"],
    period: "2025 — Present",
    tagline: "A home that adapts without becoming a black box.",
    lede: "Home Assistant orchestration plugins in development for local-first, agentic smart-home automation — coordinating adaptive ambience, energy insights, and smart-speaker workflows across the devices people already live with.",
    sections: [
      {
        heading: "What it does for the home",
        body: [
          "Smart homes are powerful, but they often feel fragmented. Lights live in one place, speakers in another, energy usage in a utility portal, and automations become a pile of rules that work until they suddenly do not.",
          "Home Intelligence is my attempt to make the smart home feel calmer, more legible, and more useful day to day. The goal is a home that can adapt to time, presence, daylight, media, energy usage, and user intent — while still making it clear what changed, why it changed, and when a human should approve the next action.",
          "Instead of asking the user to constantly manage devices, Home Intelligence explores a coordination layer that helps the home act more like an environment: lights, displays, sound, speakers, and energy signals working together with privacy, readability, and control at the center."
        ]
      },
      {
        heading: "What I'm building",
        body: [
          "The first area is **adaptive ambience**: orchestration across lights, displays, TVs, monitors, and sound. The goal is to let the home move naturally through modes like morning, focus, evening, cinema, and night — adjusting brightness, color temperature, screen behavior, and audio atmosphere together instead of treating each device as a separate toggle.",
          "The second area is **energy intelligence**: PG&E electricity usage reports and alerts that make energy behavior easier to understand. Rather than only showing raw usage, the system is designed to surface useful signals such as usage spikes, projected bill changes, unusual baselines, and patterns worth acting on.",
          "The third area is **smart-speaker coordination**: a bridge for more seamless behavior across AirPlay, Google speakers, and AI-enabled speaker workflows. The long-term goal is device-agnostic audio and voice automation — music, announcements, assistant actions, and room-aware behavior that can work across ecosystems while remaining observable and human-approved where needed."
        ]
      },
      {
        heading: "Why it matters",
        body: [
          "A smart home should reduce friction, not create a new kind of maintenance burden.",
          "The useful version of automation is not a house that acts mysteriously. It is a house that helps with small daily decisions: dimming the room when media starts, lowering audio late at night, warning when energy usage changes, shifting displays into evening mode, or coordinating speakers without making the user remember which platform controls which device.",
          "But those actions need trust. If the home changes something, the user should be able to understand why. If the action is sensitive — speaking through a room, changing volume after quiet hours, triggering an AI-assisted routine, or affecting multiple devices at once — the system should be able to ask first.",
          "That is the design center of Home Intelligence: comfort without opacity, automation without surrendering control."
        ]
      },
      {
        heading: "Engineering direction",
        body: [
          "Home Intelligence is being designed as a set of small, composable Home Assistant plugins rather than one monolithic smart-home brain. Each plugin should solve a concrete home problem on its own, while also fitting into a broader orchestration layer.",
          "The architecture prioritizes local execution, readable event flows, graceful degradation when devices drop, and explicit approval gates for agentic actions. Where AI is involved, the goal is not unchecked autonomy. It is a system that can reason about context, suggest useful actions, coordinate devices, and remain inspectable.",
          "I'm building it from the belief that home automation should be understandable months later — not just by the person who wrote the rule, but by anyone trying to understand what the home is doing."
        ]
      },
      {
        heading: "Roadmap",
        body: [
          "The first phase focuses on adaptive ambience, PG&E energy insights, and smart-speaker coordination across AirPlay, Google speakers, and AI-enabled workflows.",
          "Planned integrations include Alexa and HomePod support, along with broader display and audio orchestration so ambience can adapt across lights, screens, and sound together.",
          "Home Intelligence is still in development and planned to be open-sourced. I'm building it as both a practical smart-home toolkit and a broader experiment in what local-first AI can feel like when it belongs to the home, not the cloud."
        ]
      }
    ],
    meta: {
      Role: "Author & maintainer",
      Timeline: "2025 — Present",
      Stack: ["Python", "Bash", "Home Assistant", "YAML", "REST APIs"],
      Focus: ["Adaptive ambience", "Energy insights", "Smart-speaker coordination"],
      Status: ["In development", "To be open-sourced"]
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
    tags: ["Python", "Bash", "Home Assistant", "YAML", "REST APIs", "Local-first", "Agentic automation"]
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
