import { COOKIE, adminEnabled, checkLogin, clientIp, cookieOptions, makeToken, rateLimit, sameOrigin } from "@/lib/auth";
import { bad, json, str } from "@/lib/api";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return bad("Forbidden", 403);
  if (!adminEnabled()) return bad("Admin login is not set up yet (ADMIN_PASSWORD is missing on the server).", 503);
  if (!rateLimit("login:" + clientIp(req), 8, 15 * 60_000)) return bad("Too many attempts. Try again in 15 minutes.", 429);
  const b = await req.json().catch(() => ({}));
  if (!checkLogin(str(b.user, 100), typeof b.password === "string" ? b.password.slice(0, 200) : "")) return bad("Wrong username or password.", 401);
  const res = json({ ok: true });
  res.headers.append("Set-Cookie", `${COOKIE}=${makeToken()}; Path=/; Max-Age=${cookieOptions.maxAge}; HttpOnly; SameSite=Lax${cookieOptions.secure ? "; Secure" : ""}`);
  return res;
}
