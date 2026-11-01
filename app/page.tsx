import type { Metadata } from "next";
import { BLOGS, FAQS, PRODUCTS } from "@/lib/data";
import { CtaRow, LeafDeco, SecTitle } from "@/components/ui";
import Hero from "@/components/Hero";
import { HighlightCards, BlogCard } from "@/components/Cards";
import { CategoryRail, ReviewCarousel } from "@/components/Rails";
import { ProductGrid } from "@/components/Products";
import Founders from "@/components/Founders";
import WhyBlock from "@/components/WhyBlock";
import { QueryBlock } from "@/components/Enquiry";
import FaqColumns from "@/components/Faq";
import Media from "@/components/Media";

export const metadata: Metadata = { title: "Fresh Salads for a Healthier You" };

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="sec highlights" id="day-highlights" aria-labelledby="hl-t">
        <LeafDeco x="2%" y="10%" s={30} r={-20} />
        <LeafDeco x="94%" y="14%" s={28} r={30} />
        <LeafDeco x="96%" y="62%" s={24} r={60} op={0.8} />
        <div className="wrap">
          <SecTitle id="hl-t" title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family" />
          <HighlightCards />
          <CtaRow label="Explore Highlights" href="/highlights" />
        </div>
      </section>

      <section className="sec" aria-labelledby="cat-t" style={{ paddingBottom: "12px" }}>
        <div className="wrap">
          <SecTitle id="cat-t" title="Shop by Category" sub="Pick a category to see its products" />
          <CategoryRail />
          <CtaRow label="Explore All Categories" href="/categories" />
        </div>
      </section>

      <section className="sec" id="our-products" aria-labelledby="pr-t">
        <div className="wrap">
          <SecTitle id="pr-t" title="Our Products" sub="Explore our fresh and healthy range of products" />
          <ProductGrid list={PRODUCTS.filter((p) => p.home).slice(0, 8)} />
          <CtaRow label="View All Products" href="/products" />
        </div>
      </section>

      <section aria-label="Meet the founders">
        <Founders />
        <div className="founders-cta">
          <CtaRow label="Meet Our Founders" href="/about" />
        </div>
      </section>

      <section className="why-query" aria-label="Why choose us and enquiry">
        <WhyBlock />
        <QueryBlock />
      </section>

      <section className="sec" aria-labelledby="rv-t">
        <div className="wrap">
          <div className="sec-title">
            <h2 id="rv-t">What Our Customers Say</h2>
          </div>
          <ReviewCarousel />
          <CtaRow label="Read All Reviews" href="/reviews" />
        </div>
      </section>

      <section className="sec" aria-labelledby="bl-t" style={{ paddingTop: "12px" }}>
        <div className="wrap">
          <SecTitle id="bl-t" title="Power Blog" sub="Fresh ideas, healthy living and stories from our farm" />
          <div className="bgrid">
            {BLOGS.slice(0, 4).map((b) => (
              <BlogCard key={b.slug} b={b} />
            ))}
          </div>
          <CtaRow label="View All Blogs" href="/blog" />
        </div>
      </section>

      <section className="sec faq" aria-labelledby="faq-t" style={{ paddingTop: "20px" }}>
        <Media src="images/decor/carrot.webp" label="Decor · carrot & leaves" alt="" cls="faq-deco l" />
        <Media src="images/decor/tomatoes.webp" label="Decor · tomatoes & leaves" alt="" cls="faq-deco r" />
        <div className="wrap">
          <div className="faq-in">
            <p className="eyebrow">Frequently asked questions</p>
            <h2 id="faq-t">Everything You Need to Know</h2>
            <FaqColumns list={FAQS.slice(0, 6)} />
            <CtaRow label="View All FAQs" href="/faqs" />
          </div>
        </div>
      </section>
    </>
  );
}
