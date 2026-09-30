/**
 * Aturan tanggal dan jam checkout (PRD 6.4). Fungsi murni, wajib diuji.
 * Semua perbandingan memakai tanggal lokal tanpa jam.
 */

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Tanggal paling awal yang boleh dipilih (hari ini + leadTimeDays).
 * @param {number} leadTimeDays
 * @param {Date} [today]
 * @returns {Date}
 */
export function minDate(leadTimeDays, today = new Date()) {
  return startOfDay(addDays(today, leadTimeDays));
}

/**
 * Validasi tanggal pilihan terhadap lead time.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function validateDate(dateInput, leadTimeDays, today = new Date()) {
  const picked = startOfDay(new Date(dateInput));
  if (Number.isNaN(picked.getTime())) {
    return { ok: false, reason: "Tanggal tidak valid." };
  }
  if (picked < startOfDay(today)) {
    return { ok: false, reason: "Tanggal sudah lewat. Pilih tanggal ke depan." };
  }
  if (picked < minDate(leadTimeDays, today)) {
    return {
      ok: false,
      reason: `Pemesanan minimal H+${leadTimeDays}. Pilih tanggal yang lebih jauh.`,
    };
  }
  return { ok: true };
}

/**
 * Validasi jam (format "HH:MM") terhadap jam operasional toko.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function validateTime(timeInput, openHour, closeHour) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeInput ?? "");
  if (!match) return { ok: false, reason: "Jam tidak valid (format JJ:MM)." };
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < openHour || hour >= closeHour || minute < 0 || minute > 59) {
    return {
      ok: false,
      reason: `Jam layanan ${openHour}.00-${closeHour}.00. Pilih jam di rentang itu.`,
    };
  }
  return { ok: true };
}
