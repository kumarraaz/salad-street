import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { CONFIG, FAQS, PRODUCTS, REVIEWS } from "@/lib/data";
import { CtaRow, SecTitle } from "@/components/ui";
import Hero from "@/components/Hero";
import { HighlightCards } from "@/components/Cards";
import { ReviewCarousel } from "@/components/Rails";
import Founders from "@/components/Founders";
import { QueryBlock } from "@/components/Enquiry";
import FaqColumns from "@/components/Faq";
import { FarmStory, FeatureStrip, WhySection } from "@/components/Sections";
import { Newsletter } from "@/components/SectionsClient";
import PackShop from "@/components/PackShop";
import OurStory from "@/components/OurStory";
import NextWeek, { ComingSoon, nextWeekItems } from "@/components/NextWeek";
import Recipes from "@/components/Recipes";

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

/* Plain full-width backgrounds, alternating white and cream. */
const TONES = ["w", "c"] as const;

export default function HomePage() {
  /* Sections in order. Hidden ones (no data) are dropped first, so white and cream always alternate. */
  const blocks: ((cls: string) => ReactNode)[] = [
    (c) => <FeatureStrip cls={c} />,
    (c) => <PackShop cls={c} id="our-products" />,
    ...(nextWeekItems.length ? [(c: string) => <NextWeek cls={c} />] : []),
    (c) => <ComingSoon cls={c} />,
    (c) => <FarmStory cls={c} />,
    (c) => <OurStory cls={c} />,
    (c) => (
      <section className={`sec highlights ${c}`} id="day-highlights" aria-labelledby="hl-t">
        <div className="wrap">
          <SecTitle id="hl-t" eyebrow="Visit Our Farm" title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family" />
          <HighlightCards />
          <CtaRow label="Explore Highlights" href="/highlights" />
        </div>
      </section>
    ),
    (c) => <WhySection cls={c} />,
    (c) => <Founders cls={c} />,
    // Shown only once genuine reviews exist in lib/data.ts
    ...(REVIEWS.length
      ? [
          (c: string) => (
            <section className={`sec reviews ${c}`} aria-labelledby="rv-t">
              <div className="wrap">
                <SecTitle id="rv-t" title="Loved by Health-Conscious Customers" />
                <ReviewCarousel />
              </div>
            </section>
          ),
        ]
      : []),
    (c) => <Recipes cls={c} more />,
    (c) => (
      <section className={`sec faq ${c}`} aria-labelledby="faq-t">
        <div className="wrap">
          <div className="faq-in">
            <SecTitle id="faq-t" title="Frequently Asked Questions" />
            <FaqColumns list={FAQS.slice(0, 6)} single />
            <CtaRow label="View All FAQs" href="/faqs" />
          </div>
        </div>
      </section>
    ),
    (c) => (
      <section className={`sec enquire-sec ${c}`} aria-label="Enquiry">
        <div className="wrap">
          <QueryBlock />
        </div>
      </section>
    ),
    (c) => <Newsletter cls={c} />,
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, "\\u003c") }} />
      <Hero />
      {blocks.map((b, i) => (
        <Fragment key={i}>{b(`bg-${TONES[i % 2]}`)}</Fragment>
      ))}
    </>
  );
}
