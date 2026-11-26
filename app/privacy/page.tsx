import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

/* No legal text is invented here: the client will supply the policy. */
export default function Page() {
  return (
    <>
      <PageHero title="Privacy Policy" trail={[{ label: "Privacy Policy" }]} />
      <section className="sec">
        <div className="wrap">
          <p className="policy-note">
            Policy being updated — <Link href="/contact">contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
