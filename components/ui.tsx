import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { LOGO_SYMBOL } from "@/lib/svg";

/* Icon paths — copied verbatim from the original design */
export const P: Record<string, string> = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  chevL: "m15 18-6-6 6-6",
  chevR: "m9 18 6-6-6-6",
  chevD: "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  close: "M18 6 6 18M6 6l12 12",
  menu: "M4 7h16M4 12h16M4 17h16",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  heart: "M12 20s-7-4.4-9.3-8.8A4.9 4.9 0 0 1 12 6.2a4.9 4.9 0 0 1 9.3 5C19 15.6 12 20 12 20z",
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12h11.9L22 7H6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  leaf: '<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19 13 11"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 9 6 6M15 9l-6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  fork: "M7 2v20M4 2v6a3 3 0 0 0 6 0V2M18 2c-2 1.5-3 5-3 9h3v11",
  wheel: '<circle cx="8" cy="16" r="5"/><circle cx="19" cy="18" r="3"/><path d="M5 11V5h7l3 6h4v4"/>',
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  sprout: '<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6z"/>',
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
};

export function Icon({ k, size = 20 }: { k: string; size?: number }) {
  const d = P[k] || k;
  const common = {
    className: "ico",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": "true" as const,
    focusable: "false" as const,
  };
  return d.startsWith("<") ? (
    <svg {...common} dangerouslySetInnerHTML={{ __html: d }} />
  ) : (
    <svg {...common}>
      <path d={d} />
    </svg>
  );
}

export function LeafFill({ size = 28 }: { size?: number }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20C4 10 10.5 3.5 21 3.5c0 10.5-6.5 16.5-17 16.5z" fill="#6DB53F" />
      <path d="M4 20 13.5 10.5" stroke="#2E7D32" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LeafDeco({ x, y, s, r, op = 1 }: { x: string; y: string; s: number; r: number; op?: number }) {
  const style: CSSProperties = {
    left: x,
    top: y,
    width: `${s}px`,
    height: `${s}px`,
    transform: `rotate(${r}deg)`,
    opacity: op,
  };
  return (
    <svg className="leaf-deco" style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20C4 10 10.5 3.5 21 3.5c0 10.5-6.5 16.5-17 16.5z" fill="#6DB53F" />
      <path d="M4 20 13.5 10.5" stroke="#3E8E2A" strokeWidth="1.4" />
    </svg>
  );
}

/** Renders an `<svg ...>inner</svg>` string (from lib/svg.ts) as a real <svg> element. */
export function RawSvg({ html }: { html: string }) {
  const m = html.match(/^<svg\s+([^>]*)>([\s\S]*)<\/svg>$/);
  if (!m) return null;
  const props: Record<string, string> = {};
  for (const a of m[1].matchAll(/([\w:-]+)="([^"]*)"/g)) {
    props[a[1] === "class" ? "className" : a[1]] = a[2];
  }
  return <svg {...props} dangerouslySetInnerHTML={{ __html: m[2] }} />;
}

export function SvgSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: LOGO_SYMBOL }}
    />
  );
}

export function Logo({ w, h, label = true }: { w: number; h: number; label?: boolean }) {
  return label ? (
    <svg width={w} height={h} viewBox="0 0 391 290" role="img" aria-label="Salad Street Farms">
      <use href="#logo-mark" />
    </svg>
  ) : (
    <svg width={w} height={h} viewBox="0 0 391 290" aria-hidden="true">
      <use href="#logo-mark" />
    </svg>
  );
}

export function Tbc({ t, on }: { t: string; on?: boolean }) {
  return on ? (
    <span className="tbc" title="To be confirmed by Salad Street">
      {t}
    </span>
  ) : (
    <>{t}</>
  );
}

export function SecTitle({ title, sub, id }: { title: string; sub?: string; id?: string }) {
  return (
    <div className="sec-title">
      <h2 id={id}>
        <LeafFill />
        {title}
        <LeafFill />
      </h2>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}

export function Cta({ label, href, solid = false }: { label: string; href: string; solid?: boolean }) {
  return (
    <Link className={`btn ${solid ? "btn-solid" : "btn-outline"}`} href={href}>
      {label}
      <Icon k="arrow" size={18} />
    </Link>
  );
}

export function CtaRow({ label, href }: { label: string; href: string }) {
  return (
    <div className="cta-row">
      <Cta label={label} href={href} />
    </div>
  );
}

export type Crumb = { label: string; href?: string };
export function PageHero({ title, sub = "", trail = [] }: { title: string; sub?: string; trail?: Crumb[] }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {trail.map((t, i) => (
            <Fragment key={i}>
              <span aria-hidden="true">/</span>
              {t.href ? <Link href={t.href}>{t.label}</Link> : <span aria-current="page">{t.label}</span>}
            </Fragment>
          ))}
        </nav>
        <h1>{title}</h1>
        {sub ? <p>{sub}</p> : null}
      </div>
    </section>
  );
}
