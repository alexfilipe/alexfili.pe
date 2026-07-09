import { useEffect, useState } from "react";

/**
 * SiteNav — the fixed glass top navigation used on the Music, Essays, and
 * Project/Work pages. It uses the same `.figma-navbar` structure as the home
 * page so the chrome stays visually identical across routes.
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

function NavLink({ label, href, current = false }: NavLinkItem) {
  return (
    <a href={href} aria-current={current ? "page" : undefined}>
      {label}
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
    <header className={`figma-navbar${shown ? " is-visible" : ""}`}>
      <nav className="figma-navbar-inner" aria-label="Primary">
        <a className="figma-navbar-brand" href={href} aria-label={`${brand} — home`}>
          {logoSrc ? (
            <img src={logoSrc} alt="" className="figma-navbar-logo" width={28} height={28} aria-hidden="true" />
          ) : null}
          <span className="figma-navbar-name">{brand}</span>
        </a>
        <div className="figma-navbar-links">
          {links.map((l) => (
            <NavLink key={l.label} {...l} />
          ))}
        </div>
      </nav>
    </header>
  );
}
