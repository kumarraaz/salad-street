import type { Metadata } from "next";
import { CONFIG, waLink } from "@/lib/data";
import { Icon, PageHero } from "@/components/ui";
import { ContactRows } from "@/components/ContactRows";
import { EnquiryForm } from "@/components/Enquiry";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  const wa = waLink();
  return (
    <>
      <PageHero
        title="Contact Us"
        sub="Questions, bulk orders or a farm visit — send us your requirement."
        trail={[{ label: "Contact Us" }]}
      />
      <section className="sec">
        <div className="wrap split">
          <div className="info-card">
            <h2 style={{ fontSize: "20px", color: "var(--g9)" }}>Get in touch</h2>
            <ContactRows />
            <div className="btns">
              {wa ? (
                <a className="btn btn-solid btn-sm" data-wa href={wa} target="_blank" rel="noopener">
                  <Icon k="phone" size={16} />
                  WhatsApp us
                </a>
              ) : (
                <a className="btn btn-solid btn-sm" data-wa href="#" data-missing="whatsapp">
                  <Icon k="phone" size={16} />
                  WhatsApp us
                </a>
              )}
              {CONFIG.phoneTel ? (
                <a className="btn btn-outline btn-sm" data-call href={`tel:${CONFIG.phoneTel}`}>
                  Call us
                </a>
              ) : (
                <a className="btn btn-outline btn-sm" data-call href="#" data-missing="phone">
                  Call us
                </a>
              )}
            </div>
          </div>
          <div className="form-card">
            <h2 style={{ fontSize: "22px", color: "var(--g9)", marginBottom: "14px" }}>Have Any Query?</h2>
            <EnquiryForm pfx="c" />
          </div>
        </div>
      </section>
    </>
  );
}
