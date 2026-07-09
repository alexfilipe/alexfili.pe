export type MusicDiscipline = {
  title: string;
  description: string;
  href: string;
  homeImage: string;
};

export const musicDisciplines: MusicDiscipline[] = [
  {
    title: "Conducting",
    description: "Where my love of systems and complexity meets the artistry of shaping many voices as one.",
    href: "/music",
    homeImage: "/images/home/home-conducting.webp"
  },
  {
    title: "Piano",
    description: "The instrument I keep growing into, through discipline, harmony, memory, and form.",
    href: "/music",
    homeImage: "/images/home/home-piano.webp"
  },
  {
    title: "Violin",
    description: "My first musical language, shaped by 25 years of study, performance, and expressive precision.",
    href: "/music",
    homeImage: "/images/home/home-violin.webp"
  }
];
