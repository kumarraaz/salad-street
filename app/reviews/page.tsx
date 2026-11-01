import type { Metadata } from "next";
import { REVIEWS } from "@/lib/data";
import { CtaRow, PageHero } from "@/components/ui";
import { ReviewCard } from "@/components/Rails";

export const metadata: Metadata = { title: "Customer Reviews" };

export default function ReviewsPage() {
  return (
    <>
      <PageHero title="Customer Reviews" sub="What our customers say about Salad Street." trail={[{ label: "Reviews" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="rv-grid">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>
          <CtaRow label="Share your feedback" href="/contact" />
        </div>
      </section>
    </>
  );
}
