/* =====================================================================
   MEDIA — every demo photo/video used by the site lives here.
   TEMPORARY royalty-free demo assets (Unsplash photos, Pexels video, both free
   to use under their licences). To use a real client photo, drop the file in
   /public/images/... and replace the URL below with its path, e.g.
   "red-radish": "/images/products/red-radish.webp".
   ===================================================================== */

/** Unsplash photo by id, resized by the Unsplash CDN (auto WebP/AVIF). */
export const un = (id: string, w = 800, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

export const PRODUCT_IMG: Record<string, string> = {
  "red-radish": un("1681307733509-16caf15dcbb1", 640, 480),
  "sambar-onion": un("1639176267141-2ff48087e1be", 640, 480),
  onion: un("1618512496248-a07fe83aa8cb", 640, 480),
  garlic: un("1654727433983-1b72489e291e", 640, 480),
  "baby-potato": un("1594885270227-c61f9bc1383d", 640, 480),
  potato: un("1518977676601-b53f82aba655", 640, 480),
  "sweet-potato": un("1730815048561-45df6f7f331d", 640, 480),
  "english-carrot": un("1598170845058-32b9d6a5da37", 640, 480),
};

export const CATEGORY_IMG: Record<string, string> = {
  "fresh-salads": un("1512621776951-a57141f2eefd", 520, 420),
  "cut-fruits": un("1519996529931-28324d5a630e", 520, 420),
  vegetables: un("1597362925123-77861d3fbac7", 520, 420),
  "salad-dressings": un("1474979266404-7eaacbcd87c5", 520, 420),
  "healthy-snacks": un("1543158181-1274e5362710", 520, 420),
  "combo-packs": un("1635341083777-5f93a755e916", 520, 420),
};

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
