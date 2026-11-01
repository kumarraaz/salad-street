import Link from "next/link";
import { HIGHLIGHTS, type Blog } from "@/lib/data";
import { ILL } from "@/lib/svg";
import { Icon, RawSvg } from "./ui";
import Media from "./Media";

export function HighlightCards() {
  return (
    <div className="hl-grid">
      {HIGHLIGHTS.map((h) => (
        <article className="hl-card" key={h.id}>
          <div className="hl-ill">
            <RawSvg html={ILL[h.ill]} />
          </div>
          <div className="hl-meta">
            <span className="ic-circle">
              <Icon k={h.icon} size={24} />
            </span>
            <div>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function BlogCard({ b }: { b: Blog }) {
  return (
    <article className="bcard">
      <Link href={`/blog/${b.slug}`} tabIndex={-1} aria-hidden="true">
        <Media src={b.img} label={"Blog cover · " + b.title} alt="" />
      </Link>
      <div className="bbody">
        <h3>
          <Link href={`/blog/${b.slug}`}>{b.title}</Link>
        </h3>
        <p>{b.excerpt}</p>
        <Link className="link-arrow" href={`/blog/${b.slug}`} aria-label={`Read more: ${b.title}`}>
          Read More <Icon k="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
