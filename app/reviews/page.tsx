import type { Metadata } from "next";
import { REVIEWS } from "@/lib/data";
import { CtaRow, PageHero } from "@/components/ui";
import { ReviewCard } from "@/components/Rails";

// Not indexed while there are no genuine reviews to show.
export const metadata: Metadata = { title: "Customer Reviews", alternates: { canonical: "/reviews" }, robots: REVIEWS.length ? undefined : { index: false } };

export default function ReviewsPage() {
  return (
    <>
      <PageHero title="Customer Reviews" sub="What our customers say about Salad Street." trail={[{ label: "Reviews" }]} />
      <section className="sec">
        <div className="wrap">
          {REVIEWS.length ? (
            <div className="rv-grid">
              {REVIEWS.map((r) => (
                <ReviewCard key={r.name} {...r} />
              ))}
            </div>
          ) : null}
          <CtaRow label="Share your feedback" href="/contact" />
        </div>
      </section>
    </>
  );
}
