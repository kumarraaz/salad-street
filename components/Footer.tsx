import Link from "next/link";
import { CATEGORIES, CONFIG } from "@/lib/data";
import { Logo, Tbc } from "./ui";
import { ContactRows } from "./ContactRows";

function Soc({ k, cls, label, children }: { k: string; cls: string; label: string; children: React.ReactNode }) {
  const href = CONFIG.social[k];
  return href ? (
    <a className={cls} href={href} target="_blank" rel="noopener" aria-label={label}>
      {children}
    </a>
  ) : (
    <a className={cls} href="#" data-missing="social" aria-label={label}>
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer" id="siteFooter">
      <div className="wrap">
        <div className="fcols">
          <div className="fbrand">
            <Link className="foot-logo" href="/" aria-label="Salad Street Farms — home">
              <Logo w={102} h={76} />
            </Link>
            <p>
              Bringing fresh, healthy and delicious salads to your everyday life.{" "}
              <Tbc t="A brand by two sisters, for a healthier tomorrow." on />
            </p>
            <div className="social">
              <Soc k="instagram" cls="ig" label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#fff" />
                </svg>
              </Soc>
              <Soc k="youtube" cls="yt" label="YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#fff" d="M9.5 8.5v7l6-3.5z" />
                </svg>
              </Soc>
              <Soc k="facebook" cls="fb" label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#fff" d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
                </svg>
              </Soc>
              <Soc k="linkedin" cls="li" label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#fff"
                    d="M3 9h4v12H3zM5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 6h4v1.8c.6-1.1 2-2.1 4-2.1 3.1 0 4 2 4 5.3V21h-4v-6c0-1.6-.4-2.7-1.8-2.7-1.6 0-2.2 1.2-2.2 2.8V21h-4z"
                  />
                </svg>
              </Soc>
            </div>
          </div>
          <div className="fcol">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/products">Our Products</Link></li>
              <li><Link href="/blog">Recipes</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="fcol">
            <h3>Our Products</h3>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/products?cat=${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="fcol">
            <h3>Information</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <ContactRows />
            </div>
          </div>
        </div>
        <div className="fbar">
          <span>© {new Date().getFullYear()} Salad Street. All Rights Reserved.</span>
          <span>
            Designed by{" "}
            <a href={CONFIG.designedByUrl} target="_blank" rel="noopener">
              Web Digital Development
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
