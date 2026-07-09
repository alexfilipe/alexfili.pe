import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { projectGlyphs } from "@/components/ProjectGlyphs";
import { projectPages, type ProjectMetaValue } from "@/data/projectPages";
import { profile } from "@/data/profile";

function SpacedMetadata({ value, className }: { value: ProjectMetaValue; className?: string }) {
  const parts = Array.isArray(value) ? value : [value];

  return (
    <span className={["spaced-meta", className].filter(Boolean).join(" ")}>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 ? <span className="spaced-meta-sep" aria-hidden="true">•</span> : null}
          <span className="spaced-meta-part">{part}</span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * WorkIndex — the "Featured Work" index: hairline-separated rows, sans-serif
 * titles, 4:3 glyph tiles. Each row deep-links into the project carousel at
 * /projects/<id>. Ported from the design-system work.html recreation.
 */
export default function WorkIndex() {
  return (
    <div>
      <SiteNav
        links={[
          { label: "Work", href: "/projects", current: true },
          { label: "Music", href: "/music" }
        ]}
      />
      <div className="wk-wrap">
        <header className="wk-head">
          <h1 className="wk-title">Featured Work</h1>
          <p className="wk-intro">
            Independent engineering across AI systems, social-impact products, open source, and the early builds
            that taught me how to think in systems.
          </p>
        </header>

        <div className="wk-list">
          {projectPages.map((p) => (
            <a className="wk-item" key={p.id} href={`/projects/${p.id}`}>
              <span className="wk-glyph" aria-hidden="true">
                <span>{projectGlyphs[p.id]}</span>
              </span>
              <span className="wk-when">
                <span className="wk-year">{p.period}</span>
                <SpacedMetadata value={p.focus} className="wk-focus" />
              </span>
              <span className="wk-main">
                <h2 className="wk-name">{p.name}</h2>
                <p className="wk-desc">{p.tagline}</p>
              </span>
              <span className="wk-arrow" aria-hidden="true">
                <ArrowUpRight size={22} strokeWidth={2.4} />
              </span>
            </a>
          ))}
        </div>

        <footer className="wk-foot">
          <div className="page-foot-copy">
            <span>© 2026 Álex Filipe Santos</span>
            <span className="page-foot-sep">·</span>
            <span>San Francisco, CA</span>
          </div>
          <nav className="page-foot-links" aria-label="Social links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
