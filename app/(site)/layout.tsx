import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Floating from "@/components/Floating";
import { CartDrawer, Toast } from "@/components/CartDrawer";
import { SvgSprite } from "@/components/ui";
import Motion from "@/components/Motion";
import MobileBar from "@/components/MobileBar";
import { CONFIG } from "@/lib/data";
import { getProducts } from "@/lib/store";

/* Products are edited in the admin, so the public site reads them on every request. */
export const dynamic = "force-dynamic";

/* Announcement bar. The offer appears only when CONFIG.offerCode and CONFIG.offerTerms are both set. */
function Marquee() {
  const offer = CONFIG.offerCode && CONFIG.offerTerms;
  const msg = (
    <>
      ★{" "}
      {offer ? (
        <>
          {CONFIG.offerTerms} with code <b>{CONFIG.offerCode}</b> &nbsp;|&nbsp;{" "}
        </>
      ) : null}
      Fresh · Healthy · Ready to Eat &nbsp;|&nbsp; Shop Fresh, Eat Better. &nbsp;|&nbsp; Discover Your Favourites ★
    </>
  );
  return (
    <div className="announce" role="region" aria-label={offer ? "Offers" : "Announcements"}>
      <div className="marquee" id="marquee">
        <span>{msg}</span>
        <span aria-hidden="true">{msg}</span>
        <span aria-hidden="true">{msg}</span>
        <span aria-hidden="true">{msg}</span>
      </div>
    </div>
  );
}


export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  return (
    <Providers products={products}>
      <SvgSprite />
      <a className="skip" href="#app" id="skipLink">
        Skip to content
      </a>
      <Marquee />
      <Header />
      <main id="app" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Floating />
      <CartDrawer />
      <Toast />
      <Motion />
      <MobileBar />
      <noscript>
        <p style={{ padding: "24px", textAlign: "center" }}>Please enable JavaScript to use the Salad Street website.</p>
      </noscript>
    </Providers>
  );
}
