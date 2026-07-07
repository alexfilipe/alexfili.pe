// Essay content for the `/essays` index and `/essay` reader.
//
// This is the reader-shaped source (id / title / date / read / excerpt / body).
// It is separate from `essays.ts`, which holds the short home-carousel shape
// (title / summary / legend / href / upcoming) — leave that one for the home.
//
// `id` is the URL hash used to open a specific essay in the reader
// (e.g. /essay#eleven-years).
//
// IMPORTANT: body + excerpt text is placeholder lorem ipsum. Replace with
// Álex's own writing before shipping (or move bodies to MDX in
// src/content/essays/ — see README).

export type EssayBlock = {
  type: "p" | "h" | "q";
  text: string;
};

export type Essay = {
  id: string;
  title: string;
  date: string;
  read: string;
  excerpt: string;
  body: EssayBlock[];
};

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.",
  "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis.",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur at vero eos."
];

const SUBHEADS = ["Sed ut perspiciatis", "Nemo enim ipsam", "On the longer view", "Quo minus id"];

function makeBody(offset: number): EssayBlock[] {
  const at = (n: number) => LOREM[(offset + n) % LOREM.length];
  return [
    { type: "p", text: at(0) },
    { type: "p", text: at(1) },
    { type: "h", text: SUBHEADS[offset % SUBHEADS.length] },
    { type: "p", text: at(2) },
    { type: "p", text: at(3) },
    { type: "q", text: at(7) },
    { type: "h", text: SUBHEADS[(offset + 1) % SUBHEADS.length] },
    { type: "p", text: at(4) },
    { type: "p", text: at(5) },
    { type: "p", text: at(6) }
  ];
}

export const essayEntries: Essay[] = [
  {
    id: "eleven-years",
    title: "Eleven Years Away From Brazil",
    date: "7 July 2026",
    read: "6 min read",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    body: makeBody(0)
  },
  {
    id: "why-i-practice",
    title: "Why I Still Practice",
    date: "June 2026",
    read: "5 min read",
    excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    body: makeBody(2)
  },
  {
    id: "structure-and-meaning",
    title: "On Structure and Meaning",
    date: "May 2026",
    read: "7 min read",
    excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
    body: makeBody(4)
  },
  {
    id: "learning-to-listen",
    title: "Learning to Listen",
    date: "April 2026",
    read: "4 min read",
    excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia.",
    body: makeBody(5)
  }
];
