import { COOKIE } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST() {
  const res = json({ ok: true });
  res.headers.append("Set-Cookie", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return res;
}
