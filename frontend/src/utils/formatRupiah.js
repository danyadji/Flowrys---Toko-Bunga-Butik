/**
 * Format angka rupiah tanpa desimal. Fungsi murni, wajib diuji.
 * @param {number} value
 * @returns {string}
 */
export function formatRupiah(value) {
  if (!Number.isFinite(value)) return "Rp0";
  return (
    "Rp" +
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

/**
 * Hitung persen diskon dari harga coret. 0 bila tidak ada diskon.
 * @param {number} price
 * @param {number | null | undefined} originalPrice
 * @returns {number}
 */
export function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
