import Link from "next/link";
import { CATEGORIES, WHY, productsInCategory } from "@/lib/data";
import { SCENE } from "@/lib/media";
import { Cta, Decor, Icon, SecTitle, Tbc } from "./ui";
import { FarmVideo } from "./SectionsClient";

/* All copy below re-uses wording already approved on the site (hero, Why Choose Us, FAQ).
   Nothing here adds new claims about delivery times, certifications or ratings. */

/** Four-up benefit strip under the hero (content of the old hero badges + Why Choose Us). */
export function FeatureStrip({ cls = "" }: { cls?: string }) {
  const items = [
    { icon: "leaf", t: "100% Fresh", s: "Farm fresh ingredients" },
    { icon: "shield", t: "No Preservatives", s: "Made without added preservatives", tbc: true },
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

/** "Ready-to-Eat" promo banner with the client's horizontal salad-bowl PNG. */
export function KitsBanner({ cls = "" }: { cls?: string }) {
  const n = productsInCategory("fresh-salads");
  return (
    <section className={`kits-wrap ${cls}`} aria-labelledby="kits-t">
      <div className="wrap">
        <div className="kits">
          <Decor k="leaf" cls="kits-leaf" />
          <div className="kits-copy">
            <p className="script">Ready-to-Eat</p>
            <h2 id="kits-t">Fresh Salads</h2>
            <p className="kits-sub">Healthy meals, ready when you are</p>
            <ul className="ticks">
              <li>
                <Icon k="leaf" size={18} /> Farm Fresh
              </li>
              <li>
                <Icon k="check" size={18} /> Ready to Eat
              </li>
              <li>
                <Icon k="heart" size={18} /> Healthy
              </li>
            </ul>
            <Cta label={n ? "Shop Fresh Salads" : "Explore Fresh Salads"} href="/products?cat=fresh-salads" solid />
          </div>
          <div className="kits-art">
            <Decor k="bowlH" cls="kits-bowl" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** "From Our Farm to Your Plate" story with play-on-demand farm video. */
export function FarmStory({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec farm ${cls}`} aria-labelledby="farm-t">
      <div className="wrap farm-in">
        <div className="farm-copy">
          <p className="script">Our Farm, Your Freshness</p>
          <h2 id="farm-t">From Our Farm to Your Plate</h2>
          <p>
            Grown at our farm, prepared fresh and ready to eat. We source the freshest fruits and vegetables to bring you the best quality
            salads and healthy products.
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
        <FarmVideo poster={SCENE.farm} />
      </div>
    </section>
  );
}

/** Why Choose Salad Street (4 columns) + green "farm process" band. */
export function WhySection({ cls = "" }: { cls?: string }) {
  const steps = [
    { icon: "sprout", t: "Grow", s: "Grown at our farm" },
    { icon: "leaf", t: "Harvest", s: "Picked fresh" },
    { icon: "basket", t: "Pack", s: "Packed with care" },
    { icon: "truck", t: "Deliver", s: "Fresh to your table" },
  ];
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
      <div className="process" data-parallax="0.12" style={{ ["--bg" as string]: `url("${SCENE.harvest}")` }}>
        <div className="wrap process-in">
          <h2>The Salad Street Farm Process</h2>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.t}>
                <span className="step-ic">
                  <Icon k={s.icon} size={26} />
                </span>
                <b>{s.t}</b>
                <small>{s.s}</small>
                {i < steps.length - 1 ? (
                  <span className="step-arrow" aria-hidden="true">
                    <Icon k="arrow" size={20} />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
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
