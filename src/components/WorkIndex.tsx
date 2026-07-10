import { Fragment, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { projectPages, type ProjectMetaValue } from "@/data/projectPages";
import PageFooter from "@/components/PageFooter";

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

const workDescriptions: Record<string, string> = {
  inspirasonho: "Helping Brazilian students discover opportunities beyond the classroom.",
  labstocker: "A chemistry-lab inventory platform recognized nationally in Brazil."
};

function WorkTitle({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const lastWord = parts.pop();

  if (!lastWord) {
    return null;
  }

  return (
    <>
      {parts.length > 0 ? `${parts.join(" ")} ` : null}
      <span className="wk-title-tail">
        {lastWord}
        <span className="wk-arrow" aria-hidden="true">
          <ArrowUpRight size={22} strokeWidth={2.4} />
        </span>
      </span>
    </>
  );
}

/**
 * WorkIndex — the "Featured Work" index: hairline-separated rows, sans-serif
 * titles, 4:3 preview tiles. Each row deep-links into the project carousel at
 * /projects/<id>. Ported from the design-system work.html recreation.
 */
export default function WorkIndex() {
  const startYears = projectPages
    .map((p) => parseInt(p.period, 10))
    .filter((year) => !Number.isNaN(year));
  const sinceYear = Math.min(...startYears);

  return (
    <div className="wk-page">
      <SiteNav
        links={[
          { label: "Work", href: "/projects", current: true },
          { label: "Music", href: "/music" }
        ]}
      />
      <div className="wk-wrap">
        <header className="wk-head">
          <span className="wk-eyebrow">{`${sinceYear} — Present`}</span>
          <h1 className="wk-title">Featured Work</h1>
          <p className="wk-intro">
            Selected engineering work across local-first AI systems, social-impact products, open source, and early
            builds that shaped how I think in systems.
          </p>
        </header>

        <div className="wk-list">
          {projectPages.map((p) => {
            const logoStyle = {
              "--wk-watermark-accent": p.logo.accent,
              "--wk-watermark-scale": p.logo.scale ?? 1.02
            } as CSSProperties;
            const hasLogoImage = Boolean(p.logo.webpSrc || p.logo.pngSrc);

            return (
              <a className="wk-item" key={p.id} href={`/projects/${p.id}`}>
                <span
                  className={`wk-watermark${hasLogoImage ? " wk-watermark--image" : ""}`}
                  style={logoStyle}
                  aria-hidden="true"
                >
                  {hasLogoImage ? (
                    <picture className="wk-watermark-picture">
                      {p.logo.webpSrc ? <source srcSet={p.logo.webpSrc} type="image/webp" /> : null}
                      <img src={p.logo.pngSrc ?? p.logo.webpSrc} alt="" loading="lazy" decoding="async" />
                    </picture>
                  ) : (
                    <span className="wk-watermark-initials">{p.logo.initials}</span>
                  )}
                </span>
                <span className="wk-preview" aria-hidden="true">
                  <picture className="wk-preview-picture">
                    <source srcSet={p.preview.webpSrc} type="image/webp" />
                    <img src={p.preview.pngSrc} alt="" width="960" height="720" loading="lazy" decoding="async" />
                  </picture>
                </span>
                <span className="wk-when">
                  <span className="wk-year">{p.period}</span>
                  <SpacedMetadata value={p.focus} className="wk-focus" />
                </span>
                <span className="wk-main">
                  <h2 className="wk-name">
                    <WorkTitle name={p.name} />
                  </h2>
                  <p className="wk-desc">{workDescriptions[p.id] ?? p.tagline}</p>
                </span>
              </a>
            );
          })}
        </div>

        <PageFooter className="wk-foot" />
      </div>
    </div>
  );
}
