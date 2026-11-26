import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { CONFIG } from "@/lib/data";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Floating from "@/components/Floating";
import { CartDrawer, Toast } from "@/components/CartDrawer";
import { SvgSprite } from "@/components/ui";
import Motion from "@/components/Motion";
import MobileBar from "@/components/MobileBar";

const SITE_TITLE = `Fresh Salad Greens, Herbs & Microgreens${CONFIG.city ? ` in ${CONFIG.city}` : ""} | Salad Street Farms`;

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: SITE_TITLE,
    template: "%s | Salad Street Farms",
  },
  alternates: { canonical: "./" },
  description:
    "Farm fresh ingredients, ready-to-eat salads and healthy products for your everyday wellness. Shop salad greens, herbs and microgreens from Salad Street Farms.",
  openGraph: {
    title: SITE_TITLE,
    description: "Fresh salad greens, herbs and microgreens from Salad Street Farms.",
    type: "website",
    url: "./",
    siteName: "Salad Street Farms",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Fresh salad greens from Salad Street Farms" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "Fresh salad greens, herbs and microgreens from Salad Street Farms.",
    images: ["/images/og.jpg"],
  },
};

/* LocalBusiness structured data: only confirmed fields (no ratings, no invented address). */
const businessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Salad Street Farms",
  url: CONFIG.siteUrl,
  image: `${CONFIG.siteUrl}/images/og.jpg`,
  telephone: CONFIG.phoneTel || undefined,
  email: CONFIG.email || undefined,
  address: CONFIG.address || undefined,
  areaServed: CONFIG.city || undefined,
  sameAs: Object.values(CONFIG.social).filter(Boolean),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#104312",
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Poppins:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd).replace(/</g, "\\u003c") }} />
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
          <Motion />
          <MobileBar />
          <noscript>
            <p style={{ padding: "24px", textAlign: "center" }}>Please enable JavaScript to use the Salad Street website.</p>
          </noscript>
        </Providers>
        {CONFIG.ga4 ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${CONFIG.ga4}");`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
