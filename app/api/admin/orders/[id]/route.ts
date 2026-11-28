import { bad, guard, json } from "@/lib/api";
import { writeStore, type OrderStatus } from "@/lib/store";

const STATUSES: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];

/** Change an order's status (new → confirmed → delivered, or cancelled). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  if (!STATUSES.includes(b.status)) return bad("Unknown status.");
  const ok = await writeStore((s) => {
    const o = s.orders.find((x) => x.id === id);
    if (o) o.status = b.status;
    return !!o;
  });
  return ok ? json({ ok: true }) : bad("Order not found.", 404);
}
