import Link from "next/link";
import { LEAFY } from "@/lib/data";
import { Cta, Decor, Icon, SecTitle } from "./ui";

/* Leafy greens shown as free-floating transparent cutouts (no boxed cards).
   Display only: no prices or stock levels are shown because none are confirmed. */

/** "What's Going to Be Available Next Week?" — upcoming harvest strip. */
export function UpcomingHarvest() {
  return (
    <section className="sec harvest deco-sec" aria-labelledby="hv-t">
      <Decor k="carrot" cls="hv-carrot" />
      <Decor k="leaf" cls="corner-tr" />
      <div className="wrap">
        <SecTitle id="hv-t" eyebrow="Upcoming Harvest" title="What's Going to Be Available Next Week?" sub="Leafy greens from our farm. Message us to reserve yours." />
        <ul className="hv-track" aria-label="Upcoming leafy greens">
          {LEAFY.map((l, i) => (
            <li className="hv-item" key={l.id} style={{ ["--d" as string]: `${(i % 4) * -1.4}s` }}>
              <span className="hv-glow" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hv-img" src={l.img} alt={l.name} loading="lazy" decoding="async" width={360} height={300} />
              <b>{l.name}</b>
            </li>
          ))}
        </ul>
        <div className="cta-row">
          <Cta label="Enquire to Reserve" href="/contact" solid />
        </div>
      </div>
    </section>
  );
}

/** "Fresh Picks from Our Farm" — large floating product showcase. */
export function FreshPicks() {
  return (
    <section className="sec picks deco-sec" id="our-products" aria-labelledby="pk-t">
      <Decor k="leaf" cls="corner-tl" />
      <Decor k="tomato" cls="pk-tomato" />
      <div className="wrap">
        <SecTitle id="pk-t" eyebrow="Our Leafy Greens" title="Fresh Picks from Our Farm" />
        <ul className="pk-grid">
          {LEAFY.map((l, i) => (
            <li className="pk-item" key={l.id}>
              <Link href={`/contact?item=${encodeURIComponent(l.name)}`} className="pk-link" aria-label={`Enquire about ${l.name}`}>
                <span className="pk-stage" style={{ ["--d" as string]: `${i * -0.9}s` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pk-img" src={l.img} alt={l.name} loading="lazy" decoding="async" width={520} height={440} />
                  <span className="pk-shadow" aria-hidden="true" />
                </span>
                <h3>{l.name}</h3>
                <p>{l.note}</p>
                <span className="pk-cta">
                  Enquire <Icon k="arrow" size={15} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="cta-row">
          <Cta label="Shop All Products" href="/products" solid />
        </div>
      </div>
    </section>
  );
}
