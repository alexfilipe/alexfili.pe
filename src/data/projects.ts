export type Project = {
  title: string;
  description: string;
  focus: string;
  year: string;
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Intelligent Systems",
    description:
      "Production software shaped by model behavior, evaluation loops, and interfaces that make AI systems legible to the people using them.",
    focus: "AI engineering",
    year: "Current"
  },
  {
    title: "Mathematical Interfaces",
    description:
      "Tools and visual systems that turn abstract structure into something navigable, inspectable, and calm under pressure.",
    focus: "Product engineering",
    year: "Selected"
  },
  {
    title: "Classical Computation",
    description:
      "A personal research thread connecting musical form, notation, interpretation, and the design of precise computational systems.",
    focus: "Research notes",
    year: "Ongoing"
  }
];
