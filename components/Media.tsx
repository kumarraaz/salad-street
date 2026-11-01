"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Image tile with a labelled placeholder behind it. Mirrors the original
 * `onerror="this.remove()"`: if the image file is missing, the placeholder stays.
 */
export default function Media({
  src,
  label,
  alt = "",
  cls = "",
}: {
  src?: string;
  label: string;
  alt?: string;
  cls?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image may have already errored before React hydrated.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  const url = src ? (src.startsWith("/") ? src : "/" + src) : "";
  return (
    <div className={`media ${cls}`} data-label={label}>
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={url} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : null}
    </div>
  );
}
