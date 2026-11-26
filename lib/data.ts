/* =====================================================================
   CONFIG — fill with VERIFIED client details. Any empty value hides the element that
   would show it; nothing is invented.
   ===================================================================== */
export const CONFIG = {
  phoneDisplay: "+91 88269 54654",
  phoneTel: "+918826954654",
  phone2Display: "+91 98718 77387",
  phone2Tel: "+919871877387",
  whatsapp: "918826954654", // digits only incl. country code
  upi: "", // UPI ID for online payment, e.g. "saladstreet@okicici"; the UPI option appears at checkout once this is set
  email: "", // e.g. "hello@saladstreet.in"
  address: "", // full postal address
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx" (POST JSON)
  social: { instagram: "", youtube: "", facebook: "", linkedin: "" } as Record<string, string>,
  fssai: "", // FSSAI licence number
  city: "", // city / delivery areas, e.g. "Greater Noida & Noida"
  minOrder: "", // e.g. "₹299"
  deliveryFee: "", // e.g. "Free above ₹499"
  deliveryDays: "", // e.g. "Mon–Sat"
  payment: "", // e.g. "UPI / Cash on delivery"
  offerCode: "", // e.g. "FRESH10"
  offerTerms: "", // e.g. "10% off your first order"
  footerLine: "", // short footer blurb
  ga4: "", // GA4 measurement ID, e.g. "G-XXXXXXX"
  siteUrl: "https://www.saladstreet.in",
  designedByUrl: "https://webdigitaldevelopment.in",
};

import { BLOG_IMG, WHY_IMG } from "./media";

/* ============================ DATA ================================== */
export type Category = { id: string; name: string; img: string };
/* Only categories that contain the 7 approved products. */
export const CATEGORIES: Category[] = [
  { id: "salad-greens", name: "Salad Greens", img: "/images/leafy/salad-leaves-mix.png" },
  { id: "herbs", name: "Herbs", img: "/images/leafy/italian-basil.png" },
  { id: "microgreens", name: "Microgreens", img: "/images/leafy/microgreens.png" },
];

/* ============================ PRODUCTS ==============================
   ONLY these 7 products are sold. Prices and pack weights have NOT been confirmed yet,
   so they are null / "" and the site shows "Price on request" (nothing is invented).
   To publish a price, set e.g.  price: 60, weight: "100 g"  and every card, product page,
   cart and order message updates automatically. No ratings are shown (none supplied).
   Images: TEMPORARY transparent cutouts in /public/images/leafy/ (replace a file, same
   name, with the client's own photo). */
export type Product = {
  id: string;
  name: string;
  hi: string; // Hindi name, shown only when filled in
  weight: string; // pack size, e.g. "100 g"; empty until confirmed
  price: number | null; // in rupees; null until confirmed
  cat: string;
  home: boolean;
  img: string;
  note: string;
  /** Genuine customer rating (out of 5) and review count. Leave unset until real reviews exist. */
  rating?: number;
  reviews?: number;
  /** Packaging photo (public/images/packs/). */
  pack?: string;
  /** Soft tint behind the pack photo on product cards. */
  tint?: string;
  /** Card badge, only when the client confirms it. */
  badge?: "Bestseller" | "Chef's pick";
  /** Extra pack sizes. The product's own weight/price is the default pack. */
  variants?: Variant[];
};
export type Variant = { key: string; weight: string; price: number; pack?: string };
const TINT: Record<string, string> = {
  "rocket-leaves": "#E3EFD9", "italian-basil": "#E8F5DC", "lettuce-mix": "#EEF6E2", "baby-spinach": "#E1EDDA",
  "salad-leaves-mix": "#EAF3E0", mint: "#E0F4EC", microgreens: "#F0F7D8",
};

export const PRODUCTS: Product[] = (<Product[]>[
  { id: "rocket-leaves", name: "Rocket Leaves", hi: "", weight: "100 g", price: 120, cat: "salad-greens", home: true, img: "/images/leafy/rocket.png", note: "Peppery, crisp leaves", pack: "/images/packs/rocket-leaves.webp" },
  { id: "italian-basil", name: "Italian Basil", hi: "", weight: "100 g", price: 140, cat: "herbs", home: true, img: "/images/leafy/italian-basil.png", note: "Sweet, aromatic herb", pack: "/images/packs/italian-basil.webp" },
  { id: "lettuce-mix", name: "Lettuce Mix", hi: "", weight: "200 g", price: 299, cat: "salad-greens", home: true, img: "/images/leafy/lettuce-mix.png", note: "Soft and crunchy lettuces", pack: "/images/packs/lettuce-mix.webp" },
  { id: "baby-spinach", name: "Baby Spinach", hi: "", weight: "200 g", price: 200, cat: "salad-greens", home: true, img: "/images/leafy/baby-spinach.png", note: "Tender, mild leaves", pack: "/images/packs/baby-spinach.webp" },
  { id: "salad-leaves-mix", name: "Salad Leaves Mix", hi: "", weight: "150 g", price: 200, cat: "salad-greens", home: true, img: "/images/leafy/salad-leaves-mix.png", note: "Red and green salad leaves", pack: "/images/packs/salad-leaves-mix-150g.webp", variants: [{ key: "200g", weight: "200 g", price: 299, pack: "/images/packs/salad-leaves-mix-200g.webp" }] },
  { id: "mint", name: "Mint", hi: "", weight: "100 g", price: 70, cat: "herbs", home: true, img: "/images/leafy/mint.png", note: "Cool, fresh aroma", pack: "/images/packs/mint.webp" },
  { id: "microgreens", name: "Microgreens", hi: "", weight: "50 g", price: 150, cat: "microgreens", home: true, img: "/images/leafy/microgreens.png", note: "Tiny, tender shoots", pack: "/images/packs/microgreens.webp" },
]).map((p) => ({ ...p, tint: p.tint ?? TINT[p.id] }));

