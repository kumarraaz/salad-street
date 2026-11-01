"use client";

import { useRef, useState } from "react";
import { WHY } from "@/lib/data";
import { Cta, Icon, Tbc } from "./ui";
import Media from "./Media";

export default function WhyBlock({ extraCls = "" }: { extraCls?: string }) {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, k: number) => {
    const map: Record<string, number> = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: WHY.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      const n = (map[e.key] + WHY.length) % WHY.length;
      tabs.current[n]?.focus();
      setSel(n);
    }
  };

  return (
    <div className={`why ${extraCls}`} id="why-choose-us">
      <h2>Why Choose Salad Street?</h2>
      <div className="tabs" role="tablist" aria-label="Why choose Salad Street">
        {WHY.map((w, i) => (
          <button
            key={w.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className="tab"
            role="tab"
            type="button"
            id={`tab-${w.id}`}
            aria-controls={`panel-${w.id}`}
            aria-selected={i === sel}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <Icon k={w.icon} size={18} />
            {w.tab}
          </button>
        ))}
      </div>
      <div className="panels">
        {WHY.map((w, i) => (
          <div key={w.id} className={`panel ${i === sel ? "active" : ""}`} role="tabpanel" id={`panel-${w.id}`} aria-labelledby={`tab-${w.id}`}>
            <Media src={w.img} label={"Feature image · " + w.title} alt={w.title} />
            <div>
              <h3>{w.title}</h3>
              <p>
                <Tbc t={w.text} on={w.tbc} />
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="cta-left">
        <Cta label="Discover Our Story" href="/about#why-choose-us" />
      </div>
    </div>
  );
}
