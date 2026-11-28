import type { Metadata } from "next";
import { CtaRow, PageHero } from "@/components/ui";
import Founders from "@/components/Founders";
import WhyBlock from "@/components/WhyBlock";
import { FarmStory } from "@/components/Sections";
import { VisionMissionFull } from "@/components/VisionMission";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Salad Street" sub="The people and the promise behind our food." trail={[{ label: "About Us" }]} art="bowlV" />
      <FarmStory />
      <VisionMissionFull />
      <Founders />
      <section style={{ marginTop: 0 }}>
        <WhyBlock extraCls="why-standalone" />
      </section>
      <section className="sec">
        <div className="wrap">
          <CtaRow label="Shop Now" href="/products" />
        </div>
      </section>
    </>
  );
}
