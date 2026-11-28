/* SERVER-ONLY admin auth. Credentials come from environment variables set in Coolify (never from code):
     ADMIN_USER      (default "admin")
     ADMIN_PASSWORD  (required; admin login is disabled while it is empty)
     SESSION_SECRET  (optional; otherwise derived from ADMIN_PASSWORD, so changing the password logs everyone out)
   The session is a signed, HttpOnly cookie. */
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "ss_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const user = () => process.env.ADMIN_USER || "admin";
const pass = () => process.env.ADMIN_PASSWORD || "";
const secret = () => process.env.SESSION_SECRET || crypto.createHash("sha256").update(`ss-admin:${pass()}`).digest("hex");

export const adminEnabled = () => pass().length > 0;

const sign = (v: string) => crypto.createHmac("sha256", secret()).update(v).digest("base64url");
const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export function checkLogin(u: string, p: string) {
  if (!adminEnabled()) return false;
  // Compare hashes so length differences don't leak through timing.
  const h = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
  return safeEq(h(u), h(user())) && safeEq(h(p), h(pass()));
}

export function makeToken() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${exp}.${sign(exp)}`;
}

export function validToken(t?: string) {
  if (!t || !adminEnabled()) return false;
  const [exp, sig] = t.split(".");
  if (!exp || !sig || !safeEq(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

export async function isAdmin() {
  return validToken((await cookies()).get(COOKIE)?.value);
}

export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: MAX_AGE };

/** Reject cross-site form posts / fetches to state-changing endpoints. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetch from some browsers omits it; cookie is SameSite=Lax anyway
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") || req.headers.get("host"));
  } catch {
    return false;
  }
}

/* Tiny in-memory rate limiter (per process). */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length <= max;
}
export const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
