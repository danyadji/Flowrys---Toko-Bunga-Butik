import { z } from "zod";
import { slugify } from "../../utils/slugify.js";

// Validasi form admin (M4-08). Unik slug dicek terhadap daftar yang ada
// lewat factory agar pesan error menempel di field slug.
export function adminProductSchema(existingSlugs = [], ignoreId = null) {
  const taken = new Set(
    existingSlugs.filter((s) => s.id !== ignoreId).map((s) => s.slug),
  );
  return z
    .object({
      name: z.string().trim().min(1, "Nama produk wajib diisi.").max(150),
      slug: z
        .string()
        .trim()
        .min(1, "Slug wajib diisi.")
        .max(170)
        .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip.")
        .refine((v) => !taken.has(v || slugify(v)), {
          message: "Slug sudah dipakai produk lain.",
        }),
      categoryId: z.string().min(1, "Pilih kategori."),
      price: z.coerce.number().int("Harga harus bilangan bulat.").positive("Harga harus lebih dari 0."),
      originalPrice: z
        .union([z.coerce.number().int().positive(), z.literal(""), z.undefined(), z.null()])
        .optional(),
      description: z.string().max(2000, "Maksimal 2000 karakter.").default(""),
      badge: z.enum(["none", "terlaris", "baru"]).default("none"),
      isFeatured: z.boolean().default(false),
      isAvailable: z.boolean().default(true),
      images: z.array(z.string().min(1)).min(1, "Minimal 1 gambar.").max(6, "Maksimal 6 gambar."),
    })
    .superRefine((data, ctx) => {
      const original = Number(data.originalPrice);
      if (data.originalPrice !== "" && data.originalPrice != null && Number.isFinite(original)) {
        if (original <= data.price) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["originalPrice"],
            message: "Harga coret harus lebih besar dari harga jual.",
          });
        }
      }
    });
}

export function toServiceInput(values) {
  const original = Number(values.originalPrice);
  return {
    name: values.name.trim(),
    slug: (values.slug || slugify(values.name)).trim(),
    categoryId: values.categoryId,
    price: Number(values.price),
    ...(values.originalPrice !== "" &&
    values.originalPrice != null &&
    Number.isFinite(original)
      ? { originalPrice: original }
      : {}),
    description: values.description ?? "",
    badge: values.badge === "none" ? null : values.badge,
    isFeatured: Boolean(values.isFeatured),
    isAvailable: Boolean(values.isAvailable),
    images: values.images,
  };
}
