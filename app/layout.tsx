import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Floating from "@/components/Floating";
import { CartDrawer, Toast } from "@/components/CartDrawer";
import { SvgSprite } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    default: "Salad Street Farms | Fresh Salads for a Healthier You",
    template: "%s | Salad Street Farms",
  },
  description:
    "Farm fresh ingredients, ready-to-eat salads and healthy products for your everyday wellness. Shop vegetables, salads and more from Salad Street Farms.",
  openGraph: {
    title: "Salad Street Farms",
    description: "Fresh salads, farm vegetables and family days at the farm.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#104312",
};

function Marquee() {
  const msg = (
    <>
      ★ Get <b>10% OFF</b> on your first order &nbsp;|&nbsp; Fresh · Healthy · Ready to Eat &nbsp;|&nbsp; Shop Fresh, Eat Better. &nbsp;|&nbsp;
      Discover Your Favourites ★
    </>
  );
  return (
    <div className="announce" role="region" aria-label="Offers">
      <div className="marquee" id="marquee">
        <span>{msg}</span>
        <span aria-hidden="true">{msg}</span>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Caveat:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
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
          <noscript>
            <p style={{ padding: "24px", textAlign: "center" }}>Please enable JavaScript to use the Salad Street website.</p>
          </noscript>
        </Providers>
      </body>
    </html>
  );
}
