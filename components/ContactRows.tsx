import { CONFIG } from "@/lib/data";
import { Icon, Tbc } from "./ui";

export function ContactRows() {
  return (
    <>
      <div className="info-row">
        <Icon k="phone" size={18} />
        <span>
          {CONFIG.phoneDisplay ? (
            <a href={`tel:${CONFIG.phoneTel}`}>{CONFIG.phoneDisplay}</a>
          ) : (
            <Tbc t="Phone number to be confirmed" on />
          )}
        </span>
      </div>
      <div className="info-row">
        <Icon k="mail" size={18} />
        <span>
          {CONFIG.email ? <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a> : <Tbc t="Email to be confirmed" on />}
        </span>
      </div>
      <div className="info-row">
        <Icon k="pin" size={18} />
        <span>{CONFIG.address ? CONFIG.address : <Tbc t="Address to be confirmed" on />}</span>
      </div>
    </>
  );
}
