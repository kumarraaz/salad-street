import { CONFIG } from "@/lib/data";
import { Icon } from "./ui";

/* Rows with no confirmed value are hidden. */
export function ContactRows() {
  return (
    <>
      {CONFIG.phoneDisplay ? (
      <div className="info-row">
        <Icon k="phone" size={18} />
        <span>
          {(
            <>
              <a href={`tel:${CONFIG.phoneTel}`}>{CONFIG.phoneDisplay}</a>
              {CONFIG.phone2Display ? (
                <>
                  {" · "}
                  <a href={`tel:${CONFIG.phone2Tel}`}>{CONFIG.phone2Display}</a>
                </>
              ) : null}
            </>
          )}
        </span>
      </div>
      ) : null}
      {CONFIG.email ? (
        <div className="info-row">
          <Icon k="mail" size={18} />
          <span>
            <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
          </span>
        </div>
      ) : null}
      {CONFIG.address ? (
        <div className="info-row">
          <Icon k="pin" size={18} />
          <span>{CONFIG.address}</span>
        </div>
      ) : null}
    </>
  );
}
