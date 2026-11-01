import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, productsInCategory } from "@/lib/data";
import { CtaRow, PageHero } from "@/components/ui";
import Media from "@/components/Media";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <>
      <PageHero title="All Categories" sub="Choose a category to browse its products." trail={[{ label: "Categories" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="pgrid">
            {CATEGORIES.map((c) => {
              const n = productsInCategory(c.id);
              return (
                <Link className="cat" key={c.id} href={`/products?cat=${c.id}`}>
                  <Media src={c.img} label={c.name} alt={c.name} />
                  <b>{c.name}</b>
                  <small>{n ? `${n} ${n === 1 ? "product" : "products"}` : "Coming soon"}</small>
                </Link>
              );
            })}
          </div>
          <CtaRow label="View All Products" href="/products" />
        </div>
      </section>
    </>
  );
}
