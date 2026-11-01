import type { Metadata } from "next";
import { HIGHLIGHTS } from "@/lib/data";
import { ILL } from "@/lib/svg";
import { Cta, PageHero, RawSvg } from "@/components/ui";

export const metadata: Metadata = { title: "Day Highlights" };

export default function HighlightsPage() {
  return (
    <>
      <PageHero title="Day Highlights" sub="A day of fresh food, fun and learning for the whole family." trail={[{ label: "Day Highlights" }]} />
      <section className="sec">
        <div className="wrap hl-page">
          {HIGHLIGHTS.map((h) => (
            <article className="hl-row" id={h.id} key={h.id}>
              <div className="hl-ill">
                <RawSvg html={ILL[h.ill]} />
              </div>
              <div>
                <h2>{h.title}</h2>
                <p>{h.text}</p>
                <Cta label="Plan a farm visit" href="/contact" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
