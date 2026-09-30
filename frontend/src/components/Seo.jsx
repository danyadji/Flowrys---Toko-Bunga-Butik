import { useEffect } from "react";

const SITE_NAME = "Flowrys";

/**
 * Judul dan meta per halaman (M2-19). Tanpa dependensi tambahan.
 */
export function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", title ?? SITE_NAME);
  }, [title, description]);
  return null;
}
