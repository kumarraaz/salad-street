import { bad, guard, json, refreshSite } from "@/lib/api";
import { soonFromBody } from "@/lib/soonInput";
import { newId, writeStore } from "@/lib/store";

/** Add a "Coming Soon" product. */
export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const s = soonFromBody(await req.json().catch(() => ({})));
  if (typeof s === "string") return bad(s);
  const item = await writeStore((st) => {
    const it = { ...s, id: newId("CS") };
    st.soon.push(it);
    return it;
  });
  refreshSite();
  return json({ ok: true, item });
}
