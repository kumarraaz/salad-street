/* =====================================================================
   CONFIG — fill with VERIFIED client details. Empty values show a clear
   "to be confirmed" state instead of invented information.
   ===================================================================== */
export const CONFIG = {
  phoneDisplay: "", // e.g. "+91 98xxx xxxxx"
  phoneTel: "", // e.g. "+9198xxxxxxxx"
  whatsapp: "", // digits only incl. country code, e.g. "9198xxxxxxxx"
  email: "", // e.g. "hello@saladstreet.in"
  address: "", // full postal address
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx" (POST JSON)
  social: { instagram: "", youtube: "", facebook: "", linkedin: "" } as Record<string, string>,
  designedByUrl: "https://webdigitaldevelopment.in",
};

/* ============================ DATA ================================== */
export type Category = { id: string; name: string; img: string };
export const CATEGORIES: Category[] = [
  { id: "fresh-salads", name: "Fresh Salads", img: "images/categories/fresh-salads.webp" },
  { id: "cut-fruits", name: "Cut Fruits", img: "images/categories/cut-fruits.webp" },
  { id: "vegetables", name: "Vegetables", img: "images/categories/vegetables.webp" },
  { id: "salad-dressings", name: "Salad Dressings", img: "images/categories/salad-dressings.webp" },
  { id: "healthy-snacks", name: "Healthy Snacks", img: "images/categories/healthy-snacks.webp" },
  { id: "combo-packs", name: "Combo Packs", img: "images/categories/combo-packs.webp" },
];

export type Product = {
  id: string;
  name: string;
  hi: string;
  weight: string;
  price: number;
  cat: string;
  home: boolean;
  img: string;
};
/* Prices/weights are from the approved design — confirm with client before launch. */
export const PRODUCTS: Product[] = [
  { id: "red-radish", name: "Red Radish", hi: "लाल मूली", weight: "200 g", price: 50, cat: "vegetables", home: true },
  { id: "sambar-onion", name: "Sambar Onion", hi: "सांभर प्याज", weight: "250 g", price: 40, cat: "vegetables", home: true },
  { id: "onion", name: "Onion", hi: "प्याज", weight: "500 g", price: 65, cat: "vegetables", home: true },
  { id: "garlic", name: "Garlic", hi: "लहसुन", weight: "100 g", price: 45, cat: "vegetables", home: true },
  { id: "baby-potato", name: "Baby Potato", hi: "छोटा आलू", weight: "1000 g", price: 100, cat: "vegetables", home: true },
  { id: "potato", name: "Potato", hi: "आलू", weight: "1000 g", price: 90, cat: "vegetables", home: true },
  { id: "sweet-potato", name: "Sweet Potato", hi: "शकरकंद", weight: "500 g", price: 110, cat: "vegetables", home: true },
  { id: "english-carrot", name: "English Carrot", hi: "अंग्रेजी गाजर", weight: "500 g", price: 80, cat: "vegetables", home: true },
  /* SALAD VARIETIES — ready to add once the client confirms weight, price and photo for each.
     None of the products above are salads, so none were renamed. Add entries like:
     { id:"classic-garden-salad", name:"Classic Garden Salad", hi:"", weight:"", price:0, cat:"fresh-salads", home:false },
     Names: Classic Garden Salad, Caesar Salad, Greek Salad, Mediterranean Salad, Fresh Spinach Salad, Kale Salad,
     Mixed Greens Salad, Avocado Salad, Quinoa Salad, Chickpea Salad, Protein Salad, Seasonal Fresh Salad. */
].map((p) => ({ ...p, img: `images/products/${p.id}.webp` }));

/* Slides 2–3 copy is draft — replace with approved copy. */
export type Slide = { lines: [string, [string, string], string]; text: string; img: string };
export const SLIDES: Slide[] = [
  {
    lines: ["Fresh", ["Salads", " for a"], "Healthier You"],
    text: "Farm fresh ingredients, ready-to-eat salads, and healthy products for your everyday wellness.",
    img: "images/hero/slide-1.png",
  },
  {
    lines: ["Farm", ["to Bowl,", ""], "Every Day"],
    text: "Grown at our farm, prepared fresh and ready to eat.",
    img: "images/hero/slide-2.png",
  },
  {
    lines: ["Picked", ["Fresh", " for"], "Your Table"],
    text: "Seasonal vegetables and salads, picked and packed with care.",
    img: "images/hero/slide-3.png",
  },
];

export type Highlight = { id: string; title: string; text: string; ill: string; icon: string };
export const HIGHLIGHTS: Highlight[] = [
  { id: "treat", title: "Treat Yourself", text: "Live salad bar & barbecue, gourmet salads, buffet lunch, beverages and tea.", ill: "bowl", icon: "fork" },
  { id: "tractor", title: "Tractor Ride", text: "A fun tractor ride for the kids surrounded by green fields.", ill: "tractor", icon: "wheel" },
  { id: "tour", title: "Farm Tour & Knowledge Sharing", text: "A guided farm walk to discover how food is grown and cared for.", ill: "farm", icon: "map" },
  { id: "sow", title: "Sow & Grow", text: "Kids sow a seed in a planter and take it home to grow.", ill: "sow", icon: "sprout" },
];

