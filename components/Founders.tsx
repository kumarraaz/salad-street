"use client";

import Link from "next/link";
import { useState } from "react";
import { FOUNDERS, type Founder } from "@/lib/data";
import { Icon, Tbc } from "./ui";
import Media from "./Media";

function FounderCard({ f, right }: { f: Founder; right: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`founder ${right ? "right" : ""}${open ? " open" : ""}`}
      data-founder
      onClick={(e) => {
        // On touch devices (no hover) tapping the card toggles it, as in the original.
        if (!(e.target as HTMLElement).closest("a,button") && matchMedia("(hover: none)").matches) setOpen((o) => !o);
      }}
    >
      <Media src={f.img} label={"Founder photo · " + f.name + " (garden background)"} alt={"Portrait of " + f.name} cls="dark" />
      <button
        className="f-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={`fm-${f.id}`}
        aria-label={(open ? "Show less about " : "Show more about ") + f.name}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <Icon k="plus" size={20} />
      </button>
      <div className="founder-copy">
        <h3>Meet the Founder</h3>
        <p className="fname">{f.name}</p>
        <p>{f.bio}</p>
        <div className="founder-more" id={`fm-${f.id}`}>
          <div>
            <p>{f.bioFull ? f.bioFull : <Tbc t="Full biography to be supplied by Salad Street." on />}</p>
          </div>
        </div>
        <Link className="know" href="/about">
          Know More <Icon k="arrow" size={18} />
        </Link>
      </div>
    </article>
  );
}

export default function Founders() {
  return (
    <div className="founders">
      {FOUNDERS.map((f, i) => (
        <FounderCard key={f.id} f={f} right={i > 0} />
      ))}
    </div>
  );
}
