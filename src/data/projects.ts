export type Project = {
  title: string;
  description: string;
  focus: string;
  year: string;
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Aetherloom",
    description: "A calm local-first workspace for shaping intelligent systems from personal knowledge.",
    focus: "AI systems",
    year: "2026"
  },
  {
    title: "InspiraSonho",
    description: "A thoughtful digital experience for discovery, storytelling, and emotional clarity.",
    focus: "Product design",
    year: "In progress"
  },
  {
    title: "Home Assistant Integrations & Add-ons",
    description: "Open-source tools that make connected homes more adaptable, legible, and humane.",
    focus: "Open source",
    year: "Selected"
  }
];
