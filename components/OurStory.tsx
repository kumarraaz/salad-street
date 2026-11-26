import Link from "next/link";
import { Cta, Icon, SecTitle } from "./ui";
import { FARM_IMG, FarmProcess, hasFarmImg } from "./Sections";
import { MISSION, PILLARS, VISION } from "./VisionMission";

/* "Why We Grow / Our Story": alternating image + text rows (rectangular 16px images, no circles or blobs).
   All wording is the client's existing copy. */

function Row({ img, alt, w, h, flip = false, children }: { img: string; alt: string; w: number; h: number; flip?: boolean; children: React.ReactNode }) {
  return (
    <div className={`st-row${flip ? " flip" : ""}`}>
      <figure className="st-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      </figure>
      <div className="st-copy">{children}</div>
    </div>
  );
}

export default function OurStory({ cls = "" }: { cls?: string }) {
  // Real farm photo once supplied; until then the herbs & greens photo already used on the site.
  const farm = hasFarmImg
    ? { img: FARM_IMG, alt: "Salad Street farm", w: 1100, h: 720 }
    : { img: "/images/hero/banner-4-sm.webp", alt: "Fresh herbs and leafy greens", w: 1024, h: 341 };
  return (
    <section className={`sec story ${cls}`} id="our-story" aria-labelledby="story-t">
      <div className="wrap">
        <SecTitle id="story-t" eyebrow="Why We Grow" title="Our Story" />

        <Row {...farm}>
          <p className="script">Our Farm, Your Freshness</p>
          <h3 className="story-sub">From Our Farm to Your Plate</h3>
          <p>Grown at our own farm, prepared fresh and ready to eat, to bring you the best quality salad greens, herbs and microgreens.</p>
          <ul className="st-points">
            <li>
              <Icon k="sprout" size={18} /> Grown at our farm
            </li>
            <li>
              <Icon k="basket" size={18} /> Picked and packed with care
            </li>
            <li>
              <Icon k="leaf" size={18} /> Farm fresh ingredients
            </li>
          </ul>
          <Cta label="About Us" href="/about" solid />
        </Row>

        <Row img="/images/packs/salad-leaves-mix-200g.webp" alt="Salad Street Farms Salad Leaves Mix pack" w={900} h={720} flip>
          <p className="script">Our Vision</p>
          <h3 className="story-sub">{VISION.title}</h3>
          <p>{VISION.text}</p>
          <p className="script st-k2">Our Mission</p>
          <h3 className="story-sub sm">{MISSION.title}</h3>
          <p>{MISSION.text}</p>
        </Row>

        <Row img="/images/packs/lettuce-mix.webp" alt="Salad Street Farms Lettuce Mix pack" w={900} h={720}>
          <p className="script">What we believe in</p>
          <h3 className="story-sub">Keeping the journey of food simple and transparent</h3>
          <ul className="st-points st-pillars">
            {PILLARS.map((p) => (
              <li key={p.title}>
                <Icon k={p.icon} size={18} />
                <span>
                  <b>{p.title}</b> {p.text}
                </span>
              </li>
            ))}
          </ul>
        </Row>

        <FarmProcess />
        <p className="vm-tag">At Salad Street Farms, we are not just growing greens; we are growing a healthier tomorrow.</p>
        <div className="cta-row">
          <Link className="btn btn-outline" href="/about#vision-mission">
            Read Our Full Story <Icon k="arrow" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
