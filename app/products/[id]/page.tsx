import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, PRODUCTS, inr } from "@/lib/data";
import { CtaRow, PageHero, SecTitle, Tbc } from "@/components/ui";
import Media from "@/components/Media";
import { BuyBox, ProductSlider } from "@/components/Products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCTS.find((x) => x.id === id);
  return p ? { title: `${p.name} (${p.weight})`, description: `${p.name} (${p.hi}), ${p.weight} for ${inr(p.price)} from Salad Street Farms.` } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) notFound();
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  const related = PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat);
  return (
    <>
      <PageHero
        title={p.name}
        sub={p.hi}
        trail={[{ label: "Products", href: "/products" }, ...(cat ? [{ label: cat.name, href: `/products?cat=${cat.id}` }] : []), { label: p.name }]}
      />
      <section className="sec">
        <div className="wrap pd">
          <div className="pd-media">
            <Media src={p.img} label={"Product photo · " + p.name} alt={`${p.name}, ${p.weight}`} />
          </div>
          <div className="pd-info">
            <h2>
              {p.name} <span lang="hi">({p.hi})</span>
            </h2>
            <p className="pd-weight">Pack size: {p.weight}</p>
            <BuyBox p={p} />
            <p className="pd-note">
              <Tbc t="Product description, storage tips and shelf life to be supplied by Salad Street." on />
            </p>
          </div>
        </div>
      </section>
      {related.length ? (
        <section className="sec bg-c" aria-labelledby="rel-t">
          <div className="wrap">
            <SecTitle id="rel-t" title="You May Also Like" />
            <ProductSlider list={related} label="Related products" />
            <CtaRow label="View All Products" href="/products" />
          </div>
        </section>
      ) : null}
    </>
  );
}
