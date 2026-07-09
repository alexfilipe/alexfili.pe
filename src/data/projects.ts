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
    description: "An AI-first native macOS app for safe, local-first sync across multiple clouds and personal storage.",
    focus: "AI systems",
    year: "2026",
    period: {
      start: "2026",
      end: "Present"
    },
    href: "/projects/aetherloom"
  },
  {
    title: "InspiraSonho",
    description: "A social-impact platform that helped 20,000+ Brazilian students discover opportunities beyond the classroom.",
    focus: "Product design",
    year: "In progress",
    period: {
      start: "2015",
      end: "2018"
    },
    href: "/projects/inspirasonho"
  },
  {
    title: "Home Assistant Extensions",
    description: "Open-source smart-home tools for legible, local-first, human-in-the-loop automation.",
    focus: "Open source",
    year: "Selected",
    period: {
      start: "2025",
      end: "Present"
    },
    href: "/projects/home-assistant"
  },
  {
    title: "LabStocker",
    description: "One of my first major software projects: a cloud inventory system for chemistry labs, with dashboards and early predictive models.",
    focus: "Open source",
    year: "Selected",
    period: {
      start: "2014",
      end: "2015"
    },
    href: "/projects/labstocker"
  }
];
