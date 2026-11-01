"use client";

import { useState } from "react";
import type { Faq as FaqT } from "@/lib/data";
import { Tbc } from "./ui";

function FaqItem({ f, i }: { f: FaqT; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`acc${open ? " open" : ""}`}>
      <button className="acc-btn" type="button" aria-expanded={open} aria-controls={`faq-${i}`} id={`faq-b-${i}`} onClick={() => setOpen((o) => !o)}>
        {f.q}
        <span className="pm" aria-hidden="true" />
      </button>
      <div className="acc-panel" id={`faq-${i}`} role="region" aria-labelledby={`faq-b-${i}`}>
        <div>
          <p>
            <Tbc t={f.a} on={f.tbc} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqColumns({ list }: { list: FaqT[] }) {
  const h = Math.ceil(list.length / 2);
  return (
    <div className="faq-cols">
      <div className="faq-col">
        {list.slice(0, h).map((f, i) => (
          <FaqItem key={i} f={f} i={i} />
        ))}
      </div>
      <div className="faq-col">
        {list.slice(h).map((f, i) => (
          <FaqItem key={i + h} f={f} i={i + h} />
        ))}
      </div>
    </div>
  );
}
