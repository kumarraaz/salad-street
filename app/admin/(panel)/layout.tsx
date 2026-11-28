import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readStore } from "@/lib/store";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

/* Every admin page below this layout requires a valid admin session. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const s = await readStore();
  const newOrders = s.orders.filter((o) => o.status === "new").length;
  const openNotify = s.notify.filter((n) => !n.done).length;
  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <p className="adm-brand">Salad Street · Admin</p>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">
            Orders {newOrders ? <span className="adm-pill">{newOrders}</span> : null}
          </Link>
          <Link href="/admin/notify">
            Notify requests {openNotify ? <span className="adm-pill">{openNotify}</span> : null}
          </Link>
          <a href="/" target="_blank" rel="noopener">
            View website ↗
          </a>
        </nav>
        <LogoutButton />
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
