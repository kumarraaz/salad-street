import Link from "next/link";
import { Cta, Icon, SecTitle } from "./ui";
import { FARM_IMG, FarmProcess, hasFarmImg } from "./Sections";
import { Pillars, VmCards } from "./VisionMission";

/* "Our Story": Vision & Mission + From Our Farm to Your Plate + the farm process, in one section.
   All wording is the client's existing copy. */
export default function OurStory({ cls = "" }: { cls?: string }) {
  // Real farm photo once supplied; until then the herbs & greens photo already used on the site.
  const photo = hasFarmImg
    ? { src: FARM_IMG, alt: "Salad Street farm", w: 1100, h: 720 }
    : { src: "/images/hero/banner-4-sm.webp", alt: "Fresh herbs and leafy greens", w: 1024, h: 341 };
  return (
    <section className={`sec story ${cls}`} id="our-story" aria-labelledby="story-t">
      <div className="wrap">
        <SecTitle id="story-t" eyebrow="Why We Grow" title="Our Story" />
        <div className="story-farm">
          <figure className="story-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" decoding="async" />
          </figure>
          <div className="farm-copy">
            <p className="script">Our Farm, Your Freshness</p>
            <h3 className="story-sub">From Our Farm to Your Plate</h3>
            <p>Grown at our own farm, prepared fresh and ready to eat, to bring you the best quality salad greens, herbs and microgreens.</p>
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
        </div>
        <VmCards />
        <Pillars />
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
