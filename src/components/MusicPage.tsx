import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import {
  musicMovements,
  musicPageContent,
  musicHeroStats,
  pianoStats,
  pianoRecordings,
  repertoireComposers,
  violinTimeline,
  conductingPremiere,
  type RichText
} from "@/data/musicContent";
import { profile } from "@/data/profile";

/**
 * MusicPage — an artistic single page with three movements: Conducting, Piano,
 * Violin. Canvas sound-fields, scroll reveals, a repertoire marquee, a fixed
 * movement-nav that tracks scroll, and the real recordings/timeline. Ported
 * from the design-system MusicPage.jsx recreation.
 */

type SoundFieldProps = {
  variant: "flow" | "strings";
  color?: [number, number, number];
};

// Canvas sound-field: flowing gesture curves ("flow") or plucked oscillating
// strings ("strings"). Faint, in-palette motion; respects reduced-motion.
function SoundField({ variant, color = [200, 169, 110] }: SoundFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pluck = useRef({ x: -1, y: -1, t: 8, force: 0, dragging: false });
  const stringInfluence = useRef<number[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    const dpr = window.devicePixelRatio || 1;
    let id = 0;
    let t = 0;
    const C = (a: number) => `rgba(${color[0]},${color[1]},${color[2]},${a})`;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const lines = variant === "strings" ? 9 : 6;
    if (variant === "strings") {
      stringInfluence.current = Array.from({ length: lines }, (_, index) => stringInfluence.current[index] ?? 0);
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let k = 0; k < lines; k++) {
        const base = H * (0.5 + (k - lines / 2) * (variant === "strings" ? 0.085 : 0.11));
        let stringGlow = 0;
        if (variant === "strings") {
          const pl = pluck.current;
          const immediateY = pl.y > 0 ? Math.exp(-Math.pow((base - pl.y) / 44, 2)) : 0;
          const lingerY = Math.max(immediateY, (stringInfluence.current[k] ?? 0) * 0.96);
          stringInfluence.current[k] = lingerY;
          stringGlow = lingerY * Math.exp(-pl.t * 0.85);
        }
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const px = x / W;
          let y: number;
          if (variant === "strings") {
            const pl = pluck.current;
            const nearY = stringInfluence.current[k] ?? 0;
            const nearX = pl.x > 0 ? Math.exp(-Math.pow((x - pl.x) / 210, 2)) : 0.35;
            const decay = Math.exp(-pl.t * 1.35);
            const force = pl.dragging ? Math.max(pl.force, 0.65) : pl.force;
            const amp = 2.5 + nearY * (12 + force * 12) * decay * (0.25 + nearX);
            const pull = nearY * nearX * force * 6 * decay;
            y = base + Math.sin(px * 10 + t * 4.2 + k) * amp * Math.sin(px * Math.PI) + pull;
          } else {
            const amp = 12 + k * 4;
            y = base + Math.sin(px * 3.4 + t * 0.9 + k * 0.7) * amp + Math.sin(px * 7 - t * 0.6 + k) * (amp * 0.35);
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const a = variant === "strings" ? 0.08 + k * 0.012 + stringGlow * 0.18 : 0.11 + k * 0.035;
        ctx.strokeStyle = C(a);
        ctx.lineWidth = variant === "strings" ? 1 : 1;
        ctx.stroke();
      }
      t += reduce ? 0 : 0.016;
      pluck.current.t += reduce ? 1 : 0.016;
      if (variant === "strings") pluck.current.force *= 0.94;
      if (!reduce) id = requestAnimationFrame(draw);
    };
    draw();

    let lastX = -1;
    let lastY = -1;
    const onMove = (e: PointerEvent) => {
      if (variant !== "strings") return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const distance = lastX > -1 ? Math.hypot(x - lastX, y - lastY) : 0;
      lastX = x;
      lastY = y;
      pluck.current = {
        x,
        y,
        t: 0,
        force: Math.min(1.2, Math.max(pluck.current.force, 0.3 + distance / 75)),
        dragging: pluck.current.dragging
      };
    };
    const onDown = (e: PointerEvent) => {
      if (variant !== "strings") return;
      pluck.current.dragging = true;
      pluck.current.force = 1;
      onMove(e);
    };
    const onUp = () => {
      if (variant !== "strings") return;
      pluck.current.dragging = false;
    };
    const target = variant === "strings" ? wrap.parentElement ?? canvas : canvas;
    if (variant === "strings") {
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      target.addEventListener("pointerleave", onUp);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (variant === "strings") {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointerleave", onUp);
      }
      cancelAnimationFrame(id);
    };
  }, [variant, color]);

  return (
    <div ref={wrapRef} className="mu-field">
      <canvas ref={canvasRef} style={{ pointerEvents: variant === "strings" ? "auto" : "none" }} />
    </div>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "span" | "p" | "h2" | "ul" | "ol";
};

