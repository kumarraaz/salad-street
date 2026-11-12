import { Cta, Decor, SecTitle } from "./ui";
import { HarvestRail } from "./Rails";

/* Display only: no prices or stock levels are shown because none are confirmed.
   Product images come from lib/data.ts (public/images/leafy/*.png); replace those files to update them. */

/** "What's Going to Be Available Next Week?" — upcoming harvest slider. */
export function UpcomingHarvest({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec harvest deco-sec ${cls}`} aria-labelledby="hv-t">
      <Decor k="carrot" cls="hv-carrot" />
      <Decor k="leaf" cls="hv-leaf" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="decor floaty hv-lettuce" src="/images/leafy/lettuce-mix.png" width={360} height={300} alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="wrap">
        <SecTitle id="hv-t" eyebrow="Upcoming Harvest" title="What's Going to Be Available Next Week?" sub="Leafy greens from our farm. Message us to reserve yours." />
        <HarvestRail />
        <div className="cta-row">
          <Cta label="Enquire to Reserve" href="/contact" solid />
        </div>
      </div>
    </section>
  );
}
