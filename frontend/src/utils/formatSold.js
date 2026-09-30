import { formatRupiah } from "./formatRupiah.js";

/**
 * Tulis jumlah terjual ringkas: 1240 menjadi "1,2rb". Fungsi murni.
 * @param {number} value
 * @returns {string}
 */
export function formatSoldCount(value) {
  if (!Number.isFinite(value) || value < 1000) return String(value ?? 0);
  const short = (value / 1000).toFixed(1).replace(".", ",").replace(",0", "");
  return `${short}rb`;
}

export { formatRupiah };
