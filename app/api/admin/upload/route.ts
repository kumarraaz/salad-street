import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { bad, guard, json } from "@/lib/api";
import { UPLOAD_DIR } from "@/lib/store";

const MAX = 5 * 1024 * 1024;
/* Check the real file signature, not just the name the browser sends. */
function kind(b: Uint8Array) {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ".jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ".png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return ".webp";
  return "";
}

/** Product photo upload (JPG / PNG / WebP, up to 5 MB). Returns the URL to store on the product. */
export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return bad("Choose an image file.");
  if (file.size > MAX) return bad("Image is larger than 5 MB.");
  const buf = new Uint8Array(await file.arrayBuffer());
  const ext = kind(buf);
  if (!ext) return bad("Only JPG, PNG or WebP images are allowed.");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return json({ ok: true, url: `/api/uploads/${name}` });
}
