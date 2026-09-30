import { z } from "zod";

// Skema Category dan Product (M1-19). Adapter memvalidasi data yang dibaca
// dari localStorage; bila tidak valid, kembali ke seed.
export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120),
});

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(150),
  slug: z.string().min(1).max(170),
  categoryId: z.string().min(1),
  price: z.number().int().positive(),
  originalPrice: z.number().int().positive().optional(),
  description: z.string().max(2000).default(""),
  images: z.array(z.string()).min(1).max(6),
  rating: z.number().min(0).max(5).default(0),
  soldCount: z.number().int().nonnegative().default(0),
  badge: z.enum(["terlaris", "baru"]).nullable().default(null),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
});

export const demoDbSchema = z.object({
  schemaVersion: z.literal(1),
  categories: z.array(categorySchema),
  products: z.array(productSchema),
});
