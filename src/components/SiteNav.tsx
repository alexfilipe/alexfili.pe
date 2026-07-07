import { useEffect, useState } from "react";

/**
 * SiteNav — the fixed glass top navigation used on the Music, Essays, and
 * Project/Work pages. Ported from the design-system Navbar (which mirrors the
 * home's `.figma-navbar`). Styling is inline + design tokens, so it needs no
 * extra CSS beyond the tokens in global.css / pages.css.
 *
 * Persistent by default. Pass `revealOnScroll` for the home's hide-at-top /
 * slide-in-on-scroll-up behavior.
 */

export type NavLinkItem = {
  label: string;
  href: string;
  current?: boolean;
};

type SiteNavProps = {
  brand?: string;
  logoSrc?: string;
  href?: string;
  links?: NavLinkItem[];
  revealOnScroll?: boolean;
};

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function NavLink({ label, href, current = false }: NavLinkItem) {
  const [hover, setHover] = useState(false);
  const shown = hover;
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        paddingBlock: "0.4rem",
        color: shown ? "var(--text)" : "rgba(240, 237, 230, 0.62)",
        fontFamily: "var(--sans)",
        fontSize: "0.8rem",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: `color 180ms ${EASE}`
      }}
    >
      {label}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          left: 0,
          height: "1px",
          background: "var(--gold)",
          transform: shown ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: shown ? "left" : "right",
          transition: `transform 180ms ${EASE}`
        }}
      />
    </a>
  );
}

export default function SiteNav({
  brand = "Álex Filipe Santos",
  logoSrc = "/logo-mark.svg",
  href = "/",
  links = [
    { label: "Work", href: "/projects" },
    { label: "Music", href: "/music" }
  ],
  revealOnScroll = false
}: SiteNavProps) {
  const [shown, setShown] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 240) setShown(false);
      else if (y > lastY + 2) setShown(true);
      else if (y < lastY - 2) setShown(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealOnScroll]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        borderBottom: "1px solid var(--line-soft)",
        background: "var(--glass-bg)",
        WebkitBackdropFilter: "var(--glass-blur)",
        backdropFilter: "var(--glass-blur)",
        opacity: shown ? 1 : 0,
        visibility: shown ? "visible" : "hidden",
        transform: shown ? "translateY(0)" : "translateY(-100%)",
        transition: shown
          ? `opacity .42s ${EASE}, transform .32s ${EASE}, visibility 0s`
          : `opacity .56s ${EASE}, transform .56s ${EASE}, visibility 0s linear .56s`
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          maxWidth: "960px",
          margin: "0 auto",
          padding: ".65rem clamp(1.25rem, 4vw, 2rem)"
        }}
      >
        <a
          href={href}
          aria-label={`${brand} — home`}
          style={{ display: "inline-flex", alignItems: "center", gap: ".62rem", color: "var(--text)" }}
        >
          {logoSrc ? <img src={logoSrc} alt="" width={28} height={28} style={{ display: "block" }} /> : null}
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: "1.05rem",
              fontWeight: 500,
              letterSpacing: ".01em",
              whiteSpace: "nowrap"
            }}
          >
            {brand}
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.15rem, 2.25vw, 1.85rem)" }}>
          {links.map((l) => (
            <NavLink key={l.label} {...l} />
          ))}
        </div>
      </nav>
    </header>
  );
}
