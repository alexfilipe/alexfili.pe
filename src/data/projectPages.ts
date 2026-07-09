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
  body: string;
};

export type ProjectLink = {
  label: string;
  href: string;
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
    lede: "An AI-first native macOS app for safe, local-first sync across iCloud Drive, Google Drive, OneDrive, and NAS-backed storage — built from a belief that personal files, privacy, and AI-assisted workflows should remain under your control.",
    link: { label: "Visit aetherloom.app", href: "https://aetherloom.app/" },
    tags: ["macOS", "Swift", "Local-first", "Multi-cloud", "AI-first development", "Open source"]
  },
  {
    id: "inspirasonho",
    name: "InspiraSonho",
    focus: ["Product", "Social impact"],
    period: "2015 — 2018",
    tagline: "Opportunity, made findable.",
    lede: "A platform that helped 20,000+ Brazilian public-school students discover scholarships, competitions, and paths beyond the classroom — founded, designed, engineered, and operated on my own.",
    sections: [
      {
        heading: "The problem",
        body: "Life-changing opportunities existed for Brazilian students, but they were scattered across dozens of institutions, deadlines, and PDFs. The students who most needed them rarely heard in time. I wanted a single, trustworthy place that surfaced the right opportunity to the right student before the deadline passed."
      },
      {
        heading: "What I built",
        body: "A curated opportunities engine on a Django + PostgreSQL backend: a normalized schema for programs, deadlines, and eligibility; full-text search and eligibility filtering; and a moderation CMS so a small volunteer team could submit and vet listings without touching code. A scheduled digest pipeline emailed each student the handful of openings that actually matched their profile."
      },
      {
        heading: "Engineering depth",
        body: "I owned the whole stack — data modeling, backend, front end, deploys, and the on-call. The hard parts were correctness under messy real-world data (overlapping deadlines, half-specified eligibility) and keeping the digest relevant enough that students kept opening it. I tuned the matching heuristics against real engagement, and hardened the ingestion path so one malformed listing couldn't poison a send."
      }
    ],
    meta: {
      Role: "Co-founder & sole engineer",
      Timeline: "2015 — 2018",
      Stack: ["PHP", "JavaScript", "jQuery", "MySQL"],
      Scale: "20,000+ students reached",
      Status: ["Archived", "Handed off"]
    },
    // link: { label: "Visit inspirasonho.com.br", href: "https://www.inspirasonho.com.br/" },
    tags: ["Full-Stack", "Databases", "SEO"]
  },
  {
    id: "home-assistant",
    name: "Home Assistant Extensions",
    focus: ["Systems", "Automation"],
    period: "2025 — Present",
    tagline: "Automation you can actually read.",
    lede: "A set of open-source Home Assistant extensions for legible, local-first, human-in-the-loop automation — built and maintained solo, in the open.",
    sections: [
      {
        heading: "The idea",
        body: "Most smart-home automation is either a black box in someone else's cloud or an unreadable pile of YAML. I wanted the opposite: automations that run entirely on local hardware, explain their own reasoning, and always leave a human in the loop for anything consequential."
      },
      {
        heading: "What I built",
        body: "Custom Home Assistant integrations and components written in Python, plus a pattern library for local-first automations over MQTT. Each automation is self-documenting — it exposes why it fired and what it's about to do — so the system stays auditable months later when you've forgotten how you wired it."
      },
      {
        heading: "Engineering depth",
        body: "This is deliberately constrained engineering: no cloud dependency, graceful degradation when a device drops, and idempotent actions so a retry never doubles a command. I contribute fixes upstream and keep the components small and composable rather than shipping one monolithic add-on. It's independent open-source work — I set the direction, review every line, and maintain it."
      }
    ],
    meta: {
      Role: "Author & maintainer",
      Timeline: "2025 — Present",
      Stack: ["Python", "Home Assistant"],
      Focus: ["Local-first", "Auditable"],
      Status: ["Active", "Open-source (planned)"]
    },
    // link: { label: "View on GitHub", href: "https://github.com/alexfilipe" },
    tags: ["Python", "Home Assistant", "MQTT", "Local-first", "AI-first development"]
  },
  {
    id: "labstocker",
    name: "LabStocker",
    focus: ["Full-stack", "Early work"],
    period: "2014 — 2015",
    tagline: "The project that taught me systems.",
    lede: "A cloud inventory system for chemistry labs — reagent tracking, dashboards, and early predictive reorder models. One of my first major builds, and where I learned to design a system end to end.",
    sections: [
      {
        heading: "The context",
        body: "Chemistry labs run on consumables that expire, run out, and have to be reordered before an experiment stalls. The tracking was happening in spreadsheets and memory. I set out to build a real inventory system for it — shipping both a desktop client and a web version."
      },
      {
        heading: "What I built",
        body: "A relational schema for chemical inventory (reagents, lots, expiry, locations), dashboards over stock levels and burn rate, and an early predictive model that flagged reorders before a lab ran dry. Two front ends — a Java desktop app and a web app — over one shared data model."
      },
      {
        heading: "Engineering depth",
        body: "As an early project it was my first real lesson in systems design: getting the schema right so both clients could trust it, keeping the predictive logic honest against sparse historical data, and drawing a clean line between storage, logic, and presentation. Much of how I think about structure today started here — built largely on my own."
      }
    ],
    meta: {
      Role: "Co-creator & sole engineer",
      Timeline: "2014 — 2015",
      Stack: ["Java", "Web", "MySQL", "ML models"],
      Surfaces: "Desktop + web clients",
      Status: "Archived"
    },
    link: null,
    tags: ["Java", "SQL", "Dashboards", "Predictive models", "Early work"]
  }
];
