/**
 * Ubah nama produk menjadi slug URL. Fungsi murni, wajib diuji.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 170);
}