/* Slides 2–4 copy is draft — replace with approved copy.
   Banners: full-width hero backgrounds (2048px) with a 1024px `-sm` version for phones. */
export type Slide = { lines: [string, [string, string], string]; text: string; img: string; imgSm: string };
export const SLIDES: Slide[] = [
  {
    lines: ["Fresh", ["Salads", " for a"], "Healthier You"],
    text: "Farm fresh ingredients, ready-to-eat salads, and healthy products for your everyday wellness.",
    img: "images/hero/slide-1.webp",
    imgSm: "images/hero/slide-1-sm.webp",
  },
  {
    lines: ["Farm", ["to Bowl,", ""], "Every Day"],
    text: "Grown at our farm, prepared fresh and ready to eat.",
    img: "images/hero/slide-2.webp",
    imgSm: "images/hero/slide-2-sm.webp",
  },
  {
    lines: ["Picked", ["Fresh", " for"], "Your Table"],
    text: "Seasonal vegetables and salads, picked and packed with care.",
    img: "images/hero/slide-3.webp",
    imgSm: "images/hero/slide-3-sm.webp",
  },
];

export type Highlight = { id: string; title: string; text: string; ill: string; icon: string };
export const HIGHLIGHTS: Highlight[] = [
  { id: "treat", title: "Treat Yourself", text: "Live salad bar & barbecue, gourmet salads, buffet lunch, beverages and tea.", ill: "bowl", icon: "fork" },
  { id: "tractor", title: "Tractor Ride", text: "A fun tractor ride for the kids surrounded by green fields.", ill: "tractor", icon: "wheel" },
  { id: "tour", title: "Farm Tour & Knowledge Sharing", text: "A guided farm walk to discover how food is grown and cared for.", ill: "farm", icon: "map" },
  { id: "sow", title: "Sow & Grow", text: "Kids sow a seed in a planter and take it home to grow.", ill: "sow", icon: "sprout" },
];

/* Bios from the approved design. bioFull / img stay empty until the client supplies them (then shown). */
export type Founder = { id: string; name: string; bio: string; bioFull: string; img: string };
export const FOUNDERS: Founder[] = [
  { id: "mamata", name: "Mamata", bio: "Mamata drives our vision of fresh, healthy and sustainable food for every home.", bioFull: "", img: "" },
  { id: "bhardwaj", name: "Bhardwaj", bio: "Bhardwaj looks after product development, quality and community initiatives.", bioFull: "", img: "" },
];

export type Why = { id: string; tab: string; icon: string; title: string; text: string; tbc?: boolean; img: string };
export const WHY: Why[] = [
  { id: "fresh", tab: "Fresh Ingredients", icon: "leaf", title: "Farm Fresh Ingredients", text: "Grown at our own farm, picked fresh and packed with care to bring you the best quality salad greens, herbs and microgreens.", img: "images/why/fresh.webp" },
  { id: "healthy", tab: "Healthy & Nutritious", icon: "heart", title: "Healthy & Nutritious", text: "Wholesome, balanced food made for everyday wellness.", tbc: true, img: "images/why/healthy.webp" },
  { id: "variety", tab: "Wide Variety", icon: "grid", title: "Wide Variety", text: "Salad greens, herbs and microgreens, all in one place.", img: "images/why/variety.webp" },
].map((w) => ({ ...w, img: WHY_IMG[w.id] || w.img }));

/* Genuine, verifiable customer reviews only. Empty = the reviews section is hidden. */
export type Review = { name: string; text: string; stars: number; sample?: boolean; img?: string };
export const REVIEWS: Review[] = [];

