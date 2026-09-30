import { z } from "zod";
import { validateDate, validateTime } from "../../utils/dateRules.js";
import { storeConfig } from "../../config/store.js";

// Batas panjang field (M3-11) agar pesan WhatsApp tidak membeludak.
const limits = {
  name: 100,
  address: 500,
  event: 150,
  landmark: 200,
  greeting: 200,
  note: 500,
};

const phoneRule = z
  .string()
  .trim()
  .min(1, "Nomor HP wajib diisi.")
  .regex(/^(\+62|62|0)8\d{7,11}$/, "Format nomor HP Indonesia tidak valid.");

const dateRule = z.string().min(1, "Tanggal wajib diisi.").superRefine((value, ctx) => {
  const res = validateDate(value, storeConfig.leadTimeDays);
  if (!res.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.reason });
});

const timeRule = z.string().min(1, "Jam wajib diisi.").superRefine((value, ctx) => {
  const res = validateTime(value, storeConfig.openHour, storeConfig.closeHour);
  if (!res.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.reason });
});

const buyerFields = {
  buyerName: z
    .string()
    .trim()
    .min(1, "Nama pemesan wajib diisi.")
    .max(limits.name, `Maksimal ${limits.name} karakter.`),
  buyerPhone: phoneRule,
};

// Validasi kondisional per metode (M3-04): field yang tersembunyi di form
// tidak ada di varian ini sehingga tidak ikut divalidasi.
export const checkoutSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("pickup"),
    ...buyerFields,
    date: dateRule,
    time: timeRule,
    greeting: z.string().max(limits.greeting, `Kartu ucapan maksimal ${limits.greeting} karakter.`).optional().default(""),
    note: z.string().max(limits.note, `Maksimal ${limits.note} karakter.`).optional().default(""),
  }),
  z.object({
    method: z.literal("delivery"),
    ...buyerFields,
    destination: z.enum(["Rumah", "Kantor", "Acara/Venue"], {
      message: "Pilih jenis tujuan.",
    }),
    event: z.string().max(limits.event, `Maksimal ${limits.event} karakter.`).optional().default(""),
    recipient: z
      .string()
      .trim()
      .min(1, "Nama penerima wajib diisi.")
      .max(limits.name, `Maksimal ${limits.name} karakter.`),
    recipientPhone: z
      .string()
      .trim()
      .regex(/^(\+62|62|0)8\d{7,11}$/, "Format nomor HP Indonesia tidak valid.")
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .trim()
      .min(1, "Alamat pengiriman wajib diisi.")
      .max(limits.address, `Maksimal ${limits.address} karakter.`),
    landmark: z.string().max(limits.landmark, `Maksimal ${limits.landmark} karakter.`).optional().default(""),
    date: dateRule,
    time: timeRule,
    greeting: z.string().max(limits.greeting, `Kartu ucapan maksimal ${limits.greeting} karakter.`).optional().default(""),
    note: z.string().max(limits.note, `Maksimal ${limits.note} karakter.`).optional().default(""),
  }),
]);

export { limits };
