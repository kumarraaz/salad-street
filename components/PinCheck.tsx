"use client";

import { useState } from "react";
import { FREE_DELIVERY_MIN, checkPin, type PinResult } from "@/lib/delivery";
import { inr } from "@/lib/data";
import { Icon } from "./ui";

/** Message for a pin code result. `total` is the cart value (for the Gurugram free-delivery line). */
export function PinMsg({ r, total }: { r: PinResult; total?: number }) {
  if (r.status === "empty") return null;
  if (r.status === "invalid") return <p className="pin-msg">Enter a 6-digit pin code.</p>;
  if (r.status === "no")
    return (
      <p className="pin-msg no" role="alert">
        <Icon k="x" size={15} /> Not deliverable to this pin code. We deliver only in Delhi NCR right now.
      </p>
    );
  const short = total != null && total < FREE_DELIVERY_MIN ? FREE_DELIVERY_MIN - total : 0;
  return (
    <p className="pin-msg ok" role="status">
      <Icon k="check" size={15} /> We deliver to {r.area}.{" "}
      {r.free
        ? total == null
          ? `Free delivery on orders of ${inr(FREE_DELIVERY_MIN)} or more.`
          : short
            ? `Add ${inr(short)} more for free delivery.`
            : "Your delivery is FREE."
        : "Delivery charge is confirmed on WhatsApp."}
    </p>
  );
}

/** Stand-alone "Check delivery" box for product pages. */
export default function PinCheck() {
  const [pin, setPin] = useState("");
  return (
    <div className="pin-check">
      <label>
        <span>
          <Icon k="pin" size={15} /> Check delivery
        </span>
        <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="Enter pin code" aria-label="Pin code" maxLength={6} />
      </label>
      <PinMsg r={checkPin(pin)} />
    </div>
  );
}
