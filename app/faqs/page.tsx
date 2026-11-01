import type { Metadata } from "next";
import { FAQS } from "@/lib/data";
import { CtaRow, PageHero } from "@/components/ui";
import FaqColumns from "@/components/Faq";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqsPage() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" sub="Answers to common questions about our products and orders." trail={[{ label: "FAQs" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="faq-in">
            <FaqColumns list={FAQS} />
            <CtaRow label="Still have a question? Contact us" href="/contact" />
          </div>
        </div>
      </section>
    </>
  );
}
