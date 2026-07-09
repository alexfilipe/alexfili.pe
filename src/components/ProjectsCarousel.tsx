import { Fragment, useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { projectGlyphs } from "@/components/ProjectGlyphs";
import { projectPages, type ProjectMetaValue, type ProjectPage } from "@/data/projectPages";
import { profile } from "@/data/profile";

/**
 * ProjectsCarousel — an interactive carousel of full project detail pages you
 * cycle through with edge arrows, the top prev/next, dots, or ← / → keys. The
 * current project is tracked in the URL path (/projects/<id>), so the Work
 * index can deep-link into any project. A small tweaks panel switches the
 * project-title font between serif and sans (persisted). No piano — that motif
 * is home-only. Ported from the design-system projects.html recreation.
 */

type ProjectsCarouselProps = {
  initialProjectId?: string;
};

function projectIndexFromId(projectId?: string) {
  if (!projectId) return 0;
  const index = projectPages.findIndex((p) => p.id === projectId);
  return index === -1 ? 0 : index;
}

function projectPath(projectId: string) {
  return `/projects/${projectId}`;
}

function SpacedMetadata({ value }: { value: ProjectMetaValue }) {
  const parts = Array.isArray(value) ? value : [value];

  return (
    <span className="spaced-meta">
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 ? <span className="spaced-meta-sep" aria-hidden="true">·</span> : null}
          <span className="spaced-meta-part">{part}</span>
        </Fragment>
      ))}
    </span>
  );
}

function ProjectDetail({ project }: { project: ProjectPage }) {
  if (project.stub) {
    return (
      <article className="pp-page pp-page-stub" key={project.id}>
        <header className="pp-hero">
          <div className="pp-hero-copy">
            <span className="item-kicker">
              {project.period}
            </span>
            <h1 className="pp-title">{project.name}</h1>
            <p className="pp-tagline">{project.tagline}</p>
            <p className="pp-lede">{project.lede}</p>
            <div className="pp-tags">
              {project.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
            {project.link ? (
              <a className="pp-cta" href={project.link.href} target="_blank" rel="noopener noreferrer">
                <span>{project.link.label}</span>
                <ArrowUpRight size={15} strokeWidth={2.4} />
              </a>
            ) : null}
          </div>
          <div className="pp-visual" aria-hidden="true">
            <span className="pp-visual-frame" />
            <span className="pp-visual-glyph">{projectGlyphs[project.id]}</span>
          </div>
        </header>
      </article>
    );
  }

  return (
    <article className="pp-page" key={project.id}>
      <header className="pp-hero">
        <div className="pp-hero-copy">
          <span className="item-kicker">
            {project.period}
          </span>
          <h1 className="pp-title">{project.name}</h1>
          <p className="pp-tagline">{project.tagline}</p>
          <p className="pp-lede">{project.lede}</p>
          <div className="pp-tags">
            {project.tags.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="pp-visual" aria-hidden="true">
          <span className="pp-visual-frame" />
          <span className="pp-visual-glyph">{projectGlyphs[project.id]}</span>
        </div>
      </header>

      <div className="pp-body">
        <div className="pp-narrative">
          {project.sections?.map((s) => (
            <section className="pp-section" key={s.heading}>
              <h2 className="pp-section-h">{s.heading}</h2>
              <p className="pp-section-p">{s.body}</p>
            </section>
          ))}
        </div>
        <aside className="pp-meta">
          <dl className="pp-meta-list">
            {Object.entries(project.meta ?? {}).map(([k, v]) => (
              <div className="pp-meta-row" key={k}>
                <dt>{k}</dt>
                <dd><SpacedMetadata value={v} /></dd>
              </div>
            ))}
          </dl>
          {project.link ? (
            <a className="pp-link" href={project.link.href} target="_blank" rel="noopener noreferrer">
              <span>{project.link.label}</span>
              <ArrowUpRight size={15} strokeWidth={2.4} />
            </a>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

export default function ProjectsCarousel({ initialProjectId }: ProjectsCarouselProps) {
  const [i, setI] = useState(() => projectIndexFromId(initialProjectId));
  const [dir, setDir] = useState<1 | -1>(1);

  // Preserve old hash deep-links, but normalize them into project path URLs.
  useEffect(() => {
    const hashProjectId = window.location.hash.slice(1);
    const n = projectPages.findIndex((p) => p.id === hashProjectId);
    if (n === -1) return;
    setI(n);
    history.replaceState(null, "", projectPath(projectPages[n].id));
  }, []);

  const go = useCallback(
    (next: number) => {
      setDir(next > i || (i === projectPages.length - 1 && next === 0) ? 1 : -1);
      const n = (next + projectPages.length) % projectPages.length;
      setI(n);
      history.replaceState(null, "", projectPath(projectPages[n].id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [i]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  const project = projectPages[i];
  const nextProject = projectPages[(i + 1) % projectPages.length];

  return (
    <div className="pp-root">
      <SiteNav
        links={[
          { label: "Work", href: "/projects", current: true },
          { label: "Music", href: "/music" }
        ]}
      />

      <button className="pp-edge pp-edge-left" aria-label="Previous project" onClick={() => go(i - 1)}>
        <ArrowLeft size={20} />
      </button>
      <button className="pp-edge pp-edge-right" aria-label="Next project" onClick={() => go(i + 1)}>
        <ArrowRight size={20} />
      </button>

      <div className="pp-scroll">
        <div className="pp-wrap">
          <div className="pp-topbar">
            <a className="pp-back" href="/projects">
              <ArrowLeft size={15} />
              <span>All work</span>
            </a>
            <div className="pp-nav">
              <button className="pp-nav-btn" aria-label="Previous project" onClick={() => go(i - 1)}>
                <ArrowLeft size={16} />
              </button>
              <div className="pp-index">
                <span className="pp-index-now">{String(i + 1).padStart(2, "0")}</span>
                <span className="pp-index-sep">/</span>
                <span className="pp-index-total">{String(projectPages.length).padStart(2, "0")}</span>
              </div>
              <button className="pp-nav-btn" aria-label="Next project" onClick={() => go(i + 1)}>
                <ArrowRight size={16} />
              </button>
              <div className="pp-dots">
                {projectPages.map((p, n) => (
                  <button
                    key={p.id}
                    className={"pp-dot" + (n === i ? " is-on" : "")}
                    aria-label={p.name}
                    onClick={() => go(n)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={"pp-stage pp-dir-" + (dir > 0 ? "fwd" : "back")}>
            <ProjectDetail project={project} />
          </div>

          <button className="pp-next" onClick={() => go(i + 1)}>
            <div className="pp-next-inner">
              <span className="pp-next-label">Next project</span>
              <span className="pp-next-name">{nextProject.name}</span>
            </div>
            <ArrowRight size={22} />
          </button>

          <footer className="pp-foot">
            <div className="page-foot-copy">
              <span>© 2026 Álex Filipe Santos</span>
              <span className="page-foot-sep">·</span>
              <span>San Francisco, CA</span>
            </div>
            <nav className="page-foot-links" aria-label="Social links">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
