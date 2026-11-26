"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS } from "@/lib/data";
import { RECIPES, type Recipe } from "@/lib/recipes";
import { Icon, SecTitle } from "./ui";

const names = (ids: string[]) => ids.map((id) => PRODUCTS.find((p) => p.id === id)?.name).filter(Boolean).join(", ");
const tint = (id: string) => PRODUCTS.find((p) => p.id === id)?.tint;

/** Recipe modal: ingredients + steps. Esc, the close button or the backdrop closes it; focus returns to the card. */
function RecipeModal({ r, onClose }: { r: Recipe; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);
  return (
    <div className="rc-scrim" onClick={onClose}>
      <div className="rc-modal" role="dialog" aria-modal="true" aria-labelledby="rc-title" ref={box} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn rc-close" type="button" onClick={onClose} aria-label="Close recipe">
          <Icon k="close" size={22} />
        </button>
        <h3 id="rc-title" className="story-sub">{r.name}</h3>
        <p className="rc-meta">
          <Icon k="clock" size={16} /> {r.time} · Uses: {names(r.uses)}
        </p>
        <h4>Ingredients</h4>
        <ul className="rc-ing">
          {r.ingredients.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h4>Steps</h4>
        <ol className="rc-steps">
          {r.steps.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Recipes({ cls = "" }: { cls?: string }) {
  const [open, setOpen] = useState<Recipe | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section className={`sec recipes ${cls}`} aria-labelledby="rc-t">
      <div className="wrap">
        <SecTitle id="rc-t" title="Fresh Recipes" />
        <div className="rc-grid">
          {RECIPES.map((r) => (
            <article className="pk-card rc-card" key={r.id}>
              <div className="pk-img" style={tint(r.uses[0]) ? ({ "--tint": tint(r.uses[0]) } as React.CSSProperties) : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="rc-photo" src={r.img} alt={`${names(r.uses.slice(0, 1))} from Salad Street Farms`} width={720} height={540} loading="lazy" decoding="async" />
              </div>
              <div className="pk-body">
                <h3 className="pk-name">{r.name}</h3>
                <p className="rc-meta">
                  <Icon k="clock" size={15} /> {r.time}
                </p>
                <p className="rc-uses">Uses: {names(r.uses)}</p>
              </div>
              <button className="btn btn-outline btn-sm rc-open" type="button" onClick={() => setOpen(r)} aria-haspopup="dialog">
                View Recipe <Icon k="arrow" size={16} />
              </button>
            </article>
          ))}
        </div>
      </div>
      {open ? <RecipeModal r={open} onClose={close} /> : null}
    </section>
  );
}
