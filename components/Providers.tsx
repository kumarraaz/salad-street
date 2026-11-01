"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, type Product } from "@/lib/data";

type ToastAction = { label: string; run: () => void };
type ToastState = { text: string; action?: ToastAction; show: boolean };
type CartLine = { p: Product; q: number };

type Ctx = {
  items: Record<string, number>;
  lines: CartLine[];
  count: number;
  total: number;
  add: (id: string, q?: number) => void;
  set: (id: string, q: number) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: (text: string, action?: ToastAction) => void;
  toastState: ToastState;
  hideToast: () => void;
};

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside <Providers>");
  return c;
};

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [toastState, setToastState] = useState<ToastState>({ text: "", show: false });
  const lastFocus = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load the saved cart after mount (keeps server and client markup identical on first paint).
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("ss-cart") || "{}"));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Record<string, number>) => {
    try {
      localStorage.setItem("ss-cart", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const add = useCallback((id: string, q = 1) => {
    setItems((cur) => {
      const next = { ...cur, [id]: (cur[id] || 0) + q };
      persist(next);
      return next;
    });
  }, []);

  const set = useCallback((id: string, q: number) => {
    setItems((cur) => {
      const next = { ...cur };
      if (q <= 0) delete next[id];
      else next[id] = q;
      persist(next);
      return next;
    });
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(items)
        .map(([id, q]) => ({ p: PRODUCTS.find((x) => x.id === id) as Product, q }))
        .filter((l) => l.p),
    [items],
  );
  const count = useMemo(() => lines.reduce((s, l) => s + l.q, 0), [lines]);
  const total = useMemo(() => lines.reduce((s, l) => s + l.q * l.p.price, 0), [lines]);

  const openCart = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setCartOpen(true);
    document.body.classList.add("cart-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.querySelector<HTMLElement>("#drawer [data-close-cart]")?.focus(), 50);
  }, []);

  const closeCart = useCallback(() => {
    if (!document.body.classList.contains("cart-open")) return;
    document.body.classList.remove("cart-open");
    document.body.style.overflow = "";
    setCartOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  const hideToast = useCallback(() => setToastState((t) => ({ ...t, show: false })), []);
  const toast = useCallback((text: string, action?: ToastAction) => {
    setToastState({ text, action, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((t) => ({ ...t, show: false })), 3800);
  }, []);

  // Escape closes the cart; Tab is trapped inside the open cart drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
      if (e.key === "Tab" && document.body.classList.contains("cart-open")) {
        const drawer = document.getElementById("drawer");
        if (!drawer) return;
        const f = [...drawer.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  // Links whose real destination (social, phone, WhatsApp) has not been supplied yet.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const miss = (e.target as HTMLElement).closest<HTMLElement>("[data-missing]");
      if (!miss) return;
      e.preventDefault();
      const social = miss.dataset.missing === "social";
      toast(
        social ? "Social link not added yet." : "Contact details are being confirmed. Use the enquiry form for now.",
        social ? undefined : { label: "Open form", run: () => router.push("/contact") },
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [toast, router]);

  const value: Ctx = {
    items,
    lines,
    count,
    total,
    add,
    set,
    cartOpen,
    openCart,
    closeCart,
    toast,
    toastState,
    hideToast,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
