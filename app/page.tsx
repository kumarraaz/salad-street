import type { Metadata } from "next";
import { BLOGS, FAQS, PRODUCTS } from "@/lib/data";
import { CtaRow, Decor, SecTitle } from "@/components/ui";
import Hero from "@/components/Hero";
import { HighlightCards, BlogCard } from "@/components/Cards";
import { CategoryRail, ReviewCarousel } from "@/components/Rails";
import { ProductGrid } from "@/components/Products";
import Founders from "@/components/Founders";
import { QueryBlock } from "@/components/Enquiry";
import FaqColumns from "@/components/Faq";
import { FarmStory, FeatureStrip, KitsBanner, WhySection } from "@/components/Sections";
import { Newsletter } from "@/components/SectionsClient";

export const metadata: Metadata = { title: "Fresh Salads for a Healthier You" };

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureStrip />

      <section className="sec deco-sec" aria-labelledby="cat-t">
        <Decor k="carrot" cls="cat-carrot" />
        <Decor k="leaf" cls="corner-tr" />
        <div className="wrap">
          <SecTitle id="cat-t" eyebrow="Explore Our Range" title="Shop by Category" />
          <CategoryRail />
        </div>
      </section>

      <section className="sec deco-sec tint" id="our-products" aria-labelledby="pr-t">
        <Decor k="leaf" cls="corner-tl" />
        <Decor k="tomato" cls="pr-tomato" />
        <div className="wrap">
          <SecTitle id="pr-t" eyebrow="Our Bestsellers" title="Fresh Picks for a Healthy Lifestyle" />
          <ProductGrid list={PRODUCTS.filter((p) => p.home).slice(0, 8)} />
          <CtaRow label="View All Products" href="/products" />
        </div>
      </section>

      <KitsBanner />
      <FarmStory />

      <section className="sec highlights" id="day-highlights" aria-labelledby="hl-t">
        <Decor k="leaf" cls="corner-tl" />
        <div className="wrap">
          <SecTitle id="hl-t" eyebrow="Visit Our Farm" title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family" />
          <HighlightCards />
          <CtaRow label="Explore Highlights" href="/highlights" />
        </div>
      </section>

      <WhySection />
      <Founders />

      <section className="sec reviews" aria-labelledby="rv-t">
        <div className="wrap">
          <SecTitle id="rv-t" title="Loved by Health-Conscious Customers" />
          <ReviewCarousel />
        </div>
      </section>

      <section className="sec" aria-labelledby="bl-t">
        <div className="wrap">
          <SecTitle id="bl-t" title="From Our Blog" sub="Fresh ideas, healthy living and stories from our farm" />
          <div className="bgrid">
            {BLOGS.slice(0, 3).map((b) => (
              <BlogCard key={b.slug} b={b} />
            ))}
          </div>
          <CtaRow label="View All Blogs" href="/blog" />
        </div>
      </section>

      <section className="sec faq deco-sec" aria-labelledby="faq-t">
        <Decor k="carrot" cls="faq-deco l" />
        <Decor k="tomato" cls="faq-deco r" />
        <div className="wrap">
          <div className="faq-in">
            <SecTitle id="faq-t" title="Frequently Asked Questions" />
            <FaqColumns list={FAQS.slice(0, 6)} single />
            <CtaRow label="View All FAQs" href="/faqs" />
          </div>
        </div>
      </section>

      <section className="sec enquire-sec" aria-label="Enquiry">
        <div className="wrap">
          <QueryBlock />
        </div>
      </section>

      <Newsletter />
    </>
  );
}
