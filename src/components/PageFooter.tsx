import { profile } from "@/data/profile";

type PageFooterProps = {
  /** Wrapper class carrying each page's layout context (e.g. "wk-foot", "pp-foot", "mu-foot"). */
  className?: string;
  /** Hide the LinkedIn/GitHub/Email row — used on the home page, where the socials already appear above the footer. */
  showSocials?: boolean;
  copyright?: string;
  location?: string;
  socialLinksLabel?: string;
};

/**
 * PageFooter — the shared site footer: copyright, location, and studio link on
 * the left; social links on the right. Each page passes its own wrapper
 * `className` so the surrounding layout (margins, border, width) stays
 * page-specific, while the inner markup lives in one place. Pass
 * `showSocials={false}` on the home page.
 */
export default function PageFooter({
  className,
  showSocials = true,
  copyright = `© ${new Date().getFullYear()} Álex Filipe Santos`,
  location = "San Francisco, CA",
  socialLinksLabel = "Social links"
}: PageFooterProps) {
  return (
    <footer className={["page-foot", className].filter(Boolean).join(" ")}>
      <div className="page-foot-copy">
        <span className="page-foot-identity">
          <span>{copyright}</span>
          <span className="page-foot-sep">•</span>
          <span>{location}</span>
        </span>
        <span className="page-foot-studio">
          <span className="page-foot-sep">•</span>
          <a href={profile.studio.url} target="_blank" rel="noopener noreferrer">
            {profile.studio.name} <span aria-hidden="true">↗</span>
          </a>
        </span>
      </div>
      {showSocials ? (
        <nav className="page-foot-links" aria-label={socialLinksLabel}>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </nav>
      ) : null}
    </footer>
  );
}