export type Blog = { slug: string; title: string; excerpt: string; img: string };
export const BLOGS: Blog[] = [
  { slug: "5-healthy-salad-ideas", title: "5 Healthy Salad Ideas for Everyday Meals", excerpt: "Simple salad combinations you can make on a busy weekday." },
  { slug: "why-fresh-ingredients-matter", title: "How Fresh Ingredients Make a Difference", excerpt: "What freshness changes in taste, texture and nutrition." },
  { slug: "from-farm-to-your-bowl", title: "From Farm to Your Bowl: Our Journey", excerpt: "How our produce travels from the field to your plate." },
  { slug: "nutrition-tips-healthier-you", title: "Nutrition Tips for a Healthier You", excerpt: "Small, practical changes for better everyday eating." },
].map((b) => ({ ...b, img: BLOG_IMG[b.slug] || `images/blog/${b.slug}.webp` }));

/* Answers in tbc:true need client confirmation. */
export type Faq = { q: string; a: string; tbc?: boolean };
export const FAQS: Faq[] = [
  { q: "Are your salads really fresh?", a: "Yes. Our greens are grown at our own farm, picked fresh and packed with care." },
  { q: "Can I customize my salad?", a: "Tell us what you would like through the enquiry form and we will let you know what is possible." },
  { q: "Do you offer bulk or corporate orders?", a: "Send your requirement through the enquiry form, choosing “Bulk / corporate order”, and our team will get back to you." },
];
export const REQUIREMENTS = ["Product enquiry", "Bulk / corporate order", "Farm visit / Day Highlights", "Feedback", "Other"];

export const NAV = [
  { label: "Home", href: "/", dd: false },
  { label: "About Us", href: "/about", dd: false },
  { label: "Our Products", href: "/products", dd: true },
  { label: "Recipes", href: "/recipes", dd: false },
  { label: "Contact Us", href: "/contact", dd: false },
];

/* ============================ HELPERS =============================== */
export const inr = (n: number) => "₹ " + Number(n).toFixed(2);
/** Price label: the real price, or "Price on request" until one is confirmed. */
export const priceText = (p: Product, q = 1) => (p.price == null ? "Price on request" : inr(p.price * q));
/** "Rocket Leaves (100 g)", or just the name while no pack size is confirmed. */
export const withWeight = (p: Product) => (p.weight ? `${p.name} (${p.weight})` : p.name);

/** "₹60 per 100 g" from a price and a pack size like "200 g"; null if either is missing. */
export const per100 = (price?: number | null, weight?: string) => {
  const g = weight ? parseFloat(weight) * (/kg/i.test(weight) ? 1000 : 1) : 0;
  if (price == null || !g) return null;
  const v = (price / g) * 100;
  return `₹${Number.isInteger(v) ? v : v.toFixed(2)} per 100 g`;
};

/** WhatsApp order link for one product pack. */
export const waOrderLink = (name: string, weight?: string, price?: number | null) =>
  `https://wa.me/918826954654?text=${encodeURIComponent(`Hi, I want ${name}${weight ? " " + weight : ""}${price != null ? " ₹" + price : ""}`)}`;

export const waLink = (text = "") =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}` : "";

export const enquiryText = (d: Record<string, string>) =>
  `Hello Salad Street,\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nRequirement: ${d.type}\n${d.message}`;

export const orderText = (lines: { p: Product; q: number }[], total: number) =>
  `Hello Salad Street, I'd like to order:\n${lines
    .map(({ p, q }) => `• ${withWeight(p)} × ${q} = ${priceText(p, q)}`)
    .join("\n")}\n${
    lines.some((l) => l.p.price == null) ? `Subtotal of priced items: ${inr(total)} (other prices on request)` : `Subtotal: ${inr(total)}`
  }`;

/** Cart keys are "<id>" for the default pack or "<id>~<variant key>" for another pack size. */
export const baseId = (key: string) => key.split("~")[0];
export const cartProduct = (key: string): Product | undefined => {
  const [id, vk] = key.split("~");
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p || !vk) return p;
  const v = p.variants?.find((x) => x.key === vk);
  return v ? { ...p, id: key, weight: v.weight, price: v.price, pack: v.pack ?? p.pack } : undefined;
};

export const productsInCategory = (id: string) => PRODUCTS.filter((p) => p.cat === id).length;

/* ============================ AVAILABLE NEXT WEEK ====================
   Product ids (from PRODUCTS) available next week, as confirmed by the client. Empty = section hidden. */
export const NEXT_WEEK: string[] = ["rocket-leaves", "italian-basil", "lettuce-mix", "baby-spinach", "salad-leaves-mix", "mint", "microgreens"];

/* ============================ COMING SOON ===========================
   New products not on sale yet. Fill only with confirmed items; empty = section hidden.
   Example: { name: "Red Amaranth", weight: "100 g", img: "/images/packs/red-amaranth.webp" } */
export type SoonItem = { name: string; weight?: string; img: string; tint?: string };
export const COMING_SOON: SoonItem[] = [];

/* ============================ DELIVERY CALENDAR =====================
   Dates customers cannot reserve at checkout (holidays, farm closures), as "YYYY-MM-DD".
   Sundays are always closed. */
export const BLOCKED_DATES: string[] = [];
export const DELIVERY_SLOTS = ["Morning", "Evening"] as const;
