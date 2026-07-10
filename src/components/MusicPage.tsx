import { Fragment, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import {
  musicMovements,
  musicPageContent,
  musicHeroStats,
  pianoStats,
  repertoireComposers,
  violinTimeline,
  violinPhotos,
  conductingPremiere,
  type RichText,
  type ViolinPhoto
} from "@/data/musicContent";
import PageFooter from "@/components/PageFooter";

/**
 * MusicPage — an artistic single page with three movements: Conducting, Piano,
 * Violin. Canvas sound-fields, scroll reveals, a repertoire marquee, a fixed
 * movement-nav that tracks scroll, and the real recordings/timeline. Ported
 * from the design-system MusicPage.jsx recreation.
 */

type SoundFieldProps = {
  variant: "flow" | "strings";
  color?: [number, number, number];
  className?: string;
};

// Canvas sound-field: flowing gesture curves ("flow") or plucked oscillating
// strings ("strings"). Faint, in-palette motion; respects reduced-motion.
function SoundField({ variant, color = [200, 169, 110], className }: SoundFieldProps) {
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
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobileViewport = window.matchMedia("(max-width: 820px)").matches;
    const hoverReactive = finePointer && !mobileViewport;
    const scrollReactive = variant === "strings" && !hoverReactive;
    let W = 0;
    let H = 0;
    const dpr = window.devicePixelRatio || 1;
    let id = 0;
    let t = 0;
    const C = (a: number) => `rgba(${color[0]},${color[1]},${color[2]},${a})`;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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
    let lastX = -1;
    let lastY = -1;
    let lastScrollY = window.scrollY;
    let lastScrollAt = performance.now();
    let lastGesture = { x: -1, y: -1, at: 0 };
    const rememberGesture = (clientX: number, clientY: number) => {
      lastGesture = { x: clientX, y: clientY, at: performance.now() };
    };
    const updateScrollPluck = () => {
      if (!scrollReactive || reduce || W <= 0 || H <= 0) return;
      const section = wrap.parentElement ?? wrap;
      const sectionRect = section.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY;
      const now = performance.now();

      if (sectionRect.bottom < 0 || sectionRect.top > viewportH) {
        lastScrollY = scrollY;
        lastScrollAt = now;
        return;
      }

      const elapsed = Math.max(16, now - lastScrollAt);
      const scrollDelta = Math.abs(scrollY - lastScrollY);
      if (scrollDelta < 0.5) return;

      const progress = clamp((viewportH - sectionRect.top) / (viewportH + sectionRect.height), 0, 1);
      const hasFreshGesture = now - lastGesture.at < 600 && lastGesture.x >= 0 && lastGesture.y >= 0;
      const y = clamp((hasFreshGesture ? lastGesture.y : viewportH * 0.5) - canvasRect.top, H * 0.08, H * 0.92);
      const x = hasFreshGesture ? clamp(lastGesture.x - canvasRect.left, W * 0.08, W * 0.92) : W * (0.14 + progress * 0.72);
      const force = clamp(0.7 + (scrollDelta / elapsed) * 7, 0.7, 1.7);

      lastScrollY = scrollY;
      lastScrollAt = now;
      lastX = x;
      lastY = y;
      pluck.current = { x, y, t: 0, force: Math.max(pluck.current.force, force), dragging: false };
    };
    const draw = () => {
      updateScrollPluck();
      if (W <= 0 || H <= 0) {
        if (!reduce) id = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      const drawLines = variant === "strings" && !hoverReactive ? Math.max(12, Math.ceil(H / 90) + 2) : lines;
      if (variant === "strings" && stringInfluence.current.length !== drawLines) {
        stringInfluence.current = Array.from({ length: drawLines }, (_, index) => stringInfluence.current[index] ?? 0);
      }
      const timelineEnd = !hoverReactive
        ? (wrap.parentElement ?? wrap).querySelector(".mu-timeline li:last-child")
        : null;
      const timelineEndRect = timelineEnd?.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const mobileStringEnd = timelineEndRect
        ? clamp((timelineEndRect.bottom - canvasRect.top - 6) / H, 0.72, 0.92)
        : 0.92;
      for (let k = 0; k < drawLines; k++) {
        const mobileStringBase = drawLines > 1 ? 0.02 + (k / (drawLines - 1)) * (mobileStringEnd - 0.02) : 0.5;
        const base = H * (variant === "strings" && !hoverReactive ? mobileStringBase : 0.5 + (k - lines / 2) * (variant === "strings" ? 0.085 : 0.11));
        let stringGlow = 0;
        if (variant === "strings") {
          const pl = pluck.current;
          const hoverRadius = hoverReactive ? 76 : 44;
          const immediateY = pl.y > 0 ? Math.exp(-Math.pow((base - pl.y) / hoverRadius, 2)) : 0;
          const previousY = stringInfluence.current[k] ?? 0;
          const easedY = hoverReactive ? immediateY : previousY + (immediateY - previousY) * 0.12;
          const lingerY = Math.max(easedY, previousY * 0.96);
          stringInfluence.current[k] = lingerY;
          stringGlow = lingerY * Math.exp(-pl.t * 0.75);
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
            const response = hoverReactive ? 1.35 : 1.65;
            const amp = 2.5 + nearY * (12 + force * 12) * response * decay * (0.25 + nearX);
            const pull = nearY * nearX * force * 6 * response * decay;
            const oscillation = hoverReactive ? px * 10 + t * 4.2 + k : px * 3.2 + t * 0.85 + k * 0.35;
            y = base + Math.sin(oscillation) * amp * Math.sin(px * Math.PI) + pull;
          } else {
            const amp = 12 + k * 4;
            y = base + Math.sin(px * 3.4 + t * 0.9 + k * 0.7) * amp + Math.sin(px * 7 - t * 0.6 + k) * (amp * 0.35);
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const mobileAlpha = 0.08 + (k / Math.max(1, drawLines - 1)) * 0.08 + stringGlow * 0.24;
        const a = variant === "strings" ? (hoverReactive ? 0.08 + k * 0.012 + stringGlow * 0.22 : mobileAlpha) : 0.11 + k * 0.035;
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
    const onScrollPointer = (e: PointerEvent) => {
      if (!scrollReactive) return;
      rememberGesture(e.clientX, e.clientY);
    };
    const onTouchGesture = (e: TouchEvent) => {
      if (!scrollReactive || e.touches.length === 0) return;
      const touch = e.touches[0];
      rememberGesture(touch.clientX, touch.clientY);
    };
    const target = variant === "strings" ? wrap.parentElement ?? canvas : canvas;
    if (variant === "strings") {
      if (hoverReactive) {
        target.addEventListener("pointermove", onMove);
        target.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        target.addEventListener("pointerleave", onUp);
      } else {
        target.addEventListener("pointerdown", onScrollPointer);
        target.addEventListener("pointermove", onScrollPointer);
        target.addEventListener("touchstart", onTouchGesture, { passive: true });
        target.addEventListener("touchmove", onTouchGesture, { passive: true });
        updateScrollPluck();
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (variant === "strings") {
        if (hoverReactive) {
          target.removeEventListener("pointermove", onMove);
          target.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointerup", onUp);
          target.removeEventListener("pointerleave", onUp);
        } else {
          target.removeEventListener("pointerdown", onScrollPointer);
          target.removeEventListener("pointermove", onScrollPointer);
          target.removeEventListener("touchstart", onTouchGesture);
          target.removeEventListener("touchmove", onTouchGesture);
        }
      }
      cancelAnimationFrame(id);
    };
  }, [variant, color]);

  return (
    <div ref={wrapRef} className={["mu-field", className].filter(Boolean).join(" ")}>
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
const quietYoutubeParams = "modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0";
const pianoYoutubeParams = `${quietYoutubeParams}&enablejsapi=1&playsinline=1`;
const pianoVideos = [
  {
    youtubeId: "qlbnMvq_dIY",
    title: "Piano excerpt I performed by Álex Filipe Santos"
  },
  {
    youtubeId: "ba5H690i2Cw",
    title: "Piano excerpt II performed by Álex Filipe Santos"
  }
];
const pianoVideoReel = [pianoVideos[pianoVideos.length - 1], ...pianoVideos, pianoVideos[0]];
const SCROLL_EDGE_EPSILON = 2;

type CarouselScrollState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

function SectionNav({ active, visible }: { active: string; visible: boolean }) {
  return (
    <nav
      className={"mu-nav" + (visible ? " is-visible" : "")}
      aria-label={musicPageContent.sectionNavLabel}
      aria-hidden={!visible}
    >
      {musicMovements.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={"mu-nav-item" + (active === s.id ? " is-on" : "")}>
          <span className="mu-nav-label">{s.label}</span>
          <span className="mu-nav-line" />
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

function RenderBreakableLabel({ value }: { value: string }) {
  const [lead, tail] = value.split(" — ");
  if (tail) {
    return (
      <>
        <span className="mu-violin-photo-label-lead">{lead} — </span>
        <wbr />
        <span className="mu-violin-photo-label-tail">{tail}</span>
      </>
    );
  }

  return (
    <>
      {value.split(/(, )/).map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {part === ", " ? <wbr /> : null}
        </Fragment>
      ))}
    </>
  );
}

function ViolinPhotoCarousel({ photos }: { photos: ViolinPhoto[] }) {
  const carouselId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollSnapTypeRef = useRef<string | null>(null);
  const autoScrollDirectionRef = useRef<-1 | 1>(1);
  const manualScrollResetTimeoutRef = useRef<number | null>(null);
  const [loadedPhotoIds, setLoadedPhotoIds] = useState<Set<string>>(() => new Set());
  // Single source of truth for the one caption that may be visible at a time.
  // Starts empty so nothing shows until the visitor scrolls, steps, or taps.
  const [activeLabelPhotoId, setActiveLabelPhotoId] = useState<string | null>(null);
  const [scrollState, setScrollState] = useState<CarouselScrollState>({
    canScrollLeft: false,
    canScrollRight: false
  });
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [autoScrollResetToken, setAutoScrollResetToken] = useState(0);

  const markPhotoLoaded = useCallback((photoId: string) => {
    setLoadedPhotoIds((currentIds) => {
      if (currentIds.has(photoId)) return currentIds;

      const nextIds = new Set(currentIds);
      nextIds.add(photoId);
      return nextIds;
    });
  }, []);

  const togglePhotoLabel = useCallback((photoId: string) => {
    setActiveLabelPhotoId((currentPhotoId) => (currentPhotoId === photoId ? null : photoId));
  }, []);

  const cancelScrollAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (scrollSnapTypeRef.current !== null) {
      const scroller = scrollerRef.current;
      if (scroller) scroller.style.scrollSnapType = scrollSnapTypeRef.current;
      scrollSnapTypeRef.current = null;
    }

    scrollerRef.current?.removeAttribute("data-auto-scrolling");
  }, []);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const nextState = {
      canScrollLeft: scroller.scrollLeft > SCROLL_EDGE_EPSILON,
      canScrollRight: scroller.scrollLeft < maxScrollLeft - SCROLL_EDGE_EPSILON
    };

    setScrollState((currentState) =>
      currentState.canScrollLeft === nextState.canScrollLeft && currentState.canScrollRight === nextState.canScrollRight
        ? currentState
        : nextState
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Arrow visibility is refreshed on init and every layout/scroll change, but
    // the caption is only ever surfaced by a real interaction — never on mount.
    updateScrollState();

    const handleScroll = () => {
      updateScrollState();

      if (!scroller.hasAttribute("data-auto-scrolling")) {
        if (manualScrollResetTimeoutRef.current !== null) {
          window.clearTimeout(manualScrollResetTimeoutRef.current);
        }
        manualScrollResetTimeoutRef.current = window.setTimeout(() => {
          manualScrollResetTimeoutRef.current = null;
          setAutoScrollResetToken((token) => token + 1);
        }, 120);
      }
    };
    const dropTarget = () => {
      cancelScrollAnimation();
      targetRef.current = null;
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    scroller.addEventListener("pointerdown", dropTarget, { passive: true });
    scroller.addEventListener("wheel", dropTarget, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let resizeObserver: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(scroller);
      Array.from(scroller.children).forEach((child) => resizeObserver?.observe(child));
    }

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      scroller.removeEventListener("pointerdown", dropTarget);
      scroller.removeEventListener("wheel", dropTarget);
      window.removeEventListener("resize", updateScrollState);
      if (manualScrollResetTimeoutRef.current !== null) {
        window.clearTimeout(manualScrollResetTimeoutRef.current);
        manualScrollResetTimeoutRef.current = null;
      }
      cancelScrollAnimation();
      resizeObserver?.disconnect();
    };
  }, [updateScrollState, cancelScrollAnimation]);

  const scrollByDirection = useCallback(
    (
      direction: -1 | 1,
      options: { revealLabel?: boolean; transitionMs?: number; wrap?: boolean; automatic?: boolean } = {}
    ) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const cards = Array.from(scroller.querySelectorAll<HTMLElement>(".mu-violin-photo"));
      if (cards.length === 0) return;

      const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const base = targetRef.current ?? scroller.scrollLeft;
      const baseCenter = base + scroller.clientWidth / 2;

      // Step relative to whichever photo is currently nearest the center.
      let currentIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - baseCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          currentIndex = index;
        }
      });

      const nextIndex =
        options.wrap && direction === 1 && currentIndex >= cards.length - 1
          ? 0
          : options.wrap && direction === -1 && currentIndex <= 0
            ? cards.length - 1
            : Math.max(0, Math.min(currentIndex + direction, cards.length - 1));
      const nextCard = cards[nextIndex];
      const target = Math.max(
        0,
        Math.min(nextCard.offsetLeft + nextCard.offsetWidth / 2 - scroller.clientWidth / 2, maxScrollLeft)
      );
      targetRef.current = target;
      if (options.revealLabel ?? true) {
        setActiveLabelPhotoId(nextCard.dataset.photoId ?? null);
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cancelScrollAnimation();

      if (!reduceMotion && options.transitionMs) {
        const start = scroller.scrollLeft;
        const distance = target - start;
        const duration = Math.max(600, options.transitionMs);
        const startedAt = window.performance.now();
        scrollSnapTypeRef.current = scroller.style.scrollSnapType;
        if (options.automatic) scroller.setAttribute("data-auto-scrolling", "true");
        const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);
        const step = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          scroller.scrollLeft = start + distance * easeOutCubic(progress);

          if (progress < 1) {
            animationFrameRef.current = window.requestAnimationFrame(step);
            return;
          }

          animationFrameRef.current = null;
          scroller.scrollLeft = target;
          scroller.style.scrollSnapType = scrollSnapTypeRef.current ?? "";
          scrollSnapTypeRef.current = null;
          scroller.removeAttribute("data-auto-scrolling");
          updateScrollState();
        };

        scroller.style.scrollSnapType = "none";
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      scroller.scrollTo({
        left: target,
        behavior: reduceMotion ? "auto" : "smooth"
      });

      window.setTimeout(updateScrollState, reduceMotion ? 0 : 260);
    },
    [updateScrollState, cancelScrollAnimation]
  );

  useEffect(() => {
    if (isCarouselHovered || photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let autoScroll: number;
    const runAutoScroll = () => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const currentTarget = targetRef.current ?? scroller.scrollLeft;
      let direction = autoScrollDirectionRef.current;

      if (direction === 1 && currentTarget >= maxScrollLeft - SCROLL_EDGE_EPSILON) {
        direction = -1;
      } else if (direction === -1 && currentTarget <= SCROLL_EDGE_EPSILON) {
        direction = 1;
      }

      autoScrollDirectionRef.current = direction;
      const transitionMs = window.matchMedia("(max-width: 600px)").matches ? 700 : 1000;
      scrollByDirection(direction, { revealLabel: false, transitionMs, automatic: true });
      autoScroll = window.setTimeout(runAutoScroll, 8000);
    };

    autoScroll = window.setTimeout(runAutoScroll, 7000);

    return () => window.clearTimeout(autoScroll);
  }, [isCarouselHovered, photos.length, scrollByDirection, autoScrollResetToken]);

  return (
    <div
      className="mu-violin-carousel-shell"
      data-can-scroll-left={scrollState.canScrollLeft ? "true" : "false"}
      data-can-scroll-right={scrollState.canScrollRight ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsCarouselHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsCarouselHovered(false);
      }}
    >
      <div ref={scrollerRef} className="mu-violin-carousel" role="list" aria-label="Violin photo archive">
        {photos.map((photo) => {
          const labelId = `${carouselId}-${photo.id}-label`;
          const isLabelActive = activeLabelPhotoId === photo.id;

          return (
            <div
              className={"mu-violin-photo" + (isLabelActive ? " is-label-active" : "")}
              role="listitem"
              key={photo.id}
              data-photo-id={photo.id}
              onPointerEnter={(event) => {
                // Mouse hover reveals a caption; touch is left to tap/scroll so
                // it doesn't fight the tap handler. Either way, one label wins.
                if (event.pointerType === "mouse") setActiveLabelPhotoId(photo.id);
              }}
            >
              <button
                type="button"
                className="mu-violin-photo-trigger"
                aria-label={photo.alt}
                aria-describedby={labelId}
                aria-expanded={isLabelActive}
                onClick={() => togglePhotoLabel(photo.id)}
              >
                <span className="mu-violin-photo-media" aria-hidden="true">
                  <img
                    className={"mu-violin-photo-img" + (loadedPhotoIds.has(photo.id) ? " is-loaded" : "")}
                    src={photo.src}
                    alt=""
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => markPhotoLoaded(photo.id)}
                  />
                </span>
              </button>
              <span className="mu-violin-photo-label" id={labelId}>
                <RenderBreakableLabel value={photo.label} />
              </span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mu-violin-carousel-control mu-violin-carousel-control--left"
        aria-label="Scroll violin photos left"
        disabled={!scrollState.canScrollLeft}
        onClick={() => {
          autoScrollDirectionRef.current = 1;
          scrollByDirection(-1);
        }}
      >
        <ArrowLeft size={15} strokeWidth={3} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="mu-violin-carousel-control mu-violin-carousel-control--right"
        aria-label="Scroll violin photos right"
        disabled={!scrollState.canScrollRight}
        onClick={() => {
          autoScrollDirectionRef.current = 1;
          scrollByDirection(1);
        }}
      >
        <ArrowRight size={15} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  );
}

function shuffleItems<T>(items: readonly T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export default function MusicPage() {
  const [active, setActive] = useState("conducting");
  const [shuffledRepertoireComposers, setShuffledRepertoireComposers] = useState(repertoireComposers);
  const [showSectionNav, setShowSectionNav] = useState(false);
  const [activePianoVideoIndex, setActivePianoVideoIndex] = useState(0);
  const [pianoVideoReelPosition, setPianoVideoReelPosition] = useState(1);
  const [isPianoVideoTrackSnapping, setIsPianoVideoTrackSnapping] = useState(false);
  const [isPianoVideoHovered, setIsPianoVideoHovered] = useState(false);
  const [isPianoVideoPlaying, setIsPianoVideoPlaying] = useState(false);
  const [pianoVideoEndedAt, setPianoVideoEndedAt] = useState(0);
  const [isCompactViolinLayout, setIsCompactViolinLayout] = useState(false);
  const pianoVideoFrameRef = useRef<HTMLDivElement>(null);
  const isPianoVideoTransitioningRef = useRef(false);
  const pianoVideoTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const registerPianoVideoListeners = () => {
    const iframes = pianoVideoFrameRef.current?.querySelectorAll<HTMLIFrameElement>("iframe");
    iframes?.forEach((iframe) => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: iframe.id }), "https://www.youtube-nocookie.com");
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
        "https://www.youtube-nocookie.com"
      );
    });
  };
  const releasePianoVideoTransition = () => {
    isPianoVideoTransitioningRef.current = false;
  };
  const movePianoVideo = (direction: -1 | 1) => {
    if (isPianoVideoTransitioningRef.current) return false;

    isPianoVideoTransitioningRef.current = true;
    setIsPianoVideoTrackSnapping(false);
    setPianoVideoEndedAt(0);
    setPianoVideoReelPosition((position) => position + direction);
    setActivePianoVideoIndex((index) => (index + direction + pianoVideos.length) % pianoVideos.length);
    return true;
  };
  const showPreviousPianoVideo = () => movePianoVideo(-1);
  const showNextPianoVideo = () => movePianoVideo(1);
  const showPianoVideo = (index: number) => {
    if (index === activePianoVideoIndex) return;

    if (!movePianoVideo(index > activePianoVideoIndex ? 1 : -1)) return;
    setActivePianoVideoIndex(index);
  };
  const playActivePianoVideo = () => {
    const iframe = pianoVideoFrameRef.current?.querySelectorAll<HTMLIFrameElement>("iframe")[pianoVideoReelPosition];
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "playVideo", args: [] }),
      "https://www.youtube-nocookie.com"
    );
  };
  const onPianoVideoTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 820px)").matches) return;

    const touch = event.touches[0];
    pianoVideoTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const onPianoVideoTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = pianoVideoTouchStartRef.current;
    pianoVideoTouchStartRef.current = null;
    if (!start || !window.matchMedia("(max-width: 820px)").matches) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < 12 && absY < 12) {
      playActivePianoVideo();
      return;
    }

    if (absX < 42 || absX < absY * 1.25) return;

    event.preventDefault();
    if (deltaX < 0) showNextPianoVideo();
    else showPreviousPianoVideo();
  };
  const onPianoVideoTouchCancel = () => {
    pianoVideoTouchStartRef.current = null;
  };
  const snapPianoVideoReel = () => {
    if (pianoVideoReelPosition === 0) {
      setIsPianoVideoTrackSnapping(true);
      setPianoVideoReelPosition(pianoVideos.length);
    } else if (pianoVideoReelPosition === pianoVideos.length + 1) {
      setIsPianoVideoTrackSnapping(true);
      setPianoVideoReelPosition(1);
    } else {
      releasePianoVideoTransition();
    }
  };

  useEffect(() => {
    setShuffledRepertoireComposers(shuffleItems(repertoireComposers));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 820px)");
    const updateLayout = () => setIsCompactViolinLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

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

  useEffect(() => {
    const iframes = pianoVideoFrameRef.current?.querySelectorAll<HTMLIFrameElement>("iframe");
    setIsPianoVideoPlaying(false);
    iframes?.forEach((iframe, index) => {
      if (index !== pianoVideoReelPosition) {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "https://www.youtube-nocookie.com"
        );
      }
    });
  }, [pianoVideoReelPosition]);

  useEffect(() => {
    if (!isPianoVideoTrackSnapping) return;

    const frameId = window.requestAnimationFrame(() => {
      setIsPianoVideoTrackSnapping(false);
      releasePianoVideoTransition();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isPianoVideoTrackSnapping]);

  useEffect(() => {
    const fallbackId = window.setTimeout(() => {
      if (pianoVideoReelPosition === 0 || pianoVideoReelPosition === pianoVideos.length + 1) {
        snapPianoVideoReel();
      } else {
        releasePianoVideoTransition();
      }
    }, 700);
    return () => window.clearTimeout(fallbackId);
  }, [pianoVideoReelPosition]);

  useEffect(() => {
    registerPianoVideoListeners();
    const retryId = window.setTimeout(registerPianoVideoListeners, 1200);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube-nocookie.com" && event.origin !== "https://www.youtube.com") return;

      let data: unknown = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;

      const message = data as { event?: string; info?: number | { playerState?: number } };
      const playerState = typeof message.info === "number" ? message.info : message.info?.playerState;
      if ((message.event === "onStateChange" || message.event === "infoDelivery") && typeof playerState === "number") {
        setIsPianoVideoPlaying(playerState === 1 || playerState === 3);
        if (playerState === 0) setPianoVideoEndedAt(Date.now());
        else setPianoVideoEndedAt(0);
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.clearTimeout(retryId);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (active !== "piano" || isPianoVideoHovered || isPianoVideoPlaying || pianoVideos.length < 2) return;

    const cycleId = window.setInterval(() => {
      movePianoVideo(1);
    }, 10000);

    return () => window.clearInterval(cycleId);
  }, [active, isPianoVideoHovered, isPianoVideoPlaying]);

  useEffect(() => {
    if (!pianoVideoEndedAt || active !== "piano" || isPianoVideoHovered || isPianoVideoPlaying || pianoVideos.length < 2) return;

    const timeoutId = window.setTimeout(() => {
      movePianoVideo(1);
      setPianoVideoEndedAt(0);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [pianoVideoEndedAt, active, isPianoVideoHovered, isPianoVideoPlaying]);

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
                <b>{s.value}</b>
                <span className="mu-hero-stat-label">{s.label}</span>
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
        <div className="mu-sec-grid mu-conducting-grid">
          <div className="mu-sec-copy mu-conducting-heading">
            <Reveal as="span" className="mu-kicker">
              {conductingMovement.kicker}
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              {conductingMovement.title}
            </Reveal>
          </div>
          <div className="mu-sec-copy mu-conducting-body">
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
                src={`https://www.youtube-nocookie.com/embed/${conductingPremiere.youtubeId}?${quietYoutubeParams}`}
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
          <Reveal className="mu-piano-video">
            <div
              className="mu-piano-video-inner"
              onPointerEnter={() => setIsPianoVideoHovered(true)}
              onPointerLeave={() => setIsPianoVideoHovered(false)}
              onFocus={() => setIsPianoVideoHovered(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsPianoVideoHovered(false);
              }}
            >
              <div className="mu-piano-video-frame" ref={pianoVideoFrameRef}>
                <div
                  className={"mu-piano-video-track" + (isPianoVideoTrackSnapping ? " is-snapping" : "")}
                  style={{ transform: `translateX(-${pianoVideoReelPosition * 100}%)` }}
                  onTransitionEnd={snapPianoVideoReel}
                >
                  {pianoVideoReel.map((video, index) => (
                    <div className="mu-piano-video-slide" key={`${video.youtubeId}-${index}`}>
                      <iframe
                        id={`piano-video-${index}`}
                        loading="eager"
                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?${pianoYoutubeParams}`}
                        title={video.title}
                        tabIndex={index === pianoVideoReelPosition ? 0 : -1}
                        aria-hidden={index !== pianoVideoReelPosition}
                        onLoad={registerPianoVideoListeners}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
                <div
                  className={"mu-piano-video-swipe-layer" + (isPianoVideoPlaying ? " is-disabled" : "")}
                  aria-hidden="true"
                  onTouchStart={onPianoVideoTouchStart}
                  onTouchEnd={onPianoVideoTouchEnd}
                  onTouchCancel={onPianoVideoTouchCancel}
                />
              </div>
              <div className="mu-piano-carousel" aria-label="Piano video excerpts">
                <button type="button" className="mu-piano-carousel-arrow" onClick={showPreviousPianoVideo} aria-label="Show previous piano video">
                  <ArrowLeft size={17} strokeWidth={2.8} aria-hidden="true" />
                </button>
                <div className="mu-piano-carousel-pages" aria-label="Piano videos">
                  {pianoVideos.map((video, index) => (
                    <button
                      key={video.youtubeId}
                      type="button"
                      className={"mu-piano-carousel-page" + (index === activePianoVideoIndex ? " is-active" : "")}
                      onClick={() => showPianoVideo(index)}
                      aria-pressed={index === activePianoVideoIndex}
                      aria-label={`Show piano video ${index + 1}`}
                    />
                  ))}
                </div>
                <button type="button" className="mu-piano-carousel-arrow" onClick={showNextPianoVideo} aria-label="Show next piano video">
                  <ArrowRight size={17} strokeWidth={2.8} aria-hidden="true" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mu-marquee" aria-hidden="true">
          <div className="mu-marquee-track">
            {[...shuffledRepertoireComposers, ...shuffledRepertoireComposers].map((c, n) => (
              <span key={n}>
                {c}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
        {/* Restore the Play import and pianoRecordings import when re-enabling this list.
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
        */}
      </section>

      {/* Violin */}
      <section id="violin" className="mu-sec mu-violin">
        <div className="mu-sec-grid">
          {!isCompactViolinLayout ? (
            <SoundField className="mu-violin-strings mu-violin-strings--desktop" variant="strings" color={[201, 156, 96]} />
          ) : null}
          <div className="mu-sec-copy mu-violin-copy">
            {isCompactViolinLayout ? (
              <SoundField className="mu-violin-strings mu-violin-strings--mobile" variant="strings" color={[201, 156, 96]} />
            ) : null}
            <Reveal as="span" className="mu-kicker">
              {violinMovement.kicker}
            </Reveal>
            <Reveal as="h2" className="mu-sec-title">
              {violinMovement.title}
            </Reveal>
            <Reveal className="mu-violin-gallery mu-violin-gallery--mobile">
              <ViolinPhotoCarousel photos={violinPhotos} />
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
        <Reveal className="mu-violin-gallery mu-violin-gallery--desktop">
          <ViolinPhotoCarousel photos={violinPhotos} />
        </Reveal>
      </section>

      <PageFooter className="mu-foot" />
    </div>
  );
}
