/* =====================================================================
   MEDIA — every demo photo/video used by the site lives here.
   TEMPORARY royalty-free demo assets (Unsplash photos, Pexels video, both free
   to use under their licences). To use a real client photo, drop the file in
   /public/images/... and replace the URL below with its path, e.g.
   "fresh": "/images/why/fresh.webp".
   ===================================================================== */

/** Unsplash photo by id, resized by the Unsplash CDN (auto WebP/AVIF). */
export const un = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export const BLOG_IMG: Record<string, string> = {
  "5-healthy-salad-ideas": un("1540420773420-3366772f4999", 760, 480),
  "why-fresh-ingredients-matter": un("1488459716781-31db52582fe9", 760, 480),
  "from-farm-to-your-bowl": un("1508857650881-64475119d798", 760, 480),
  "nutrition-tips-healthier-you": un("1600335895229-6e75511892c8", 760, 480),
};

export const WHY_IMG: Record<string, string> = {
  fresh: un("1566385101042-1a0aa0c1268c", 560, 320),
  nopres: un("1557844352-761f2565b576", 560, 320),
  healthy: un("1547496502-affa22d38842", 560, 320),
  variety: un("1591586116988-62fe65164f8d", 560, 320),
};

export const SCENE = {
  /** "From Our Farm to Your Plate" image + video poster */
  farm: un("1708796705570-33fd29ef67d0", 1100, 720),
  /** Green "farm process" band background */
  harvest: un("1519897831810-a9a01aceccd1", 1600, 700),
  /** Newsletter band side images */
  greens: un("1572449043416-55f4685c9bb7", 600, 600),
};

/** Temporary farm video (Pexels #3195351, free licence). Loaded only when the visitor presses play. */
export const FARM_VIDEO = {
  src: "https://videos.pexels.com/video-files/3195351/3195351-hd_1280_720_25fps.mp4",
  credit: "Video: Pressmaster / Pexels (temporary)",
};
