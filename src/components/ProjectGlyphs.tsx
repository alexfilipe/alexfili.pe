import type { ReactNode } from "react";

/**
 * Line-art project glyphs, keyed by project id (see data/projectPages.ts).
 * Faint gold stroke motifs used in the Work index tiles and the project
 * carousel visual frame. Kept here (not in the data file) because they are
 * React nodes.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

function AetherGlyph() {
  return (
    <svg viewBox="0 0 120 120" width="100%" {...stroke}>
      <path d="M34 44c17-11 35-11 52 0" />
      <path d="M34 60c17 11 35 11 52 0" />
      <path d="M34 76c17-11 35-11 52 0" />
      <path d="M48 30v60M60 30v60M72 30v60" />
      <circle cx="60" cy="60" r="5" />
    </svg>
  );
}

function InspiraGlyph() {
  return (
    <svg viewBox="0 0 120 120" width="100%" {...stroke}>
      <circle cx="60" cy="60" r="34" />
      <path d="M60 12 66 54 108 60 66 66 60 108 54 66 12 60 54 54Z" />
      <circle cx="60" cy="60" r="6" />
    </svg>
  );
}

function HomeGlyph() {
  return (
    <svg viewBox="0 0 120 120" width="100%" {...stroke}>
      <path d="M26 58 60 30 94 58" />
      <path d="M34 54v34h52V54" />
      <circle cx="60" cy="70" r="7" />
      <path d="M60 63v-9M60 77v9M53 70h-9M67 70h9" />
    </svg>
  );
}

function LabGlyph() {
  return (
    <svg viewBox="0 0 120 120" width="100%" {...stroke}>
      <path d="M52 24v26L32 88a6 6 0 0 0 6 9h44a6 6 0 0 0 6-9L68 50V24" />
      <path d="M46 24h28" />
      <path d="M41 74h38" />
      <circle cx="55" cy="82" r="2.4" />
      <circle cx="66" cy="86" r="2.4" />
    </svg>
  );
}

export const projectGlyphs: Record<string, ReactNode> = {
  aetherloom: <AetherGlyph />,
  inspirasonho: <InspiraGlyph />,
  "home-assistant": <HomeGlyph />,
  labstocker: <LabGlyph />
};
