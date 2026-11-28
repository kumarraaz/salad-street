import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" trail={[{ label: "Not found" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="empty">
            <p>This page doesn&apos;t exist. Check the address or go back to the homepage.</p>
            <Cta label="Go to homepage" href="/" />
          </div>
        </div>
      </section>
    </>
  );
}
