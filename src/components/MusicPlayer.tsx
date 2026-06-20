import { useMemo, useState } from "react";

export type Recording = {
  id: string;
  title: string;
  instrument: "Piano" | "Violin" | "Conducting";
  composer: string;
  work: string;
  year: number;
  mediaType: "audio" | "video" | "external";
  url?: string;
  featured: boolean;
};

const filters = ["All", "Piano", "Violin", "Conducting"] as const;
const wave = [0.24, 0.46, 0.68, 0.36, 0.82, 0.55, 0.31, 0.72, 0.9, 0.5, 0.38, 0.76, 0.62, 0.28, 0.7, 0.88, 0.42, 0.58, 0.34, 0.8, 0.48, 0.66, 0.3, 0.74, 0.52, 0.86, 0.44, 0.6];

type Filter = (typeof filters)[number];

export default function MusicPlayer({ recordings }: { recordings: Recording[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const visibleRecordings = useMemo(() => {
    return activeFilter === "All" ? recordings : recordings.filter((recording) => recording.instrument === activeFilter);
  }, [activeFilter, recordings]);

  return (
    <div>
      <div className="filter-bar" aria-label="Filter recordings by instrument">
        {filters.map((filter) => (
          <button
            className="filter-button"
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="feature-panel" data-reveal>
        <h3>Featured Recording</h3>
        <p>
          A playable feature slot for a performance, rehearsal excerpt, or conducting video. Replace the seed entry with a
          real link when the first recording is ready.
        </p>
        <div className="wave-line" aria-hidden="true">
          {wave.map((level, index) => (
            <span key={index} style={{ "--level": level } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <div className="recording-list" style={{ marginTop: "1.5rem" }}>
        {visibleRecordings.map((recording) => (
          <article className="recording-item" key={recording.id}>
            <div className="item-kicker">{recording.instrument}</div>
            <div>
              <h2 className="item-title">{recording.title}</h2>
              <p className="item-description">
                {recording.composer}, <em>{recording.work}</em>
              </p>
              <div className="tags">
                <span className="tag">{recording.mediaType}</span>
                {recording.featured && <span className="tag">featured</span>}
              </div>
            </div>
            <div className="item-meta">
              <span>{recording.year}</span>
              {recording.url ? (
                <a className="text-button" href={recording.url}>
                  {recording.mediaType === "video" ? "Watch" : "Listen"}
                </a>
              ) : (
                <span className="text-button" aria-disabled="true">
                  Notes soon
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
