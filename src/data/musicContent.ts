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

export type TimelineEntry = {
  when: string;
  what: string;
};

export const musicHeroStats: HeroStat[] = [
  { value: "25", label: "years, violin" },
  { value: "11", label: "years, piano" },
  { value: "1", label: "orchestra, conducted" }
];

export const pianoStats: HeroStat[] = [
  { value: "10", label: "composers" },
  { value: "20+", label: "pieces" },
  { value: "5", label: "recitals" }
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
  "Bach",
  "Beethoven",
  "Chopin",
  "Debussy",
  "Mendelssohn",
  "Mozart",
  "Schumann",
  "Shostakovich"
];

export const violinTimeline: TimelineEntry[] = [
  { when: "Age 3", what: "First lessons — Natal, Brazil" },
  { when: "Age 10", what: "Genesis Evangelical Philharmonic" },
  { when: "2011", what: "Music school, UFRN — Prof. Ronedilk Dantas" },
  { when: "2015 →", what: "Amherst Symphony Orchestra" }
];

// The conducting première embed on the Conducting movement.
export const conductingPremiere = {
  youtubeId: "XrIh9qe9_MI",
  caption: "Première · Amherst Symphony Orchestra · Spring 2020"
};
