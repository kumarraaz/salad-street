import Link from "next/link";
import { CATEGORIES, WHY } from "@/lib/data";
import { Cta, Decor, Icon, SecTitle, Tbc } from "./ui";
import fs from "node:fs";
import path from "node:path";
import { FARM_VIDEO_FALLBACK, SCENE } from "@/lib/media";
import { FarmPhotoVideo } from "./SectionsClient";

/* All copy below re-uses wording already approved on the site (hero, Why Choose Us, FAQ).
   Nothing here adds new claims about delivery times, certifications or ratings. */

/** Four-up benefit strip under the hero (content of the old hero badges + Why Choose Us). */
export function FeatureStrip({ cls = "" }: { cls?: string }) {
  const items = [
    { icon: "leaf", t: "100% Fresh", s: "Farm fresh ingredients" },
    { icon: "handshake", t: "No Middlemen", s: "Connecting our farm directly with consumers" },
    { icon: "heart", t: "Healthy & Nutritious", s: "Made for everyday wellness", tbc: true },
    { icon: "basket", t: "Ready to Eat", s: "Prepared fresh, ready to eat" },
  ];
  return (
    <section className={`fstrip ${cls}`} aria-label="Why Salad Street">
      <div className="wrap fstrip-in">
        {items.map((it) => (
          <div className="fitem" key={it.t}>
            <span className="fi-ic">
              <Icon k={it.icon} size={26} />
            </span>
            <b>{it.t}</b>
            <small>
              <Tbc t={it.s} on={it.tbc} />
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}


/* Real farm photo: shown only once /public/images/farm/farm.webp exists (checked at build time). */
export const FARM_IMG = "/images/farm/farm.webp";
export const hasFarmImg = fs.existsSync(path.join(process.cwd(), "public", FARM_IMG));
/* Farm video: the section appears once /public/images/farm/farm.mp4 exists (keep it under 5 MB). */
export const FARM_VIDEO = "/images/farm/farm.mp4";
export const hasFarmVideo = fs.existsSync(path.join(process.cwd(), "public", FARM_VIDEO));

/** "From Our Farm to Your Plate" story with the farm photo. */
export function FarmStory({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec farm ${cls}`} aria-labelledby="farm-t">
      <div className="wrap farm-in">
        <div className="farm-copy">
          <p className="script">Our Farm, Your Freshness</p>
          <h2 id="farm-t">From Our Farm to Your Plate</h2>
          <p>
            Grown at our own farm, prepared fresh and ready to eat, to bring you the best quality salad greens, herbs and microgreens.
          </p>
          <ul className="checks">
            <li>
              <Icon k="check" size={16} /> Grown at our farm
            </li>
            <li>
              <Icon k="check" size={16} /> Picked and packed with care
            </li>
            <li>
              <Icon k="check" size={16} /> Farm fresh ingredients
            </li>
          </ul>
          <Cta label="About Us" href="/about" solid />
        </div>
        <FarmPhotoVideo
          poster={hasFarmImg ? FARM_IMG : SCENE.farm}
          alt={hasFarmImg ? "Salad Street farm" : "Rows of fresh lettuce growing in a greenhouse"}
          video={hasFarmVideo ? FARM_VIDEO : FARM_VIDEO_FALLBACK}
        />
      </div>
    </section>
  );
}

export const STEPS = [
  { icon: "sprout", t: "Grow", s: "Grown at our farm" },
  { icon: "leaf", t: "Harvest", s: "Picked fresh" },
  { icon: "basket", t: "Pack", s: "Packed with care" },
  { icon: "truck", t: "Deliver", s: "Fresh to your table" },
];

/** The Salad Street farm process: Grow → Harvest → Pack → Deliver (dashed line draws on scroll). */
export function FarmProcess({ title = "The Salad Street Farm Process" }: { title?: string }) {
  return (
    <div className="process-in">
      <h3 className="story-sub">{title}</h3>
      <ol className="steps">
        <svg className="steps-line" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
          <path d="M12.5 1H87.5" />
        </svg>
        {STEPS.map((s, i) => (
          <li key={s.t}>
            <span className="step-ic">
              <Icon k={s.icon} size={26} />
            </span>
            <b>{s.t}</b>
            <small>{s.s}</small>
            {i < STEPS.length - 1 ? (
              <span className="step-arrow" aria-hidden="true">
                <Icon k="arrow" size={20} />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Why Choose Salad Street (4 columns). */
export function WhySection({ cls = "" }: { cls?: string }) {
  return (
    <section className={`why2 ${cls}`} aria-labelledby="why2-t">
      <div className="sec wrap">
        <Decor k="tomato" cls="why-tomato" />
        <SecTitle id="why2-t" title="Why Choose Salad Street?" />
        <div className="why-grid">
          {WHY.map((w) => (
            <div className="why-item" key={w.id}>
              <span className="why-ic">
                <Icon k={w.icon} size={28} />
              </span>
              <h3>{w.title}</h3>
              <p>
                <Tbc t={w.text} on={w.tbc} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Compact category tiles for the footer-adjacent CTA areas (re-uses category data). */
export function CategoryLinks() {
  return (
    <ul className="cat-links">
      {CATEGORIES.map((c) => (
        <li key={c.id}>
          <Link href={`/products?cat=${c.id}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
}
