import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { essayEntries } from "@/data/essaysContent";

/**
 * EssayReader — a deliberately minimal, text-first reader. Top controls
 * (back · prev/next · dots), a narrow reading measure, and a browse strip at
 * the bottom. Switch essays by click, ← / → keys, or the strip. The current
 * essay is tracked in the URL hash (/essay#<id>). Ported from the
 * design-system essay.html recreation.
 */
export default function EssayReader() {
  const [i, setI] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  // Apply hash deep-links after hydration so SSR and the first client render match.
  useEffect(() => {
    const idx = essayEntries.findIndex((e) => e.id === window.location.hash.slice(1));
    if (idx !== -1) setI(idx);
  }, []);

  const go = useCallback((n: number) => {
    const idx = (n + essayEntries.length) % essayEntries.length;
    setI(idx);
    history.replaceState(null, "", `#${essayEntries[idx].id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keep the active chip centered in the browse strip.
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.children[i] as HTMLElement | undefined;
    if (strip && chip) {
      strip.scrollTo({
        left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
        behavior: "smooth"
      });
    }
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  const essay = essayEntries[i];

  return (
    <div className="es-page">
      <SiteNav
        links={[
          { label: "Work", href: "/projects" },
          { label: "Music", href: "/music" },
          { label: "Essays", href: "/essays", current: true }
        ]}
      />

      <article className="es-article es-fade" key={essay.id}>
        <div className="es-topbar">
          <a className="es-back" href="/essays">
            <ArrowLeft size={15} />
            <span>All essays</span>
          </a>
          <div className="es-nav">
            <button className="es-navbtn" aria-label="Previous essay" onClick={() => go(i - 1)}>
              <ArrowLeft size={15} />
            </button>
            <div className="es-dots">
              {essayEntries.map((e, n) => (
                <button
                  key={e.id}
                  className={"es-dot" + (n === i ? " is-on" : "")}
                  aria-label={e.title}
                  onClick={() => go(n)}
                />
              ))}
            </div>
            <button className="es-navbtn" aria-label="Next essay" onClick={() => go(i + 1)}>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="es-meta">
          <span>{essay.date}</span>
          <span className="es-meta-read">· {essay.read}</span>
        </div>
        <h1 className="es-title">{essay.title}</h1>
        <p className="es-lede">{essay.excerpt}</p>
        <div className="es-rule" />
        <div className="es-body">
          {essay.body.map((b, n) => {
            if (b.type === "h") return <h2 className="es-h" key={n}>{b.text}</h2>;
            if (b.type === "q") return <blockquote className="es-q" key={n}>{b.text}</blockquote>;
            return <p className="es-p" key={n}>{b.text}</p>;
          })}
        </div>
      </article>

      <section className="es-more">
        <div className="es-more-inner">
          <span className="es-more-label">More essays</span>
          <div className="es-strip" ref={stripRef}>
            {essayEntries.map((e, n) => (
              <button key={e.id} className={"es-chip" + (n === i ? " is-on" : "")} onClick={() => go(n)}>
                <span className="es-chip-date">{e.date}</span>
                <span className="es-chip-title">{e.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="es-foot">
        <span>© 2026 Álex Filipe Santos</span>
        <span className="es-foot-sep">·</span>
        <span>San Francisco, CA</span>
      </footer>
    </div>
  );
}
