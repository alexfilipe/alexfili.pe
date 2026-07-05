export type Project = {
  title: string;
  description: string;
  focus: string;
  year: string;
  period: {
    start: string;
    end: string;
  };
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Aetherloom",
    description: "A calm local-first workspace for shaping intelligent systems from personal knowledge.",
    focus: "AI systems",
    year: "2026",
    period: {
      start: "2026",
      end: "Present"
    }
  },
  {
    title: "InspiraSonho",
    description: "A thoughtful digital experience for discovery, storytelling, and emotional clarity.",
    focus: "Product design",
    year: "In progress",
    period: {
      start: "2015",
      end: "2018"
    }
  },
  {
    title: "Home Assistant Extensions",
    description: "Open-source tools that make connected homes more adaptable, legible, and humane.",
    focus: "Open source",
    year: "Selected",
    period: {
      start: "2025",
      end: "Present"
    }
  }
];
