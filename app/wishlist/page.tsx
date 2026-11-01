import type { Metadata } from "next";
import { Cta, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <PageHero title="Wishlist" trail={[{ label: "Wishlist" }]} />
      <section className="sec">
        <div className="wrap">
          <div className="empty">
            <p>Saving favourites isn&apos;t available yet. Add products to your cart to keep them for this visit.</p>
            <Cta label="Browse products" href="/products" />
          </div>
        </div>
      </section>
    </>
  );
}
