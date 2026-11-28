import { bad, guard, json } from "@/lib/api";
import { writeStore } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

/** Mark a notify request as done (customer informed) or reopen it. */
export async function PATCH(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const ok = await writeStore((s) => {
    const n = s.notify.find((x) => x.id === id);
    if (n) n.done = !!b.done;
    return !!n;
  });
  return ok ? json({ ok: true }) : bad("Request not found.", 404);
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { id } = await params;
  await writeStore((s) => {
    s.notify = s.notify.filter((x) => x.id !== id);
  });
  return json({ ok: true });
}
