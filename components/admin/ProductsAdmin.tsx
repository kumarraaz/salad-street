"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { inr, type Product } from "@/lib/data";

type Cat = { id: string; name: string };
type VariantRow = { key: string; weight: string; price: string };

async function api(url: string, method: string, body?: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) window.location.href = "/admin/login";
  if (!r.ok) throw new Error(j.error || "Something went wrong.");
  return j;
}

/** Photo picker: uploads straight away and returns the stored URL. */
function PhotoField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="adm-photo">
      <span className="adm-lbl">{label}</span>
      <div className="adm-photo-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" width={96} height={78} /> : <span className="adm-photo-empty">No photo</span>}
        <label className="adm-btn ghost">
          {busy ? "Uploading…" : value ? "Change photo" : "Upload photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (f.size > 5 * 1024 * 1024) return setErr("Image is larger than 5 MB.");
              setBusy(true);
              setErr("");
              const fd = new FormData();
              fd.append("file", f);
              const r = await fetch("/api/admin/upload", { method: "POST", body: fd }).catch(() => null);
              const j = await r?.json().catch(() => ({}));
              setBusy(false);
              if (r?.ok && j?.url) onChange(j.url);
              else setErr(j?.error || "Upload failed.");
            }}
          />
        </label>
        {value ? (
          <button className="adm-btn ghost" type="button" onClick={() => onChange("")}>
            Remove
          </button>
        ) : null}
      </div>
      {err ? <p className="adm-err">{err}</p> : null}
    </div>
  );
}

