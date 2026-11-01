import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { PageHero } from "@/components/ui";
import { ProductGrid } from "@/components/Products";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ cat?: string | string[] }> }) {
  const sp = await searchParams;
  const catParam = Array.isArray(sp.cat) ? sp.cat[0] : sp.cat;
  const c = CATEGORIES.find((x) => x.id === (catParam || ""));
  const list = c ? PRODUCTS.filter((p) => p.cat === c.id) : PRODUCTS;
  return (
    <>
      <PageHero
        title={c ? c.name : "All Products"}
        sub="Fresh vegetables, salads and healthy products."
        trail={c ? [{ label: "Products", href: "/products" }, { label: c.name }] : [{ label: "Products" }]}
      />
      <section className="sec">
        <div className="wrap">
          <nav className="chips" aria-label="Filter by category">
            <Link className="chip" href="/products" aria-current={!c}>
              All ({PRODUCTS.length})
            </Link>
            {CATEGORIES.map((x) => (
              <Link className="chip" key={x.id} href={`/products?cat=${x.id}`} aria-current={!!c && c.id === x.id}>
                {x.name} ({PRODUCTS.filter((p) => p.cat === x.id).length})
              </Link>
            ))}
          </nav>
          <ProductGrid list={list} />
        </div>
      </section>
    </>
  );
}
