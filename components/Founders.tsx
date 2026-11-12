"use client";

import Link from "next/link";
import { useState } from "react";
import { FOUNDERS, type Founder } from "@/lib/data";
import { Decor, Icon, Tbc } from "./ui";
import Media from "./Media";

function FounderCard({ f }: { f: Founder }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`founder-card${open ? " open" : ""}`}>
      {/* Founder photo: client to upload images/founders/<id>.webp (placeholder shows until then). */}
      <Media src={f.img} label={"Founder photo · " + f.name} alt={"Portrait of " + f.name} cls="founder-photo" />
      <div className="founder-body">
        <p className="script">Meet the Founder</p>
        <h3>{f.name}</h3>
        <p>{f.bio}</p>
        <div className="founder-more" id={`fm-${f.id}`}>
          <div>
            <p>{f.bioFull ? f.bioFull : <Tbc t="Full biography to be supplied by Salad Street." on />}</p>
          </div>
        </div>
        <p className="sign" aria-hidden="true">
          {f.name}
        </p>
        <small className="role">Founder, Salad Street</small>
        <div className="founder-actions">
          <button className="link-arrow" type="button" aria-expanded={open} aria-controls={`fm-${f.id}`} onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : "Read more"} <Icon k={open ? "chevD" : "arrow"} size={16} />
          </button>
          <Link className="link-arrow" href="/about">
            Our story <Icon k="arrow" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Founders({ cls = "" }: { cls?: string }) {
  return (
    <section className={`sec founders-sec ${cls}`} aria-labelledby="fd-t">
      <Decor k="leaf" cls="fd-leaf" />
      <div className="wrap">
        <div className="sec-title">
          <p className="eyebrow-s">The people behind our food</p>
          <h2 id="fd-t">Meet the Founders</h2>
        </div>
        <div className="founder-grid">
          {FOUNDERS.map((f) => (
            <FounderCard key={f.id} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
