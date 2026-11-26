import type { Metadata } from "next";
import { BLOGS, CONFIG, FAQS, PRODUCTS, REVIEWS } from "@/lib/data";
import { CtaRow, Decor, SecTitle, Wave } from "@/components/ui";
import Hero from "@/components/Hero";
import { HighlightCards, BlogCard } from "@/components/Cards";
import { ReviewCarousel } from "@/components/Rails";
import Founders from "@/components/Founders";
import { QueryBlock } from "@/components/Enquiry";
import FaqColumns from "@/components/Faq";
import { FeatureStrip, WhySection } from "@/components/Sections";
import { Newsletter } from "@/components/SectionsClient";
import PackShop from "@/components/PackShop";
import OurStory from "@/components/OurStory";

export const metadata: Metadata = {
  title: { absolute: `Fresh Salad Greens, Herbs & Microgreens${CONFIG.city ? ` in ${CONFIG.city}` : ""} | Salad Street Farms` },
  alternates: { canonical: "/" },
};

/* Structured data for the product list: name, price, pack size only (no ratings). */
const productLd = {
  "@context": "https://schema.org",
  "@graph": PRODUCTS.map((p) => ({
    "@type": "Product",
    name: p.name,
    url: `${CONFIG.siteUrl}/products/${p.id}`,
    brand: { "@type": "Brand", name: "Salad Street Farms" },
    ...(p.weight ? { weight: { "@type": "QuantitativeValue", value: parseFloat(p.weight), unitCode: "GRM" } } : {}),
    ...(p.price != null ? { offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" } } : {}),
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, "\\u003c") }} />
      <Hero />
      {/* Alternating section tones: white → cream #FBF6EC → sage #F1F8EA, joined by wavy dividers */}
      <FeatureStrip cls="bg-w" />
      <Wave from="w" to="c" />
      <PackShop cls="bg-c" id="our-products" />
      <Wave from="c" to="s" />
      <OurStory cls="bg-s" />
      <Wave from="s" to="w" />

      <section className="sec highlights bg-w" id="day-highlights" aria-labelledby="hl-t">
        <Decor k="leaf" cls="corner-tl" />
        <div className="wrap">
          <SecTitle id="hl-t" eyebrow="Visit Our Farm" title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family" />
          <HighlightCards />
          <CtaRow label="Explore Highlights" href="/highlights" />
        </div>
      </section>

      <Wave from="w" to="c" />
      <WhySection cls="bg-c" />
      <Wave from="c" to="s" />
      <Founders cls="bg-s" />
      <Wave from="s" to="w" />

      {/* Shown only once genuine reviews exist in lib/data.ts */}
      {REVIEWS.length ? (
        <section className="sec reviews bg-w" aria-labelledby="rv-t">
          <div className="wrap">
            <SecTitle id="rv-t" title="Loved by Health-Conscious Customers" />
            <ReviewCarousel />
          </div>
        </section>
      ) : null}

      <section className="sec bg-w" aria-labelledby="bl-t">
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

      <Wave from="w" to="c" />
      <section className="sec faq deco-sec bg-c" aria-labelledby="faq-t">
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

      <Wave from="c" to="s" />
      <section className="sec enquire-sec bg-s" aria-label="Enquiry">
        <div className="wrap">
          <QueryBlock />
        </div>
      </section>

      <Wave from="s" to="w" />
      <Newsletter cls="bg-w" />
    </>
  );
}
