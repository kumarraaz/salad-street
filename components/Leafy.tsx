import { LEAFY } from "@/lib/data";
import { Cta, Decor, SecTitle } from "./ui";

/* Leafy greens shown as free-floating transparent cutouts (no boxed cards).
   Display only: no prices or stock levels are shown because none are confirmed. */

/** "What's Going to Be Available Next Week?" — upcoming harvest strip. */
export function UpcomingHarvest({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec harvest deco-sec ${cls}`} aria-labelledby="hv-t">
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

