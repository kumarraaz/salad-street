import Link from "next/link";
import { Icon, SecTitle } from "./ui";
import { FarmProcess } from "./Sections";
import { MISSION, PILLARS, VISION } from "./VisionMission";

/* "Why We Grow / Our Story": alternating image + text rows (rectangular 16px images, no circles or blobs).
   All wording is the client's existing copy. */


export default function OurStory({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec story ${cls}`} id="our-story" aria-labelledby="story-t">
      <div className="wrap">
        <SecTitle id="story-t" eyebrow="Why We Grow" title="Our Story" />

        {/* Vision & Mission: dark-green feature panel with quote cards + numbered beliefs */}
        <div className="vmx" id="vision-mission-home">
          <div className="vmx-head">
            <p className="script">What drives us</p>
            <h3 className="story-sub">Our Vision &amp; Mission</h3>
          </div>
          <div className="vmx-grid">
            <article className="vmx-card">
              <span className="vmx-tag">
                <Icon k="eye" size={18} /> Our Vision
              </span>
              <p className="vmx-quote">{VISION.title}</p>
              <p>{VISION.text}</p>
            </article>
            <article className="vmx-card">
              <span className="vmx-tag">
                <Icon k="target" size={18} /> Our Mission
              </span>
              <p className="vmx-quote">{MISSION.title}</p>
              <p>{MISSION.text}</p>
            </article>
          </div>
          <p className="vmx-lead">We believe in keeping the journey of food simple and transparent:</p>
          <ol className="vmx-pillars">
            {PILLARS.map((p, i) => (
              <li key={p.title}>
                <span className="vmx-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="vmx-ic">
                  <Icon k={p.icon} size={20} />
                </span>
                <b>{p.title}</b>
                <span>{p.text}</span>
              </li>
            ))}
          </ol>
        </div>

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
