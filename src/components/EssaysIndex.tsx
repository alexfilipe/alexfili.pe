import { ArrowUpRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { essayEntries } from "@/data/essaysContent";

/**
 * EssaysIndex — a simple index of all writing: Fraunces masthead, sans-serif
 * item titles, hairline-separated rows. Each row opens the reader at
 * /essay#<id>. Ported from the design-system essays.html recreation.
 */
export default function EssaysIndex() {
  return (
    <div>
      <SiteNav
        links={[
          { label: "Work", href: "/projects" },
          { label: "Music", href: "/music" },
          { label: "Essays", href: "/essays", current: true }
        ]}
      />
      <div className="el-wrap">
        <header className="el-head">
          <h1 className="el-title">Essays</h1>
          <p className="el-intro">
            Notes on engineering, music, and the long work of getting better — placeholder text for now.
          </p>
        </header>
        <div className="el-list">
          {essayEntries.map((e) => (
            <a className="el-item" key={e.id} href={`/essay#${e.id}`}>
              <span className="el-date">
                <span>{e.date}</span>
                <span className="el-read">· {e.read}</span>
              </span>
              <h2 className="el-name">{e.title}</h2>
              <p className="el-excerpt">{e.excerpt}</p>
              <span className="el-arrow" aria-hidden="true">
                <ArrowUpRight size={22} strokeWidth={2.4} />
              </span>
            </a>
          ))}
        </div>
        <footer className="el-foot">
          <span>© 2026 Álex Filipe Santos</span>
          <span className="el-foot-sep">·</span>
          <span>San Francisco, CA</span>
        </footer>
      </div>
    </div>
  );
}