// Fade + rise on scroll into view (once). Respects reduced-motion via CSS.
function Reveal({ children, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}${seen ? " is-in" : ""}`}>
      {children}
    </Tag>
  );
}

const conductingMovement = musicMovements.find((movement) => movement.id === "conducting")!;
const pianoMovement = musicMovements.find((movement) => movement.id === "piano")!;
const violinMovement = musicMovements.find((movement) => movement.id === "violin")!;

function SectionNav({ active, visible }: { active: string; visible: boolean }) {
  return (
    <nav
      className={"mu-nav" + (visible ? " is-visible" : "")}
      aria-label={musicPageContent.sectionNavLabel}
      aria-hidden={!visible}
    >
      {musicMovements.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={"mu-nav-item" + (active === s.id ? " is-on" : "")}>
          <span className="mu-nav-line" />
          <span className="mu-nav-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}

function RenderRichText({ value }: { value: RichText }) {
  if (typeof value === "string") return <>{value}</>;

  return (
    <>
      {value.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : "bold" in part ? (
          <b key={`${part.bold}-${index}`}>{part.bold}</b>
        ) : "emphasis" in part ? (
          <em key={`${part.emphasis}-${index}`}>{part.emphasis}</em>
        ) : (
          <sup key={`${part.sup}-${index}`}>{part.sup}</sup>
        )
      )}
    </>
  );
}

export default function MusicPage() {
  const [active, setActive] = useState("conducting");
  const [showSectionNav, setShowSectionNav] = useState(false);

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".mu-sec"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const updateSectionNav = () => setShowSectionNav(window.scrollY > 24);
    updateSectionNav();
    window.addEventListener("scroll", updateSectionNav, { passive: true });
    return () => window.removeEventListener("scroll", updateSectionNav);
  }, []);

  return (
    <div className="mu">
      <SiteNav
        links={[
          { label: musicPageContent.nav.work, href: "/projects" },
          { label: musicPageContent.nav.music, href: "/music", current: true }
        ]}
      />
      <SectionNav active={active} visible={showSectionNav} />

      {/* Hero */}
      <header className="mu-hero">
        <SoundField variant="flow" />
        <div className="mu-hero-inner">
          <span className="mu-eyebrow mu-eyebrow-list">
            {musicPageContent.hero.eyebrow.map((item, index) => (
              <Fragment key={item}>
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                <span>{item}</span>
              </Fragment>
            ))}
          </span>
          <h1 className="mu-hero-title">{musicPageContent.hero.title}</h1>
          {musicPageContent.hero.lede.map((paragraph, index) => (
            <p className="mu-hero-lede" key={index}>
              <RenderRichText value={paragraph} />
            </p>
          ))}
          <div className="mu-hero-stats">
            {musicHeroStats.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        </div>
        <a className="mu-scroll-cue" href="#conducting">
          <span>{musicPageContent.hero.scrollCue}</span>
          <span className="mu-scroll-dot" />
        </a>
      </header>

      {/* Conducting */}
      <section id="conducting" className="mu-sec mu-conducting">
        <div className="mu-sec-mark" aria-hidden="true">
          {conductingMovement.numeral}
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              {conductingMovement.kicker}
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              {conductingMovement.title}
            </Reveal>
            <Reveal as="p" className="mu-lede">
              <RenderRichText value={conductingMovement.lede} />
            </Reveal>
            {conductingMovement.body.map((paragraph, index) => (
              <Reveal as="p" className="mu-body" key={index}>
                <RenderRichText value={paragraph} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mu-video">
            <div className="mu-video-frame">
              <iframe
                loading="lazy"
                src={`https://www.youtube-nocookie.com/embed/${conductingPremiere.youtubeId}`}
                title={conductingPremiere.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <span className="mu-video-cap">{conductingPremiere.caption}</span>
          </Reveal>
        </div>
      </section>

      {/* Piano */}
      <section id="piano" className="mu-sec mu-piano">
        <div className="mu-sec-mark" aria-hidden="true">
          {pianoMovement.numeral}
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              {pianoMovement.kicker}
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              {pianoMovement.title}
            </Reveal>
            <Reveal as="p" className="mu-lede">
              <RenderRichText value={pianoMovement.lede} />
            </Reveal>
            {pianoMovement.body.map((paragraph, index) => (
              <Reveal as="p" className="mu-body" key={index}>
                <RenderRichText value={paragraph} />
              </Reveal>
            ))}
            <Reveal className="mu-stats">
              {pianoStats.map((s) => (
                <span key={s.label}>
                  <b>{s.value}</b>
                  <small>{s.label}</small>
                </span>
              ))}
            </Reveal>
          </div>
          <div className="mu-piano-keys" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, n) => (
              <span key={n} style={{ animationDelay: `${n * 0.11}s` }} />
            ))}
          </div>
        </div>
        <Reveal as="ul" className="mu-recs">
          {pianoRecordings.map((r) => (
            <li key={r.youtubeId}>
              <a href={`https://www.youtube.com/watch?v=${r.youtubeId}`} target="_blank" rel="noopener noreferrer">
                <span className="mu-rec-play">
                  <Play size={16} fill="currentColor" strokeWidth={0} />
                </span>
                <span className="mu-rec-work">{r.work}</span>
                <span className="mu-rec-date">{r.date}</span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Repertoire marquee */}
      <div className="mu-marquee" aria-hidden="true">
        <div className="mu-marquee-track">
          {[...repertoireComposers, ...repertoireComposers].map((c, n) => (
            <span key={n}>
              {c}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      {/* Violin */}
      <section id="violin" className="mu-sec mu-violin">
        <SoundField variant="strings" color={[201, 156, 96]} />
        <div className="mu-sec-mark" aria-hidden="true">
          {violinMovement.numeral}
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              {violinMovement.kicker}
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              {violinMovement.title}
            </Reveal>
            <Reveal as="p" className="mu-lede">
              <RenderRichText value={violinMovement.lede} />
            </Reveal>
            {violinMovement.body.map((paragraph, index) => (
              <Reveal as="p" className="mu-body" key={index}>
                <RenderRichText value={paragraph} />
              </Reveal>
            ))}
          </div>
          <Reveal as="ol" className="mu-timeline">
            {violinTimeline.map((e) => (
              <li key={e.when}>
                <b>{e.when}</b>
                <span className="mu-timeline-text">
                  <span className="mu-timeline-main"><RenderRichText value={e.what.main} /></span>
                  {e.what.detail ? (
                    <span className="mu-timeline-detail"><RenderRichText value={e.what.detail} /></span>
                  ) : null}
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <footer className="mu-foot">
        <div className="page-foot-copy">
          <span>{musicPageContent.footer.copyright}</span>
          <span className="page-foot-sep">·</span>
          <span>{musicPageContent.footer.location}</span>
        </div>
        <nav className="page-foot-links" aria-label={musicPageContent.footer.socialLinksLabel}>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{musicPageContent.footer.linkedin}</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">{musicPageContent.footer.github}</a>
          <a href={`mailto:${profile.email}`}>{musicPageContent.footer.email}</a>
        </nav>
      </footer>
    </div>
  );
}
