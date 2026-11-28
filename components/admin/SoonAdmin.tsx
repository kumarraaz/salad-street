"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { SoonProduct } from "@/lib/store";
import { Icon } from "../ui";
import { PhotoField, api } from "./ProductsAdmin";

/* "Coming Soon Products" shown on the home page. Empty list = the section shows a WhatsApp sign-up instead. */

function SoonForm({ it, onDone }: { it: SoonProduct | null; onDone: () => void }) {
  const router = useRouter();
  const [img, setImg] = useState(it?.img || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setErr("");
    try {
      await api(it ? `/api/admin/soon/${encodeURIComponent(it.id)}` : "/api/admin/soon", it ? "PUT" : "POST", { name: d.name, weight: d.weight, img });
      router.refresh();
      onDone();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="adm-card adm-form" onSubmit={submit}>
      <h2>{it ? `Edit: ${it.name}` : "Add a Coming Soon product"}</h2>
      <div className="adm-cols">
        <label>
          Product name *
          <input name="name" required maxLength={80} defaultValue={it?.name} />
        </label>
        <label>
          Pack size (optional)
          <input name="weight" maxLength={20} defaultValue={it?.weight} placeholder="e.g. 100 g" />
        </label>
      </div>
      <PhotoField label="Product photo *" value={img} onChange={setImg} />
      {err ? (
        <p className="adm-err" role="alert">
          {err}
        </p>
      ) : null}
      <div className="adm-actions">
        <button className="adm-btn primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : it ? "Save changes" : "Add product"}
        </button>
        <button className="adm-btn ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function SoonAdmin({ items }: { items: SoonProduct[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SoonProduct | "new" | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const remove = async (it: SoonProduct) => {
    try {
      await api(`/api/admin/soon/${encodeURIComponent(it.id)}`, "DELETE");
      setConfirmDel(null);
      setMsg(`${it.name} removed.`);
      router.refresh();
    } catch (x) {
      setMsg(x instanceof Error ? x.message : "Could not delete.");
    }
  };

  return (
    <>
      <div className="adm-head">
        <h1 className="adm-h1">
          <Icon k="sprout" size={24} /> Coming Soon products
        </h1>
        <button className="adm-btn primary" type="button" onClick={() => setEditing("new")}>
          <Icon k="plus" size={16} /> Add product
        </button>
      </div>
      <p className="adm-sub">These appear in the “Coming Soon Products” section on the home page, each with a “Notify me on WhatsApp” button.</p>
      {msg ? (
        <p className="adm-msg" role="status">
          {msg}
        </p>
      ) : null}
      {editing ? <SoonForm key={editing === "new" ? "new" : editing.id} it={editing === "new" ? null : editing} onDone={() => setEditing(null)} /> : null}

      {items.length ? (
        <div className="adm-soon-grid">
          {items.map((it) => (
            <article className="adm-card adm-soon" key={it.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt="" width={240} height={180} />
              <b>{it.name}</b>
              {it.weight ? <small>{it.weight}</small> : null}
              {confirmDel === it.id ? (
                <span className="adm-confirm">
                  Remove?{" "}
                  <button className="adm-btn danger" type="button" onClick={() => remove(it)}>
                    Yes
                  </button>
                  <button className="adm-btn ghost" type="button" onClick={() => setConfirmDel(null)}>
                    No
                  </button>
                </span>
              ) : (
                <span className="adm-row-actions">
                  <button
                    className="adm-btn ghost"
                    type="button"
                    onClick={() => {
                      setEditing(it);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button className="adm-btn ghost danger-t" type="button" onClick={() => setConfirmDel(it.id)}>
                    Delete
                  </button>
                </span>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="adm-card adm-note">No Coming Soon products yet. Use “Add product” to show your upcoming items on the website.</p>
      )}
    </>
  );
}