/* Bios from the approved design. Full bios: client to supply (bioFull). */
export type Founder = { id: string; name: string; bio: string; bioFull: string; img: string };
export const FOUNDERS: Founder[] = [
  { id: "mamata", name: "Mamata", bio: "Mamata drives our vision of fresh, healthy and sustainable food for every home.", bioFull: "", img: "images/founders/mamata.webp" },
  { id: "bhardwaj", name: "Bhardwaj", bio: "Bhardwaj looks after product development, quality and community initiatives.", bioFull: "", img: "images/founders/bhardwaj.webp" },
];

export type Why = { id: string; tab: string; icon: string; title: string; text: string; tbc?: boolean; img: string };
export const WHY: Why[] = [
  { id: "fresh", tab: "Fresh Ingredients", icon: "leaf", title: "Farm Fresh Ingredients", text: "We source the freshest fruits and vegetables from trusted farms to bring you the best quality salads and healthy products.", img: "images/why/fresh.webp" },
  { id: "nopres", tab: "No Preservatives", icon: "shield", title: "No Preservatives", text: "Our salads and products are made without added preservatives.", tbc: true, img: "images/why/no-preservatives.webp" },
  { id: "healthy", tab: "Healthy & Nutritious", icon: "heart", title: "Healthy & Nutritious", text: "Wholesome, balanced food made for everyday wellness.", tbc: true, img: "images/why/healthy.webp" },
  { id: "variety", tab: "Wide Variety", icon: "grid", title: "Wide Variety", text: "Salads, cut fruits, vegetables, dressings, snacks and combo packs in one place.", img: "images/why/variety.webp" },
];

/* SAMPLE reviews from the mockup. Replace with genuine, verifiable reviews before launch. */
export type Review = { name: string; text: string; stars: number; sample?: boolean; img?: string };
export const REVIEWS: Review[] = [
  { name: "Priya Sharma", text: "Super fresh and delicious salads! Perfect for my busy lifestyle.", stars: 5, sample: true },
  { name: "Rahul Mehta", text: "Love the quality and packaging. Truly healthy and tasty.", stars: 5, sample: true },
  { name: "Anjali Verma", text: "Best salad brand in India! Fresh, crunchy and so convenient.", stars: 5, sample: true },
];

export type Blog = { slug: string; title: string; excerpt: string; img: string };
export const BLOGS: Blog[] = [
  { slug: "5-healthy-salad-ideas", title: "5 Healthy Salad Ideas for Everyday Meals", excerpt: "Simple salad combinations you can make on a busy weekday." },
  { slug: "why-fresh-ingredients-matter", title: "How Fresh Ingredients Make a Difference", excerpt: "What freshness changes in taste, texture and nutrition." },
  { slug: "from-farm-to-your-bowl", title: "From Farm to Your Bowl: Our Journey", excerpt: "How our produce travels from the field to your plate." },
  { slug: "nutrition-tips-healthier-you", title: "Nutrition Tips for a Healthier You", excerpt: "Small, practical changes for better everyday eating." },
].map((b) => ({ ...b, img: `images/blog/${b.slug}.webp` }));

/* Answers in tbc:true need client confirmation. */
export type Faq = { q: string; a: string; tbc?: boolean };
export const FAQS: Faq[] = [
  { q: "Are your salads really fresh?", a: "Yes. Our salads are made with farm fresh ingredients and prepared ready to eat." },
  { q: "Do you use preservatives?", a: "No. Our salads and products are made without added preservatives.", tbc: true },
  { q: "What areas do you deliver to?", a: "Delivery areas are being finalised. Send us your pin code through the enquiry form and we will confirm.", tbc: true },
  { q: "How long do the products stay fresh?", a: "Shelf life depends on the product. Storage guidance will be listed on each product.", tbc: true },
  { q: "Can I customize my salad?", a: "Tell us what you would like through the enquiry form and we will let you know what is possible.", tbc: true },
  { q: "Do you offer bulk or corporate orders?", a: "Send your requirement through the enquiry form, choosing “Bulk / corporate order”, and our team will get back to you.", tbc: true },
];
export const REQUIREMENTS = ["Product enquiry", "Bulk / corporate order", "Farm visit / Day Highlights", "Feedback", "Other"];

export const NAV = [
  { label: "Home", href: "/", dd: false },
  { label: "About Us", href: "/about", dd: false },
  { label: "Our Products", href: "/products", dd: true },
  { label: "Recipes", href: "/blog", dd: false },
  { label: "Blog", href: "/blog", dd: false },
  { label: "Contact Us", href: "/contact", dd: false },
];

/* ============================ HELPERS =============================== */
export const inr = (n: number) => "₹ " + Number(n).toFixed(2);

export const waLink = (text = "") =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}` : "";

export const enquiryText = (d: Record<string, string>) =>
  `Hello Salad Street,\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nRequirement: ${d.type}\n${d.message}`;

export const orderText = (lines: { p: Product; q: number }[], total: number) =>
  `Hello Salad Street, I'd like to order:\n${lines
    .map(({ p, q }) => `• ${p.name} (${p.weight}) × ${q} = ${inr(p.price * q)}`)
    .join("\n")}\nSubtotal: ${inr(total)}`;

export const productsInCategory = (id: string) => PRODUCTS.filter((p) => p.cat === id).length;
