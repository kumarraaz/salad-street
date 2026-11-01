import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "My Account" };

export default function AccountPage() {
  return (
    <>
      <PageHero title="My Account" trail={[{ label: "My Account" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="empty">
            <p>Customer accounts aren&apos;t available yet. You can add products to your cart and place your order without an account.</p>
            <Cta label="Browse products" href="/products" />
          </div>
        </div>
      </section>
    </>
  );
}
