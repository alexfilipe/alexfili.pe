// Music page content — recordings, repertoire, timeline, and hero stats for
// the `/music` page (MusicPage.tsx). The three-discipline seed copy used by the
// home carousel still lives in `music.ts`; this file holds the deeper page
// content. Recording IDs are real YouTube video IDs.

export type HeroStat = {
  value: string;
  label: string;
};

export type Recording = {
  work: string;
  date: string;
  youtubeId: string;
};

export type RichTextPart = string | { bold: string } | { emphasis: string } | { sup: string };
export type RichText = string | readonly RichTextPart[];

export type TimelineEntry = {
  when: string;
  what: {
    main: RichText;
    detail?: RichText;
  };
};

export type MusicMovement = {
  id: "conducting" | "piano" | "violin";
  label: string;
  numeral: string;
  kicker: string;
  title: string;
  lede: RichText;
  body: RichText[];
};

export const musicPageContent = {
  nav: {
    work: "Work",
    music: "Music"
  },
  sectionNavLabel: "Movements",
  hero: {
    eyebrow: ["Violin", "Piano", "Conducting"],
    title: "Music",
    lede: [
      "The discipline that taught me how listen deeply, perform with intention, and turn structure into expression.",
      [
        "Three musical paths, one lifelong question — ",
        { emphasis: "what makes structure feel meaningful" },
        " — worked out in sound and interpretation before I ever worked it out in systems."
      ]
    ],
    scrollCue: "Prélude"
  }
} as const;

export const musicMovements: MusicMovement[] = [
  {
    id: "conducting",
    label: "Conducting",
    numeral: "I",
    kicker: "Movement I",
    title: "Conducting",
    lede: "In 2018, I began following one of the oldest dreams I had as a musician: to stand in front of a full orchestra and shape many voices into a cohesive whole.",
    body: [
      [
        "That dream became real in spring 2020, when I made my ",
        { bold: "conducting première" },
        " with the Amherst Symphony Orchestra, leading Schumann’s Piano Concerto in A minor, Op. 54, with Faith Wen as soloist. To close my senior year by conducting the orchestra I had been part of for four years felt deeply personal — stepping into the music from the other side."
      ],
      "With the mentorship of Mark Swanson, the orchestra’s director, I learned not only to study a score and lead through gestures, but to rehearse a full group of musicians — to listen across sections, make decisions in real time, and guide a collective interpretation.",
      "It remains one of the most complex musical achievements I have pursued, and one of the clearest reminders that you never stop learning how music works. In San Francisco, those skills continue to shape how I lead rehearsals for music groups today: with intention, knowledge, and musicality."
    ]
  },
  {
    id: "piano",
    label: "Piano",
    numeral: "II",
    kicker: "Movement II",
    title: "Piano",
    lede: "In 2015, with almost no experience, I decided to learn the piano — and devoted myself to it with an intensity that changed the course of my musical life.",
    body: [
      [
        "During my four years at Amherst, I studied with Chonghyo Shin, built a technique I never thought I would reach, and performed my ",
        { bold: "Senior Piano Recital" },
        "  in March 2020."
      ],
      [
        "After college, piano stayed with me as a serious part of my musical life. I practice almost every day and have since performed three more piano recitals, with another planned for ",
        { bold: "December 2026" },
        ", featuring works by Mozart, Chopin, Haydn, and Scarlatti."
      ],
      [
        "Piano also deepened my work as a conductor: learning to perform multiple voices at once, each with care and musical independence, changed the way I hear and shape an ensemble. It also taught me that patience and persistence are worth carrying into every area of life — because the results, when they finally arrive, are profoundly fulfilling."
      ]
    ]
  },
  {
    id: "violin",
    label: "Violin",
    numeral: "III",
    kicker: "Movement III",
    title: "Violin",
    lede: "My first musical language. I picked up the violin at three and have never really put it down.",
    body: [
      "It carried me from a church philharmonic in Natal at ten, to the conservatory at the Federal University of Rio Grande do Norte in 2011, and later to the Amherst Symphony Orchestra. At Amherst, I played every semester throughout all my college years, led the second violin section, and joined a few chamber programs each season.",
      "When I lived in Germany in 2017, I also brought the violin into a different musical space, performing pop music on violin and keyboard with a band I put together with other international students for university events.",
      "In San Francisco, it continues through string quartets, music groups, recitals, and musical lounges — keeping chamber music present in my life in a more intimate, living way, while also making space for pop music and improvisation with friends. Music has become one of the ways I build community here."
    ]
  }
];

export const musicHeroStats: HeroStat[] = [
  { value: "25", label: "years, violin" },
  { value: "11", label: "years, piano" },
  { value: "1", label: "orchestra, conducted" }
];

export const pianoStats: HeroStat[] = [
  { value: "16+", label: "composers" },
  { value: "30+", label: "pieces" },
  { value: "9", label: "recitals" }
];

export const pianoRecordings: Recording[] = [
  { work: "Schumann — Waldszenen, IX. Abschied", date: "Spring 2019", youtubeId: "7NPFA9gCj2U" },
  { work: "Beethoven — Sonata No. 9 in E major", date: "Spring 2020", youtubeId: "9mSmzKIhLGQ" },
  { work: "Mendelssohn — Lieder ohne Worte", date: "Fall 2019", youtubeId: "yTd5lKQPRFc" },
  { work: "Beethoven — Sonata No. 1, I. Allegro", date: "Spring 2018", youtubeId: "vKXtz-HLZT4" },
  { work: "Shostakovich — Three Fantastic Dances", date: "Spring 2020", youtubeId: "ZGlney794v8" },
  { work: "Bach — Italian Concerto in F major", date: "Fall 2019", youtubeId: "WeLP514__i0" }
];

export const repertoireComposers: string[] = [
  "Mozart",
  "Chopin",
  "Bach",
  "Beethoven",
  "Debussy",
  "Schumann",
  "Brahms",
  "Haydn",
  "Mendelssohn",
  "Schubert",
  "Scarlatti",
  "Shostakovich",
  "Glass",
  "Satie",
  "Sibelius"
];

export const violinTimeline: TimelineEntry[] = [
  { when: "Age 3", what: { main: "First lessons", detail: "Natal, Brazil" } },
  { when: "Age 10", what: { main: "Genesis Philharmonic Orchestra", detail: "Natal, Brazil" } },
  { when: "2011", what: { main: "Conservatory lessons", detail: "Prof. Ronedilk Dantas" } },
  { when: "2015", what: { main: "Amherst Symphony Orchestra", detail: ["Principal 2", { sup: "nd" }, " Violin"] } },
  { when: "2017", what: { main: "Pop violin & keyboard", detail: "International student band, Germany" } },
  { when: "2025—", what: { main: "String quartets & recitals", detail: "San Francisco" } }
];

// The conducting première embed on the Conducting movement.
export const conductingPremiere = {
  youtubeId: "XrIh9qe9_MI",
  caption: "Première · Amherst Symphony Orchestra\nSpring 2020",
  title: "Conducting première — Schumann Piano Concerto in A minor"
};