function ProductForm({ p, cats, onDone }: { p: Product | null; cats: Cat[]; onDone: () => void }) {
  const router = useRouter();
  const [pack, setPack] = useState(p?.pack || (p?.img && !p?.pack ? p.img : "") || "");
  const [leaf, setLeaf] = useState(p?.pack ? p?.img || "" : "");
  const [variants, setVariants] = useState<VariantRow[]>((p?.variants || []).map((v) => ({ key: v.key, weight: v.weight, price: String(v.price) })));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const keep = (p?.variants || []).reduce<Record<string, string | undefined>>((m, v) => ((m[v.key] = v.pack), m), {});
    const body = {
      name: d.name,
      hi: d.hi,
      cat: d.cat,
      weight: d.weight,
      price: d.price,
      note: d.note,
      badge: d.badge,
      inStock: d.inStock === "on",
      pack,
      img: leaf || pack,
      variants: variants.filter((v) => v.weight.trim()).map((v) => ({ key: v.key, weight: v.weight, price: v.price, pack: keep[v.key] })),
    };
    setBusy(true);
    setErr("");
    try {
      await api(p ? `/api/admin/products/${encodeURIComponent(p.id)}` : "/api/admin/products", p ? "PUT" : "POST", body);
      router.refresh();
      onDone();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="adm-card adm-form adm-pform" onSubmit={submit}>
      <h2>{p ? `Edit: ${p.name}` : "Add a product"}</h2>
      <div className="adm-cols">
        <label>
          Product name *
          <input name="name" required maxLength={80} defaultValue={p?.name} />
        </label>
        <label>
          Category *
          <select name="cat" required defaultValue={p?.cat || cats[0]?.id}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pack size (e.g. 100 g)
          <input name="weight" maxLength={20} defaultValue={p?.weight} />
        </label>
        <label>
          Price (₹)
          <input name="price" type="number" min="0" step="0.01" inputMode="decimal" defaultValue={p?.price ?? ""} />
        </label>
        <label>
          Short description
          <input name="note" maxLength={160} defaultValue={p?.note} />
        </label>
        <label>
          Hindi name (optional)
          <input name="hi" maxLength={60} defaultValue={p?.hi} />
        </label>
        <label>
          Badge
          <select name="badge" defaultValue={p?.badge || ""}>
            <option value="">None</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Chef's pick">Chef&apos;s pick</option>
          </select>
        </label>
        <label className="adm-check">
          <input name="inStock" type="checkbox" defaultChecked={p ? p.inStock !== false : true} /> In stock
        </label>
      </div>

      <div className="adm-cols">
        <PhotoField label="Pack photo (shown on product cards) *" value={pack} onChange={setPack} />
        <PhotoField label="Leaf photo (optional, used in recipes)" value={leaf} onChange={setLeaf} />
      </div>

      <div className="adm-variants">
        <span className="adm-lbl">Other pack sizes (optional)</span>
        {variants.map((v, i) => (
          <div className="adm-vrow" key={i}>
            <input placeholder="Pack size, e.g. 200 g" value={v.weight} maxLength={20} onChange={(e) => setVariants((vs) => vs.map((x, j) => (j === i ? { ...x, weight: e.target.value } : x)))} />
            <input placeholder="Price ₹" type="number" min="0" step="0.01" value={v.price} onChange={(e) => setVariants((vs) => vs.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} />
            <button className="adm-btn ghost" type="button" onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button className="adm-btn ghost" type="button" onClick={() => setVariants((vs) => [...vs, { key: `v${Date.now().toString(36)}`, weight: "", price: "" }])}>
          + Add pack size
        </button>
      </div>

      {err ? (
        <p className="adm-err" role="alert">
          {err}
        </p>
      ) : null}
      <div className="adm-actions">
        <button className="adm-btn primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : p ? "Save changes" : "Add product"}
        </button>
        <button className="adm-btn ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ProductsAdmin({ products, categories }: { products: Product[]; categories: Cat[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const toggleStock = async (p: Product) => {
    try {
      await api(`/api/admin/products/${encodeURIComponent(p.id)}`, "PUT", { inStock: p.inStock === false });
      setMsg(`${p.name} is now ${p.inStock === false ? "in stock" : "out of stock"}.`);
      router.refresh();
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "Could not update.");
    }
  };
  const remove = async (p: Product) => {
    try {
      await api(`/api/admin/products/${encodeURIComponent(p.id)}`, "DELETE");
      setConfirmDel(null);
      setMsg(`${p.name} deleted.`);
      router.refresh();
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "Could not delete.");
    }
  };

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">Products</h1>
        <button className="adm-btn primary" type="button" onClick={() => setEditing("new")}>
          + Add product
        </button>
      </div>
      {msg ? (
        <p className="adm-msg" role="status">
          {msg}
        </p>
      ) : null}
      {editing ? <ProductForm key={editing === "new" ? "new" : editing.id} p={editing === "new" ? null : editing} cats={categories} onDone={() => setEditing(null)} /> : null}

      <div className="adm-card">
        <table className="adm-table adm-products">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="r">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.inStock === false ? "is-out" : ""}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.pack || p.img} alt="" width={64} height={52} className="adm-thumb" />
                </td>
                <td>
                  <b>{p.name}</b>
                  <small>
                    {categories.find((c) => c.id === p.cat)?.name}
                    {p.variants?.length ? ` · +${p.variants.length} pack size${p.variants.length > 1 ? "s" : ""}` : ""}
                  </small>
                </td>
                <td>
                  {p.price == null ? "On request" : inr(p.price)}
                  {p.weight ? <small>/ {p.weight}</small> : null}
                </td>
                <td>
                  <button className={`adm-switch${p.inStock === false ? "" : " on"}`} type="button" role="switch" aria-checked={p.inStock !== false} onClick={() => toggleStock(p)}>
                    <span />
                    {p.inStock === false ? "Out of stock" : "In stock"}
                  </button>
                </td>
                <td className="r">
                  {confirmDel === p.id ? (
                    <span className="adm-confirm">
                      Delete {p.name}?{" "}
                      <button className="adm-btn danger" type="button" onClick={() => remove(p)}>
                        Yes, delete
                      </button>{" "}
                      <button className="adm-btn ghost" type="button" onClick={() => setConfirmDel(null)}>
                        No
                      </button>
                    </span>
                  ) : (
                    <>
                      <button
                        className="adm-btn ghost"
                        type="button"
                        onClick={() => {
                          setEditing(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </button>{" "}
                      <button className="adm-btn ghost danger-t" type="button" onClick={() => setConfirmDel(p.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length ? <p className="adm-note">No products yet. Use “Add product”.</p> : null}
      </div>
    </>
  );
}
