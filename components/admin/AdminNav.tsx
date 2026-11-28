"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/products", label: "Products", icon: "basket" },
  { href: "/admin/coming-soon", label: "Coming Soon", icon: "sprout", count: "soon" },
  { href: "/admin/orders", label: "Orders", icon: "cart", count: "orders" },
  { href: "/admin/notify", label: "Notify requests", icon: "bell", count: "notify" },
] as const;

export default function AdminNav({ counts }: { counts: { orders: number; notify: number; soon: number } }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin">
      {ITEMS.map((it) => {
        const on = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
        const n = "count" in it ? counts[it.count] : 0;
        return (
          <Link key={it.href} href={it.href} aria-current={on ? "page" : undefined}>
            <Icon k={it.icon} size={19} />
            <span>{it.label}</span>
            {n && it.href !== "/admin/coming-soon" ? <span className="adm-pill">{n}</span> : null}
          </Link>
        );
      })}
      <a href="/" target="_blank" rel="noopener">
        <Icon k="external" size={19} />
        <span>View website</span>
      </a>
    </nav>
  );
}
