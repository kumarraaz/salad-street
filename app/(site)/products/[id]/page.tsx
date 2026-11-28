import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, CONFIG, withWeight } from "@/lib/data";
import { getProducts } from "@/lib/store";
import { CtaRow, PageHero, SecTitle } from "@/components/ui";
import Media from "@/components/Media";
import { BuyBox, ProductSlider } from "@/components/Products";
import PackShop from "@/components/PackShop";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = (await getProducts()).find((x) => x.id === id);
  return p
    ? {
        title: withWeight(p),
        description: `${p.name}: ${p.note.toLowerCase()}. Fresh from Salad Street Farms.`,
        alternates: { canonical: `/products/${p.id}` },
        openGraph: { url: `/products/${p.id}`, images: [{ url: "/images/og.jpg", width: 1200, height: 630 }] },
      }
    : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const PRODUCTS = await getProducts();
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) notFound();
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  // Same-category products first, then the rest (only the 7 approved products exist).
  const related = [...PRODUCTS.filter((x) => x.id !== p.id && x.cat === p.cat), ...PRODUCTS.filter((x) => x.id !== p.id && x.cat !== p.cat)];
  return (
    <>
      {/* Structured data: name, price, pack size only (no ratings). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: `${CONFIG.siteUrl}${p.pack || (p.img.startsWith("/") ? p.img : "/" + p.img)}`,
            brand: { "@type": "Brand", name: "Salad Street Farms" },
            ...(p.weight ? { weight: { "@type": "QuantitativeValue", value: parseFloat(p.weight), unitCode: "GRM" } } : {}),
            ...(p.price != null ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "INR", url: `${CONFIG.siteUrl}/products/${p.id}` } } : {}),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        title={p.name}
        sub={p.note}
        trail={[{ label: "Products", href: "/products" }, ...(cat ? [{ label: cat.name, href: `/products?cat=${cat.id}` }] : []), { label: p.name }]}
      />
      <section className="sec">
        <div className="wrap pd">
          <div className="pd-media">
            <Media src={p.img} label={"Product photo · " + p.name} alt={p.name} cls="cutout" />
          </div>
          <div className="pd-info">
            <h2>
              {p.name} {p.hi ? <span lang="hi">({p.hi})</span> : null}
            </h2>
            <p className="pd-weight">{p.note}{p.weight ? ` · Pack size: ${p.weight}` : ""}</p>
            <BuyBox p={p} />
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
      <PackShop cls="bg-s" />
    </>
  );
}
