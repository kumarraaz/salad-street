/* SERVER-ONLY helpers for API route handlers. */
import { revalidatePath } from "next/cache";
import { COOKIE, sameOrigin, validToken } from "./auth";

export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export const bad = (error: string, status = 400) => json({ error }, status);

/** Admin-only, same-origin. Returns an error Response, or null when allowed. */
export function guard(req: Request): Response | null {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  const cookie = req.headers.get("cookie") || "";
  const tok = cookie
    .split(/;\s*/)
    .find((c) => c.startsWith(COOKIE + "="))
    ?.slice(COOKIE.length + 1);
  return validToken(tok ? decodeURIComponent(tok) : undefined) ? null : bad("Please log in again", 401);
}

/** Text field: trimmed, length-capped string. */
export const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const phoneOk = (v: string) => /^[0-9+ ]{10,15}$/.test(v);

/** Public pages read products on every request; also drop any cached render. */
export const refreshSite = () => revalidatePath("/", "layout");
