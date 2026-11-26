import { NEXT_WEEK } from "@/lib/data";
import { Icon, SecTitle } from "./ui";

/* "Available Next Week": same card style as the products, no Add to Cart.
   Renders nothing while lib/data.ts NEXT_WEEK is empty. */
export default function NextWeek({ cls = "" }: { cls?: string }) {
  if (!NEXT_WEEK.length) return null;
  return (
    <section className={`sec pk-sec ${cls}`} aria-labelledby="nw-t">
      <div className="wrap">
        <SecTitle id="nw-t" eyebrow="Coming Soon" title="Available Next Week" />
        <div className="pk-grid">
          {NEXT_WEEK.map((p) => (
            <article className="pk-card nw-card" key={p.name}>
              <div className="pk-img" style={p.tint ? ({ "--tint": p.tint } as React.CSSProperties) : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="pk-photo" src={p.img} alt={`${p.name}${p.weight ? ` ${p.weight}` : ""}, coming soon from Salad Street Farms`} width={900} height={720} loading="lazy" decoding="async" />
                <span className="pbadge">Coming Soon</span>
              </div>
              <div className="pk-body">
                <h3 className="pk-name">{p.name}</h3>
                {p.weight ? <p className="p100">{p.weight}</p> : null}
              </div>
              <a
                className="btn-wa nw-notify"
                href={`https://wa.me/918826954654?text=${encodeURIComponent(`Notify me when ${p.name} is available`)}`}
                target="_blank"
                rel="noopener"
              >
                <Icon k="wa" size={17} /> Notify me on WhatsApp
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
