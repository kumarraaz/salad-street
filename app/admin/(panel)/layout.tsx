import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readStore } from "@/lib/store";
import { Logo, SvgSprite } from "@/components/ui";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

/* Every admin page below this layout requires a valid admin session. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const s = await readStore();
  return (
    <div className="adm-shell">
      <SvgSprite />
      <aside className="adm-side">
        <div className="adm-logo">
          <span className="adm-logo-badge">
            <Logo w={74} h={55} />
          </span>
          <span>
            <b>Salad Street</b>
            <small>Admin panel</small>
          </span>
        </div>
        <AdminNav
          counts={{
            orders: s.orders.filter((o) => o.status === "new").length,
            notify: s.notify.filter((n) => !n.done).length,
            soon: s.soon.length,
          }}
        />
        <LogoutButton />
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
