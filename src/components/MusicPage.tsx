import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import {
  musicHeroStats,
  pianoStats,
  pianoRecordings,
  repertoireComposers,
  violinTimeline,
  conductingPremiere
} from "@/data/musicContent";

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
  const pluck = useRef({ y: -1, t: 0 });

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
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let k = 0; k < lines; k++) {
        const base = H * (0.5 + (k - lines / 2) * (variant === "strings" ? 0.085 : 0.11));
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8) {
          const px = x / W;
          let y: number;
          if (variant === "strings") {
            const pl = pluck.current;
            const near = pl.y > 0 ? Math.exp(-Math.pow((base - pl.y) / 26, 2)) : 0;
            const decay = Math.exp(-pl.t * 2.2);
            const amp = 3 + near * 26 * decay;
            y = base + Math.sin(px * 9 + t * 3 + k) * amp * Math.sin(px * Math.PI);
          } else {
            const amp = 26 + k * 10;
            y = base + Math.sin(px * 3.4 + t * 0.9 + k * 0.7) * amp + Math.sin(px * 7 - t * 0.6 + k) * (amp * 0.35);
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const a = variant === "strings" ? 0.16 + k * 0.02 : 0.06 + k * 0.02;
        ctx.strokeStyle = C(a);
        ctx.lineWidth = variant === "strings" ? 0.8 : 1;
        ctx.stroke();
      }
      t += reduce ? 0 : 0.016;
      pluck.current.t += reduce ? 1 : 0.016;
      if (!reduce) id = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: PointerEvent) => {
      if (variant !== "strings") return;
      const r = canvas.getBoundingClientRect();
      pluck.current = { y: e.clientY - r.top, t: 0 };
    };
    if (variant === "strings") canvas.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("resize", resize);
      if (variant === "strings") canvas.removeEventListener("pointermove", onMove);
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

const SECTIONS = [
  { id: "conducting", label: "Conducting" },
  { id: "piano", label: "Piano" },
  { id: "violin", label: "Violin" }
];

function SectionNav({ active }: { active: string }) {
  return (
    <nav className="mu-nav" aria-label="Movements">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={"mu-nav-item" + (active === s.id ? " is-on" : "")}>
          <span className="mu-nav-line" />
          <span className="mu-nav-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function MusicPage() {
  const [active, setActive] = useState("conducting");

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".mu-sec"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mu">
      <SiteNav
        links={[
          { label: "Projects", href: "/work" },
          { label: "Music", href: "/music", current: true },
          { label: "Essays", href: "/essays" }
        ]}
      />
      <SectionNav active={active} />

      {/* Hero */}
      <header className="mu-hero">
        <SoundField variant="flow" />
        <div className="mu-hero-inner">
          <span className="mu-eyebrow">Violin · Piano · Conducting</span>
          <h1 className="mu-hero-title">Music</h1>
          <p className="mu-hero-lede">
            The discipline that taught me how to listen. Three instruments, one lifelong question —{" "}
            <em>what makes structure feel meaningful</em> — worked out in sound before I ever worked it out in
            systems.
          </p>
          <div className="mu-hero-stats">
            {musicHeroStats.map((s) => (
              <span key={s.label}>
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        </div>
        <a className="mu-scroll-cue" href="#conducting">
          <span>Begin</span>
          <span className="mu-scroll-dot" />
        </a>
      </header>

      {/* Conducting */}
      <section id="conducting" className="mu-sec mu-conducting">
        <div className="mu-sec-mark" aria-hidden="true">
          I
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              Movement I
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              Conducting
            </Reveal>
            <Reveal as="p" className="mu-lede">
              In 2018 I set out after one of the oldest dreams I had — to stand in front of a full orchestra and
              shape many voices into one.
            </Reveal>
            <Reveal as="p" className="mu-body">
              That dream became my <b>conducting première</b> with the Amherst Symphony Orchestra in spring 2020 —
              the Schumann Piano Concerto in A minor, Op. 54, with soloist Faith Wen. It closed my senior year the
              way I most wanted it to.
            </Reveal>
            <Reveal as="p" className="mu-body">
              Under the mentoring of Mark Swanson, the orchestra's director, I learned the one lesson that keeps me
              coming back: you never stop learning how music works.
            </Reveal>
          </div>
          <Reveal className="mu-video">
            <div className="mu-video-frame">
              <iframe
                loading="lazy"
                src={`https://www.youtube-nocookie.com/embed/${conductingPremiere.youtubeId}`}
                title="Conducting première — Schumann Piano Concerto in A minor"
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
          II
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              Movement II
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              Piano
            </Reveal>
            <Reveal as="p" className="mu-lede">
              In 2015, with almost no experience, I decided to learn the piano — and gave it the kind of hours most
              people reserve for a first language.
            </Reveal>
            <Reveal as="p" className="mu-body">
              Under Chonghyo Shin I built a technique in four years I never thought I'd reach, and performed my{" "}
              <b>Senior Recital</b> in March 2020. The recordings below are from those years.
            </Reveal>
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
          III
        </div>
        <div className="mu-sec-grid">
          <div className="mu-sec-copy">
            <Reveal as="span" className="mu-kicker">
              Movement III
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              Violin
            </Reveal>
            <Reveal as="p" className="mu-lede">
              My first musical language. I picked up the violin at three and have never really put it down.
            </Reveal>
            <Reveal as="p" className="mu-body">
              It carried me from a church philharmonic in Natal at ten, to music school at the Federal University of
              Rio Grande do Norte in 2011, to the Amherst Symphony Orchestra — where I've played since 2015, a few
              chamber programs a season among them.
            </Reveal>
          </div>
          <Reveal as="ol" className="mu-timeline">
            {violinTimeline.map((e) => (
              <li key={e.when}>
                <b>{e.when}</b>
                <span>{e.what}</span>
              </li>
            ))}
          </Reveal>
        </div>
        <p className="mu-strings-hint">Move across the strings</p>
      </section>

      <footer className="mu-foot">
        <span>© 2026 Álex Filipe Santos</span>
        <span className="mu-foot-sep">·</span>
        <span>San Francisco, CA</span>
      </footer>
    </div>
  );
}
