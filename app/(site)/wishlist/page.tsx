import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <PageHero title="Wishlist" trail={[{ label: "Wishlist" }]} />
      <section className="sec">
        <div className="wrap">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
