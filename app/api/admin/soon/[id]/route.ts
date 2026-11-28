import { bad, guard, json, refreshSite } from "@/lib/api";
import { soonFromBody } from "@/lib/soonInput";
import { writeStore } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  const s = soonFromBody(await req.json().catch(() => ({})));
  if (typeof s === "string") return bad(s);
  const ok = await writeStore((st) => {
    const i = st.soon.findIndex((x) => x.id === id);
    if (i >= 0) st.soon[i] = { ...s, id };
    return i >= 0;
  });
  if (!ok) return bad("Not found.", 404);
  refreshSite();
  return json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  await writeStore((st) => {
    st.soon = st.soon.filter((x) => x.id !== id);
  });
  refreshSite();
  return json({ ok: true });
}
