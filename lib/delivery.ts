/** Delivery area: Delhi NCR only. Gurugram gets free delivery on orders of FREE_DELIVERY_MIN or more.
    Other NCR areas (and Gurugram below the minimum): the delivery charge is confirmed on WhatsApp. */
export const FREE_DELIVERY_MIN = 599;

type Area = { name: string; free?: boolean; test: (pin: number) => boolean };
const range = (a: number, b: number) => (n: number) => n >= a && n <= b;

const AREAS: Area[] = [
  { name: "Gurugram", free: true, test: (n) => range(122001, 122099)(n) || [122101, 122102, 122103, 122413, 122414, 122503, 122505, 122506].includes(n) },
  { name: "Delhi", test: range(110001, 110099) },
  { name: "Noida / Greater Noida", test: range(201301, 201318) },
  { name: "Ghaziabad", test: (n) => range(201001, 201021)(n) || n === 201102 },
  { name: "Faridabad", test: range(121001, 121013) },
];

export type PinResult = { status: "empty" | "invalid" | "no" | "ok"; area?: string; free?: boolean };

export function checkPin(pin: string): PinResult {
  const p = (pin || "").replace(/\D/g, "");
  if (!p) return { status: "empty" };
  if (p.length !== 6) return { status: "invalid" };
  const a = AREAS.find((x) => x.test(Number(p)));
  return a ? { status: "ok", area: a.name, free: !!a.free } : { status: "no" };
}

/** Delivery charge text for an order (never invents a fee). */
export function deliveryNote(r: PinResult, total: number) {
  if (r.status !== "ok") return "";
  if (r.free && total >= FREE_DELIVERY_MIN) return `FREE delivery (${r.area}, order ₹${FREE_DELIVERY_MIN}+)`;
  return `Delivery charge confirmed on WhatsApp (${r.area})`;
}
