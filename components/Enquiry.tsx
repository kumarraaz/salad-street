"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONFIG, REQUIREMENTS, enquiryText, waLink } from "@/lib/data";
import { Cta, Icon } from "./ui";
import Media from "./Media";

const rules: Record<string, (v: string) => true | string> = {
  name: (v) => v.trim().length >= 2 || "Enter your name.",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email address, like name@example.com.",
  phone: (v) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) || "Enter a 10-digit Indian mobile number.",
  type: (v) => !!v || "Choose a requirement type.",
  message: (v) => v.trim().length >= 10 || "Describe your requirement in at least 10 characters.",
};
const KEYS = Object.keys(rules);

export function EnquiryForm({ pfx }: { pfx: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ cls: string; body: ReactNode } | null>(null);

  const field = (n: string) => formRef.current!.elements.namedItem(n) as HTMLInputElement;

  const check = (n: string) => {
    const r = rules[n](field(n).value);
    const ok = r === true;
    setInvalid((cur) => ({ ...cur, [n]: !ok }));
    setErrors((cur) => ({ ...cur, [n]: ok ? "" : (r as string) }));
    return ok;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const bad = KEYS.filter((n) => !check(n));
    if (bad.length) {
      field(bad[0]).focus();
      return;
    }
    const form = formRef.current!;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setLoading(true);
    try {
      if (!CONFIG.formEndpoint) throw new Error("CONFIG.formEndpoint is empty — form is not connected to a backend yet.");
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, source: location.href }),
      });
      if (!res.ok) throw new Error("Server responded " + res.status);
      form.reset();
      setInvalid({});
      setErrors({});
      setStatus({ cls: "ok", body: `Thanks, ${data.name.split(" ")[0]}. Your enquiry has been sent. We'll get back to you soon.` });
    } catch (err) {
      console.warn("[Salad Street] Enquiry not sent:", (err as Error).message);
      setStatus({
        cls: "bad",
        body: waLink() ? (
          <>
            Your enquiry wasn&apos;t sent. Please try again, or{" "}
            <a href={waLink(enquiryText(data))} target="_blank" rel="noopener">
              send it on WhatsApp
            </a>
            .
          </>
        ) : (
          <>Your enquiry wasn&apos;t sent. Please try again, or call us.</>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const inv = (n: string) => (n in invalid ? invalid[n] : undefined);
  const blur = (n: string) => () => {
    if (field(n).value) check(n);
  };

  return (
    <form className="enquiry" noValidate data-form ref={formRef} onSubmit={onSubmit}>
      <div className="f-two">
        <div className="field">
          <label className="sr" htmlFor={`${pfx}-name`}>
            Your name
          </label>
          <input id={`${pfx}-name`} name="name" placeholder="Your Name" autoComplete="name" aria-describedby={`${pfx}-name-e`} aria-invalid={inv("name")} onBlur={blur("name")} />
          <p className="err" id={`${pfx}-name-e`}>
            {errors.name}
          </p>
        </div>
        <div className="field">
          <label className="sr" htmlFor={`${pfx}-email`}>
            Email address
          </label>
          <input id={`${pfx}-email`} name="email" type="email" placeholder="Email Address" autoComplete="email" aria-describedby={`${pfx}-email-e`} aria-invalid={inv("email")} onBlur={blur("email")} />
          <p className="err" id={`${pfx}-email-e`}>
            {errors.email}
          </p>
        </div>
      </div>
      <div className="field">
        <label className="sr" htmlFor={`${pfx}-phone`}>
          Phone number
        </label>
        <input id={`${pfx}-phone`} name="phone" type="tel" inputMode="tel" placeholder="Phone Number" autoComplete="tel" aria-describedby={`${pfx}-phone-e`} aria-invalid={inv("phone")} onBlur={blur("phone")} />
        <p className="err" id={`${pfx}-phone-e`}>
          {errors.phone}
        </p>
      </div>
      <div className="field">
        <label className="sr" htmlFor={`${pfx}-type`}>
          Requirement type
        </label>
        <select id={`${pfx}-type`} name="type" aria-describedby={`${pfx}-type-e`} aria-invalid={inv("type")} onBlur={blur("type")} defaultValue="">
          <option value="">Select Requirement Type</option>
          {REQUIREMENTS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <p className="err" id={`${pfx}-type-e`}>
          {errors.type}
        </p>
      </div>
      <div className="field">
        <label className="sr" htmlFor={`${pfx}-msg`}>
          Your requirement
        </label>
        <textarea id={`${pfx}-msg`} name="message" placeholder="Your Requirement" aria-describedby={`${pfx}-msg-e`} aria-invalid={inv("message")} onBlur={blur("message")} />
        <p className="err" id={`${pfx}-msg-e`}>
          {errors.message}
        </p>
      </div>
      <button className={`btn btn-solid submit${loading ? " loading" : ""}`} type="submit" disabled={loading}>
        <span className="spin" aria-hidden="true" />
        <span className="lbl">{loading ? "Sending…" : "Submit Now"}</span>
        <Icon k="arrow" size={18} />
      </button>
      <div className={`f-status${status ? " " + status.cls : ""}`} role="status" aria-live="polite">
        {status?.body}
      </div>
    </form>
  );
}

export function QueryBlock() {
  return (
    <div className="query">
      <Media src="images/decor/query-salad.webp" label="Decor · salad bowl" alt="" cls="query-deco" />
      <div className="query-in">
        <h2>Have Any Query?</h2>
        <p className="sub">Tell us what you need. We&apos;ll get back to you.</p>
        <EnquiryForm pfx="q" />
        <div className="contact-cta">
          <Cta label="Contact Us" href="/contact" />
        </div>
      </div>
    </div>
  );
}

