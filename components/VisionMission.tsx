import Link from "next/link";
import { Decor, Icon, SecTitle } from "./ui";

/* Text supplied by Salad Street ("VISION MISSION" document). Keep wording precise:
   no absolute claims beyond what the client has written. */

export const VISION = {
  title: "Making Healthy Living a Part of Every Home.",
  text: "At Salad Street Farms, our vision is to create a healthier future by making fresh, clean farm produce by chemical-free growing practices and testing wherever applicable accessible to everyone.",
  more: [
    "In today's fast-paced world, finding fresh and trustworthy food has become increasingly challenging. We believe that eating healthy should not be a luxury; it should be an everyday choice that everyone can afford.",
    "We envision a world where every family has access to fresh, nutritious and responsibly grown food, making healthy eating a simple and natural part of everyday life.",
    "Our dream is to bring more people into the journey of healthy living, one fresh harvest and one healthy meal at a time.",
  ],
};

export const MISSION = {
  title: "From Our Farm to Your Table – Freshness You Can Trust.",
  text: "Our mission is to make fresh, residue-free farm produce, by chemical-free growing practices and testing wherever applicable, available to households at affordable prices without compromising on quality and freshness.",
  more: [
    "Starting with our first hydroponic farm in Greater Noida, Salad Street Farms is on a mission to grow fresh, crisp produce through chemical-free growing practices, testing wherever applicable, and innovative, sustainable farming.",
    "We are also looking forward to expanding our farming practices to include traditional farming alongside hydroponics. This will allow us to bring you a wider range of fresh, nutritious, and responsibly grown produce while staying true to our commitment to quality and healthier living.",
  ],
};

export const PILLARS = [
  { icon: "truck", title: "Farm-to-Home Freshness", text: "Harvesting fresh greens and delivering them directly to your doorstep." },
  { icon: "basket", title: "No Middlemen", text: "Connecting our farm directly with consumers to maintain freshness and offer better value." },
  { icon: "leaf", title: "No Cold Storage", text: "Focusing on fresh harvesting and direct delivery instead of long-term warehouse storage." },
  { icon: "heart", title: "Affordable Healthy Eating", text: "Making premium-quality salad greens accessible at budget-friendly prices." },
  { icon: "drop", title: "Responsible Farming", text: "Using hydroponic growing methods that can significantly reduce water consumption compared with conventional farming." },
  { icon: "users", title: "Building Healthy Communities", text: "Encouraging families, children and individuals to adopt healthier eating habits through everyday nutrition." },
];

export const BELIEFS = [
  "We believe everyone deserves to know where their food comes from and how it is grown.",
  "We believe healthy food should not come with an expensive price tag.",
  "We believe freshness should not be compromised by unnecessary storage and long supply chains.",
  "And most importantly, we believe small everyday food choices can create a big difference in our health and lifestyle.",
];

export const PROMISES = [
  { icon: "sprout", title: "Freshly Harvested", text: "Fresh greens harvested with care for your table." },
  { icon: "truck", title: "Direct Farm-to-Home", text: "No unnecessary middlemen. Freshness delivered directly." },
  { icon: "heart", title: "Healthy at Affordable Prices", text: "Because healthy eating should be for everyone." },
];

export const BRAND_PILLARS = [
  { title: "Trust", text: "Know where your food comes from" },
  { title: "Freshness", text: "Harvested fresh, delivered directly" },
  { title: "Health", text: "Clean and responsibly grown greens" },
  { title: "Affordability", text: "Healthy food for every household" },
  { title: "Sustainability", text: "Smarter farming with responsible water use" },
];

function VmCards({ full = false }: { full?: boolean }) {
  return (
    <div className="vm-cards">
      <article className="vm-card vm-vision">
        <span className="vm-ico" aria-hidden="true">
          <Icon k="eye" size={26} />
        </span>
        <p className="vm-kicker">Our Vision</p>
        <h3>{VISION.title}</h3>
        <p>{VISION.text}</p>
        {full ? VISION.more.map((t) => <p key={t}>{t}</p>) : null}
      </article>
      <article className="vm-card vm-mission">
        <span className="vm-ico" aria-hidden="true">
          <Icon k="target" size={26} />
        </span>
        <p className="vm-kicker">Our Mission</p>
        <h3>{MISSION.title}</h3>
        <p>{MISSION.text}</p>
        {full ? MISSION.more.map((t) => <p key={t}>{t}</p>) : null}
      </article>
    </div>
  );
}

function Pillars() {
  return (
    <>
      <p className="vm-lead">We believe in keeping the journey of food simple and transparent:</p>
      <ul className="vm-pillars">
        {PILLARS.map((p) => (
          <li key={p.title}>
            <span className="vm-pi" aria-hidden="true">
              <Icon k={p.icon} size={22} />
            </span>
            <b>{p.title}</b>
            <span>{p.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Home page: vision + mission + the six mission points. */
export default function VisionMission({ cls = "bg-w" }: { cls?: string }) {
  return (
    <section className={`sec deco-sec vm-sec ${cls}`} id="vision-mission" aria-labelledby="vm-t">
      <Decor k="leaf" cls="corner-tl" />
      <Decor k="carrot" cls="vm-carrot" />
      <div className="wrap">
        <SecTitle id="vm-t" eyebrow="Why We Grow" title="Our Vision & Mission" />
        <VmCards />
        <Pillars />
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

/** About page: the full text, belief, promise and brand pillars. */
export function VisionMissionFull() {
  return (
    <>
      <section className="sec deco-sec vm-sec bg-c" id="vision-mission" aria-labelledby="vmf-t">
        <Decor k="leaf" cls="corner-tr" />
        <div className="wrap">
          <SecTitle id="vmf-t" eyebrow="Why We Grow" title="Our Vision & Mission" />
          <VmCards full />
          <Pillars />
          <p className="vm-lead">Our mission goes beyond growing and selling greens. We want to build a community that understands the importance of clean food and chooses a healthier lifestyle.</p>
        </div>
      </section>
      <section className="sec vm-sec bg-w" aria-labelledby="vmb-t">
        <div className="wrap vm-belief">
          <div>
            <SecTitle id="vmb-t" eyebrow="Our Belief" title="Why Salad Street Farms Exists" />
            <ul className="vm-beliefs">
              {BELIEFS.map((b) => (
                <li key={b}>
                  <Icon k="check" size={18} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="vm-tag">At Salad Street Farms, we are not just growing greens; we are growing a healthier tomorrow.</p>
          </div>
          <div className="vm-promise">
            <h3>Our Promise to You</h3>
            {PROMISES.map((p) => (
              <div className="vm-pr" key={p.title}>
                <span className="vm-pi" aria-hidden="true">
                  <Icon k={p.icon} size={22} />
                </span>
                <span>
                  <b>{p.title}</b>
                  <small>{p.text}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec vm-sec bg-s" aria-labelledby="vmp-t">
        <div className="wrap">
          <SecTitle id="vmp-t" eyebrow="What We Stand For" title="Our Brand Pillars" />
          <ul className="vm-brand">
            {BRAND_PILLARS.map((b) => (
              <li key={b.title}>
                <b>{b.title}</b>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
