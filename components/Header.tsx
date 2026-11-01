"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { CATEGORIES, NAV } from "@/lib/data";
import { Icon, Logo } from "./ui";
import { useApp } from "./Providers";

export default function Header() {
  const pathname = usePathname() || "/";
  const { count, openCart } = useApp();
  const [ddOpen, setDdOpen] = useState(false);
  const [mOpen, setMOpen] = useState(false);

  const closeMenus = () => {
    setDdOpen(false);
    setMOpen(false);
  };

  // Close menus on route change, Escape, or a click outside the dropdown.
  useEffect(() => {
    closeMenus();
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenus();
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-dd]")) setDdOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const isOn = (n: string, recipes = false) =>
    n === "/" ? pathname === "/" : (pathname === n || pathname.startsWith(n + "/")) && !recipes;
  const cur = (n: string, recipes = false) => (isOn(n, recipes) ? ("page" as const) : undefined);

  return (
    <header className="site-header" id="siteHeader" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) closeMenus(); }}>
      <div className="wrap hdr">
        <Link className="brand" href="/" aria-label="Salad Street Farms — home">
          <Logo w={86} h={64} />
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) =>
            n.dd ? (
              <div key={n.label} className={`dd${ddOpen ? " open" : ""}${isOn("/products") ? " active" : ""}`} data-dd data-nav="/products">
                <button
                  type="button"
                  aria-expanded={ddOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setMOpen(false);
                    setDdOpen((o) => !o);
                  }}
                >
                  {n.label}
                  <Icon k="chevD" size={16} />
                </button>
                <div className="dd-menu">
                  <Link href="/products">All Products</Link>
                  {CATEGORIES.map((c) => (
                    <Link key={c.id} href={`/products?cat=${c.id}`}>
                      {c.name}
                    </Link>
                  ))}
                  <Link href="/categories">All Categories</Link>
                </div>
              </div>
            ) : (
              <Link
                key={n.label}
                href={n.href}
                data-nav={n.href}
                {...(n.label === "Recipes" ? { "data-recipes": "" } : {})}
                aria-current={cur(n.href, n.label === "Recipes")}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <div className="actions">
          <label className="lang hide-m">
            <Icon k="globe" size={18} />
            <span className="sr">Language</span>
            <select aria-label="Language" defaultValue="en">
              <option value="en">English</option>
              <option value="hi" disabled>
                हिन्दी (coming soon)
              </option>
            </select>
          </label>
          <Link className="icon-btn hide-m" href="/account" aria-label="My account">
            <Icon k="user" size={22} />
          </Link>
          <Link className="icon-btn hide-m" href="/wishlist" aria-label="Wishlist">
            <Icon k="heart" size={22} />
          </Link>
          <button className="icon-btn" type="button" data-open-cart onClick={openCart} aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <Icon k="cart" size={24} />
            <span className="badge" data-cart-count>
              {count}
            </span>
          </button>
          <Link className="btn btn-solid btn-sm hide-m" href="/contact" style={{ borderRadius: "4px" }}>
            Enquire Now
          </Link>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-expanded={mOpen}
            aria-controls="mPanel"
            aria-label={mOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setDdOpen(false);
              setMOpen((o) => !o);
            }}
          >
            <Icon k={mOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>
      <div className="mobile-panel" id="mPanel" hidden={!mOpen}>
        {NAV.filter((n) => n.label !== "Recipes").map((n) => (
          <Fragment key={n.label}>
            <Link className="m-link" href={n.href} data-nav={n.href} aria-current={cur(n.href)}>
              {n.label}
            </Link>
            {n.dd ? (
              <div className="m-sub">
                {CATEGORIES.map((c) => (
                  <Link key={c.id} className="m-link" href={`/products?cat=${c.id}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </Fragment>
        ))}
        <Link className="m-link" href="/blog">
          Recipes
        </Link>
        <div className="m-row">
          <Link className="btn btn-outline btn-sm" href="/account">
            <Icon k="user" size={18} />
            Account
          </Link>
          <Link className="btn btn-outline btn-sm" href="/wishlist">
            <Icon k="heart" size={18} />
            Wishlist
          </Link>
          <label className="lang">
            <Icon k="globe" size={18} />
            <select aria-label="Language" defaultValue="English">
              <option>English</option>
              <option disabled>हिन्दी (coming soon)</option>
            </select>
          </label>
        </div>
        <div className="m-row">
          <Link className="btn btn-solid" href="/contact" style={{ width: "100%" }}>
            Enquire Now
          </Link>
        </div>
      </div>
    </header>
  );
}
