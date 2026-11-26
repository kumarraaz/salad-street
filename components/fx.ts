/* Motion: cart + wishlist micro-interactions (Web Animations API, no libraries).
   Every effect is fire-and-forget and cleans up after itself, so rapid clicks are safe. */

const EASE = "cubic-bezier(.22,.61,.36,1)";
const POP = "cubic-bezier(.34,1.56,.64,1)";
const still = () => typeof window === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches;
let flying = 0;

/** Visible header cart button (desktop or mobile header). */
const cartBtn = () =>
  Array.from(document.querySelectorAll<HTMLElement>("#siteHeader [data-open-cart]")).find((el) => el.offsetParent) || null;

/** Bounce the header cart and pop its badge. */
export function bumpCart() {
  const btn = cartBtn();
  if (!btn || still()) return;
  btn.getAnimations().forEach((a) => a.cancel());
  btn.animate([{ transform: "scale(1)" }, { transform: "scale(1.18) rotate(-8deg)" }, { transform: "scale(1)" }], { duration: 420, easing: POP });
  btn.querySelector("[data-cart-count]")?.animate([{ transform: "scale(.4)" }, { transform: "scale(1)" }], { duration: 380, easing: POP });
}

/** 40px clone of the product image flies in a curve to the header cart, then the cart bounces. */
export function flyToCart(from: Element | null, src?: string) {
  const to = cartBtn();
  if (still() || !from || !to || !src || flying > 3) return bumpCart();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const x0 = a.left + a.width / 2 - 20, y0 = a.top + a.height / 2 - 20;
  const dx = b.left + b.width / 2 - 20 - x0, dy = b.top + b.height / 2 - 20 - y0;
  const img = document.createElement("img");
  img.src = /^(https?:)?\//.test(src) ? src : "/" + src;
  img.alt = "";
  img.className = "fly-clone";
  img.style.left = x0 + "px";
  img.style.top = y0 + "px";
  document.body.appendChild(img);
  flying++;
  const anim = img.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px,${Math.min(dy, 0) - 90}px) scale(.9)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(.35)`, opacity: 0.4 },
    ],
    { duration: 650, easing: EASE }
  );
  const done = () => {
    img.remove();
    flying--;
  };
  anim.onfinish = () => {
    done();
    bumpCart();
  };
  anim.oncancel = done;
}

/** Heart pop + 6 tiny leaves bursting outwards (fixed layer, so card frames never clip it). */
export function leafBurst(btn: Element | null) {
  if (!btn || still()) return;
  btn.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 380, easing: POP });
  const r = btn.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const leaf = document.createElement("span");
    leaf.className = "leaf-bit";
    leaf.style.left = r.left + r.width / 2 - 4 + "px";
    leaf.style.top = r.top + r.height / 2 - 4 + "px";
    document.body.appendChild(leaf);
    const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
    leaf
      .animate(
        [
          { transform: `rotate(${i * 60}deg) scale(.4)`, opacity: 1 },
          { transform: `translate(${Math.cos(ang) * 26}px,${Math.sin(ang) * 26}px) rotate(${i * 60 + 90}deg) scale(1)`, opacity: 0 },
        ],
        { duration: 520, easing: EASE }
      )
      .finished.then(() => leaf.remove(), () => leaf.remove());
  }
}
