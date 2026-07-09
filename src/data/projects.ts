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
  logo: {
    initials: string;
    accent: string;
    webpSrc?: string;
    pngSrc?: string;
    scale?: number;
  };
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
    href: "/projects/aetherloom",
    logo: {
      initials: "Ae",
      accent: "#9fc7bd",
      webpSrc: "/images/project-logos/aetherloom.webp",
      pngSrc: "/images/project-logos/aetherloom.png"
    }
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
    href: "/projects/inspirasonho",
    logo: {
      initials: "IS",
      accent: "#d8a85f",
      webpSrc: "/images/project-logos/inspirasonho.webp",
      pngSrc: "/images/project-logos/inspirasonho.png",
      scale: 1.08
    }
  },
  {
    title: "Home Intelligence",
    description: "Open-source Home Assistant tools for readable, local-first, agentic smart-home automation.",
    focus: "Open source",
    year: "Selected",
    period: {
      start: "2025",
      end: "Present"
    },
    href: "/projects/home-intelligence",
    logo: {
      initials: "HI",
      accent: "#8fb2df",
      webpSrc: "/images/project-logos/home-intelligence.webp",
      pngSrc: "/images/project-logos/home-intelligence.png",
      scale: 1.18
    }
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
    href: "/projects/labstocker",
    logo: {
      initials: "LS",
      accent: "#cda0b4",
      webpSrc: "/images/project-logos/labstocker.webp",
      pngSrc: "/images/project-logos/labstocker.png",
      scale: 1.16
    }
  }
];
