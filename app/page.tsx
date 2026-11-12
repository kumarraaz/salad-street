import type { Metadata } from "next";
import { BLOGS, FAQS, PRODUCTS } from "@/lib/data";
import { CtaRow, Decor, SecTitle } from "@/components/ui";
import Hero from "@/components/Hero";
import { HighlightCards, BlogCard } from "@/components/Cards";
import { ReviewCarousel } from "@/components/Rails";
import Founders from "@/components/Founders";
import { QueryBlock } from "@/components/Enquiry";
import FaqColumns from "@/components/Faq";
import { FarmStory, FeatureStrip, KitsBanner, WhySection } from "@/components/Sections";
import { Newsletter } from "@/components/SectionsClient";
import { UpcomingHarvest } from "@/components/Leafy";
import { ProductSlider } from "@/components/Products";

export const metadata: Metadata = { title: "Fresh Salads for a Healthier You" };

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Alternating section tones: bg-w (white) · bg-c (warm cream #F7F5EA) · bg-s (light sage #EDF3E8) */}
      <FeatureStrip cls="bg-w" />
      <UpcomingHarvest cls="bg-c" />

      <section className="sec deco-sec bg-w" id="our-products" aria-labelledby="pr-t">
        <Decor k="leaf" cls="corner-tl" />
        <Decor k="tomato" cls="pr-tomato" />
        <div className="wrap">
          <SecTitle id="pr-t" eyebrow="Shop Fresh" title="Fresh Picks from Our Farm" />
          <ProductSlider list={PRODUCTS.filter((p) => p.home)} label="Products" />
          <CtaRow label="View All Products" href="/products" />
        </div>
      </section>

      <KitsBanner cls="bg-s" />
      <FarmStory cls="bg-w" />

      <section className="sec highlights bg-c" id="day-highlights" aria-labelledby="hl-t">
        <Decor k="leaf" cls="corner-tl" />
        <div className="wrap">
          <SecTitle id="hl-t" eyebrow="Visit Our Farm" title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family" />
          <HighlightCards />
          <CtaRow label="Explore Highlights" href="/highlights" />
        </div>
      </section>

      <WhySection cls="bg-w" />
      <Founders cls="bg-s" />

      <section className="sec reviews bg-w" aria-labelledby="rv-t">
        <div className="wrap">
          <SecTitle id="rv-t" title="Loved by Health-Conscious Customers" />
          <ReviewCarousel />
        </div>
      </section>

      <section className="sec bg-c" aria-labelledby="bl-t">
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

      <section className="sec faq deco-sec bg-w" aria-labelledby="faq-t">
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

      <section className="sec enquire-sec bg-s" aria-label="Enquiry">
        <div className="wrap">
          <QueryBlock />
        </div>
      </section>

      <Newsletter cls="bg-w" />
    </>
  );
}
