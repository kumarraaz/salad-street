import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/store";

const TYPES: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

/** Serves product photos uploaded in the admin (stored on the server volume). */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-zA-Z0-9_-]+\.(webp|jpe?g|png)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, file));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[path.extname(file).toLowerCase()], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
