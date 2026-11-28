/* =====================================================================
   SERVER-ONLY data store: products, orders and "notify me" requests.
   One JSON file in DATA_DIR (a Coolify persistent volume mounted at /app/data in production),
   uploaded photos in DATA_DIR/uploads. First run seeds products from lib/data.ts.
   Writes are queued and atomic (temp file + rename), so concurrent requests can't corrupt it.
   ===================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { COMING_SOON, PRODUCTS as SEED, type Product, type SoonItem } from "./data";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const FILE = path.join(DATA_DIR, "store.json");

export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";
export type OrderLine = { id: string; name: string; weight: string; price: number; q: number };
export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; address: string; pin: string; note: string };
  delivery: { date: string; slot: string; area?: string; charge?: string };
  payment: string;
  lines: OrderLine[];
  total: number;
};
export type NotifyReq = { id: string; createdAt: string; productId: string; productName: string; name: string; phone: string; done: boolean };
export type SoonProduct = SoonItem & { id: string };
/** A tap on a "WhatsApp" order button: the chat happens on WhatsApp, so only the click is recorded. */
export type WaClick = { id: string; createdAt: string; source: string; productId: string; productName: string };
export type Store = { products: Product[]; orders: Order[]; notify: NotifyReq[]; soon: SoonProduct[]; waClicks: WaClick[] };

/* Pages and API routes are bundled separately, so each keeps its own copy; the file's
   modification time tells every copy when another one has saved a change. */
let cache: Store | null = null;
let cacheMtime = 0;
let queue: Promise<unknown> = Promise.resolve();

const seedSoon = (): SoonProduct[] => COMING_SOON.map((s, i) => ({ ...s, id: `cs${i + 1}` }));

async function load(): Promise<Store> {
  const mtime = await fs.stat(FILE).then((s) => s.mtimeMs).catch(() => 0);
  if (cache && mtime === cacheMtime) return cache;
  try {
    const raw = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Store>;
    cache = { products: raw.products ?? [], orders: raw.orders ?? [], notify: raw.notify ?? [], soon: raw.soon ?? seedSoon(), waClicks: raw.waClicks ?? [] };
    cacheMtime = mtime;
  } catch {
    if (cache) return cache; // keep the last good copy if a read races a write
    // First run (or missing file): start from the products in the code.
    cache = { products: SEED.map((p) => ({ ...p, inStock: p.inStock ?? true })), orders: [], notify: [], soon: seedSoon(), waClicks: [] };
  }
  return cache;
}

async function persist(s: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(s, null, 1));
  await fs.rename(tmp, FILE);
  cacheMtime = await fs.stat(FILE).then((x) => x.mtimeMs).catch(() => 0);
}

/** Read-only snapshot. */
export async function readStore(): Promise<Store> {
  return load();
}

/** Serialized read-modify-write. The callback mutates the store; the result is saved atomically. */
export function writeStore<T>(fn: (s: Store) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const s = await load();
    const out = await fn(s);
    await persist(s);
    return out;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function getProducts(): Promise<Product[]> {
  return (await load()).products;
}

export async function getComingSoon(): Promise<SoonProduct[]> {
  return (await load()).soon;
}

export const newId = (prefix: string) => `${prefix}${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "product";
