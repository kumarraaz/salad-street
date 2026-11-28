import { COMING_SOON, NEXT_WEEK, type Product, type SoonItem } from "@/lib/data";
import { Icon, SecTitle } from "./ui";

/* "Available Next Week" and "Coming Soon Products": same card style as the products,
   a small badge and a "Notify me on WhatsApp" button, no Add to Cart. Each section hides when its list is empty. */

function SoonGrid({ id, eyebrow, title, badge, items, cls }: { id: string; eyebrow: string; title: string; badge: string; items: SoonItem[]; cls: string }) {
  if (!items.length) return null;
  return (
    <section className={`sec pk-sec ${cls}`} aria-labelledby={id}>
      <div className="wrap">
        <SecTitle id={id} eyebrow={eyebrow} title={title} />
        <div className="pk-grid">
          {items.map((p) => (
            <article className="pk-card nw-card" key={p.name}>
              <div className="pk-img" style={p.tint ? ({ "--tint": p.tint } as React.CSSProperties) : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="pk-photo" src={p.img} alt={`${p.name}${p.weight ? ` ${p.weight}` : ""} pack from Salad Street Farms`} width={900} height={720} loading="lazy" decoding="async" />
                <span className="pbadge">{badge}</span>
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
                aria-label={`Notify me on WhatsApp when ${p.name} is available`}
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

/** Next-week items come from existing products (ids in NEXT_WEEK). */
export const nextWeekItems = (products: Product[]): SoonItem[] => NEXT_WEEK.map((id) => products.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => !!p)
  .map((p) => ({ name: p.name, weight: p.weight, img: p.pack || p.img, tint: p.tint }));

export default function NextWeek({ cls = "", items }: { cls?: string; items: SoonItem[] }) {
  return <SoonGrid id="nw-t" eyebrow="Fresh Harvest Ahead" title="Available Next Week" badge="Next Week" items={items} cls={cls} />;
}

export function ComingSoon({ cls = "" }: { cls?: string }) {
  // No new products named yet: show the section with a WhatsApp sign-up instead of product cards.
  if (!COMING_SOON.length)
    return (
      <section className={`sec pk-sec ${cls}`} aria-labelledby="cs-t">
        <div className="wrap cs-empty">
          <SecTitle id="cs-t" eyebrow="New on the Farm" title="Coming Soon Products" />
          <p>New farm-fresh products are on their way. Be the first to know when they arrive.</p>
          <a className="btn btn-solid" href={`https://wa.me/918826954654?text=${encodeURIComponent("Notify me about new Salad Street products")}`} target="_blank" rel="noopener">
            <Icon k="wa" size={18} /> Notify me on WhatsApp
          </a>
        </div>
      </section>
    );
  return <SoonGrid id="cs-t" eyebrow="New on the Farm" title="Coming Soon Products" badge="Coming Soon" items={COMING_SOON} cls={cls} />;
}
