// Satu-satunya sumber data toko (PRD 6.4, aturan 1.1 nomor 5).
// Semua teks yang sama (nomor WA, alamat, jam, lead time) dibaca dari sini.
export const storeConfig = {
  name: "Flowrys",
  // Nomor placeholder untuk demo publik. Ganti dengan nomor toko asli
  // sebelum dipakai produksi.
  whatsapp: "6281234567890",
  address: "Jl. Kenanga No. 12, Jakarta Selatan",
  hours: "09.00-19.00 WIB, Senin-Sabtu",
  openHour: 9,
  closeHour: 19,
  leadTimeDays: 1,
};

export function buildWhatsAppLink(message) {
  const number = (storeConfig.whatsapp || "").replace(/\D/g, "");
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
