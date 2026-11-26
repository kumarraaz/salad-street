"use client";

import { productsInCategory } from "@/lib/data";
import { Cta, Decor, Icon } from "./ui";

/* "Ready-to-Eat" promo banner. Entrance runs when the shared observer in Motion.tsx adds `is-in`
   to `.kits`; no pointer parallax. Copy is unchanged; motion is skipped for prefers-reduced-motion. */

const TITLE = "Fresh Salads";

export default function KitsBanner({ cls = "" }: { cls?: string }) {
  const n = productsInCategory("salad-greens");
  return (
    <section className={`kits-wrap ${cls}`} aria-labelledby="kits-t">
      <div className="wrap">
        <div className="kits kx">
          <span className="kx-blob kx-b1" aria-hidden="true" />
          <span className="kx-blob kx-b2" aria-hidden="true" />
          <span className="kx-blob kx-b3" aria-hidden="true" />
          <span className="kx-shine" aria-hidden="true" />
          <Decor k="leaf" cls="kits-leaf" />
          <div className="kits-copy">
            <p className="script kx-in" style={{ "--d": "0s" } as React.CSSProperties}>
              Ready-to-Eat
            </p>
            <h2 id="kits-t" aria-label={TITLE}>
              {TITLE.split("").map((ch, i) => (
                <span key={i} className="kx-ch" aria-hidden="true" style={{ "--d": `${0.15 + i * 0.045}s` } as React.CSSProperties}>
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </h2>
            <p className="kits-sub kx-in" style={{ "--d": ".7s" } as React.CSSProperties}>
              Healthy meals, ready when you are
            </p>
            <ul className="ticks">
              {[
                { k: "leaf", t: "Farm Fresh" },
                { k: "check", t: "Ready to Eat" },
                { k: "heart", t: "Healthy" },
              ].map((x, i) => (
                <li key={x.t} className="kx-pop" style={{ "--d": `${0.85 + i * 0.12}s` } as React.CSSProperties}>
                  <Icon k={x.k} size={18} /> {x.t}
                </li>
              ))}
            </ul>
            <div className="kx-in kx-cta" style={{ "--d": "1.25s" } as React.CSSProperties}>
              <Cta label={n ? "Shop Salad Greens" : "Explore Products"} href={n ? "/products?cat=salad-greens" : "/products"} solid />
            </div>
          </div>
          <div className="kits-art">
            <span className="kx-ring kx-r1" aria-hidden="true" />
            <span className="kx-ring kx-r2" aria-hidden="true" />
            <span className="kx-glow" aria-hidden="true" />
            <div className="kx-bowl">
              <Decor k="bowlH" cls="kits-bowl" float={false} />
            </div>
            <span className="kx-orb kx-o1" aria-hidden="true">
              <Decor k="tomato" float={false} />
            </span>
            <span className="kx-orb kx-o2" aria-hidden="true">
              <Decor k="carrot" float={false} />
            </span>
            <span className="kx-orb kx-o3" aria-hidden="true">
              <Decor k="leaf" float={false} />
            </span>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={`kx-spark kx-s${i}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
