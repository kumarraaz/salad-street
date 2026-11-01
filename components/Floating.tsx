"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONFIG, PRODUCTS, inr, waLink } from "@/lib/data";
import { AVATAR, WA_SVG } from "@/lib/svg";
import { Icon, RawSvg } from "./ui";
import { useApp } from "./Providers";

/* Rule-based helper (no AI backend). Replace answer() with an API call to upgrade. */
const QUICK = ["Show products", "Day Highlights", "Bulk / corporate order", "Contact details", "Delivery areas"];

type Msg = { who: "bot" | "me"; node: ReactNode };

export default function Floating() {
  const { add, toast, openCart } = useApp();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "bot", node: "Hi! I'm the Salad Street assistant. How can I help you today?" },
  ]);
  const [text, setText] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  // Same focus handling as the original open()/close
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (open) inputRef.current?.focus();
    else launchRef.current?.focus();
  }, [open]);

  const addToCart = (id: string) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    add(p.id);
    toast(`${p.name} added to cart`, { label: "View cart", run: openCart });
  };

  const answer = (raw: string): ReactNode => {
    const m = raw.toLowerCase();
    const prod = PRODUCTS.find((p) => m.includes(p.name.toLowerCase()) || m.includes(p.hi));
    if (prod)
      return (
        <>
          {prod.name} ({prod.weight}) is {inr(prod.price)}.
          <button className="btn-cart" type="button" data-add={prod.id} onClick={() => addToCart(prod.id)}>
            Add to Cart
          </button>
        </>
      );
    const has = (...w: string[]) => w.some((x) => m.includes(x));
    if (has("product", "shop", "buy", "vegetable", "price", "menu", "salad"))
      return (
        <>
          We have {PRODUCTS.length} products listed right now, from Red Radish to English Carrot.{" "}
          <Link href="/products">See all products</Link> or <Link href="/categories">browse categories</Link>.
        </>
      );
    if (has("highlight", "farm", "tractor", "tour", "sow", "grow", "visit", "kid", "family"))
      return (
        <>
          A day at the farm includes a salad bar, tractor rides, a guided farm tour and Sow &amp; Grow for kids.{" "}
          <Link href="/highlights">Explore Day Highlights</Link>
        </>
      );
    if (has("bulk", "corporate", "office", "wholesale", "party", "event"))
      return (
        <>
          For bulk or corporate orders, send your requirement and choose “Bulk / corporate order”.{" "}
          <Link href="/contact">Open the enquiry form</Link>
        </>
      );
    if (has("deliver", "delivery", "area", "pin", "location", "ship"))
      return (
        <>
          Tell us your pin code through the <Link href="/contact">enquiry form</Link> and the team will confirm delivery to your area.
        </>
      );
    if (has("contact", "call", "phone", "whatsapp", "email", "address", "talk")) {
      const bits = [CONFIG.phoneDisplay && "📞 " + CONFIG.phoneDisplay, CONFIG.email && "✉️ " + CONFIG.email].filter(Boolean);
      return (
        <>
          You can reach us here: {bits.join(" · ") || "contact details are on our contact page"}.{" "}
          <Link href="/contact">Go to Contact Us</Link>
        </>
      );
    }
    if (has("founder", "mamata", "bhardwaj", "about", "story", "who"))
      return (
        <>
          Salad Street is led by Mamata and Bhardwaj. <Link href="/about">Meet our founders</Link>
        </>
      );
    if (has("preserv", "fresh", "healthy", "faq", "question"))
      return (
        <>
          Our salads are made with farm fresh ingredients. More answers are on the <Link href="/faqs">FAQ page</Link>.
        </>
      );
    if (has("blog", "recipe", "tip", "idea"))
      return (
        <>
          Recipes and healthy-eating tips are on the <Link href="/blog">Power Blog</Link>.
        </>
      );
    if (has("cart", "order", "checkout"))
      return (
        <>
          Add products to your cart, then open the cart to place your order.{" "}
          <button className="btn-cart" type="button" data-open-cart onClick={openCart}>
            Open cart
          </button>
        </>
      );
    if (has("hi", "hello", "hey", "namaste"))
      return <>Hello! I can help you find products, plan a farm day or get in touch. Pick an option below.</>;
    return (
      <>
        I can help with products, Day Highlights, bulk orders, delivery and contact details. Pick an option below, or{" "}
        <Link href="/contact">send us your question</Link>.
      </>
    );
  };

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((cur) => [...cur, { who: "me", node: q }]);
    setTimeout(() => setMsgs((cur) => [...cur, { who: "bot", node: answer(q) }]), 250);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(text);
    setText("");
  };

  const wa = waLink();
  return (
    <>
      <div className="fabs" aria-label="Contact shortcuts">
        {wa ? (
          <a className="fab wa" id="fabWa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" href={wa}>
            <RawSvg html={WA_SVG} />
          </a>
        ) : (
          <a className="fab wa" id="fabWa" aria-label="Chat on WhatsApp" href="/contact" data-missing="whatsapp">
            <RawSvg html={WA_SVG} />
          </a>
        )}
        {CONFIG.phoneTel ? (
          <a className="fab call" id="fabCall" aria-label="Call Salad Street" href={`tel:${CONFIG.phoneTel}`}>
            <Icon k="phone" size={24} />
          </a>
        ) : (
          <a className="fab call" id="fabCall" aria-label="Call Salad Street" href="/contact" data-missing="phone">
            <Icon k="phone" size={24} />
          </a>
        )}
      </div>
      <button
        className="bot-launch"
        id="botLaunch"
        ref={launchRef}
        aria-expanded={open}
        aria-controls="chat"
        onClick={() => setOpen((o) => !o)}
      >
        <RawSvg html={AVATAR()} />
        <span>
          Hi! How can I<br />
          help you today?
        </span>
      </button>
      <section
        className={`chat${open ? " open" : ""}`}
        id="chat"
        role="dialog"
        aria-label="Salad Street help assistant"
        aria-modal="false"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a[href^='/']") && matchMedia("(max-width:700px)").matches) setOpen(false);
        }}
      >
        <div className="chat-hd">
          <RawSvg html={AVATAR()} />
          <div>
            <b>Salad Street Assistant</b>
            <small>Quick answers and links</small>
          </div>
          <button className="icon-btn" type="button" data-close-chat aria-label="Close assistant" onClick={() => setOpen(false)}>
            <Icon k="close" size={20} />
          </button>
        </div>
        <div className="chat-log" aria-live="polite" ref={logRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.who}`}>
              {m.node}
            </div>
          ))}
        </div>
        <div className="quick">
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>
        <form className="chat-form" onSubmit={onSubmit}>
          <label className="sr" htmlFor="chatIn">
            Type your question
          </label>
          <input
            id="chatIn"
            ref={inputRef}
            autoComplete="off"
            placeholder="Ask about products, visits…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" aria-label="Send">
            <Icon k="send" size={18} />
          </button>
        </form>
      </section>
    </>
  );
}
