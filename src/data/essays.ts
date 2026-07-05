export type Writing = {
  title: string;
  summary: string;
  legend: string;
  href: string;
  upcoming?: boolean;
};

export const essays: Writing[] = [
  {
    title: "11 Years Away From Brazil",
    summary: "I left Brazil when I was still becoming myself; eleven years later, I'm still learning how to belong to the life I built abroad.",
    legend: "7 July 2026",
    href: "#"
  },
  {
    title: "Why I Still Practice",
    summary: "After 25 years with the violin and 11 with the piano, I’m still drawn to the slow, stubborn work of getting better.",
    legend: "July 2026",
    href: "#",
    upcoming: true
  }
  // },
  // {
  //   title: "Why Elevators Feel Slow",
  //   summary: "A small treatise on waiting, coordination, and why the machines we use every day still feel underdesigned.",
  //   legend: "July 2026",
  //   href: "#"
  // }
];
