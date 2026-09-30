import { describe, expect, it } from "vitest";
import { demoDbSchema, productSchema } from "./product";

describe("productSchema", () => {
  const valid = {
    id: "p01",
    name: "Buket Rose Blush",
    slug: "buket-rose-blush",
    categoryId: "c1",
    price: 250000,
    images: ["/images/products/buket-rose-blush.webp"],
  };

  it("menerima produk valid", () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it("menolak harga nol dan gambar kosong", () => {
    expect(
      productSchema.safeParse({ ...valid, price: 0 }).success,
    ).toBe(false);
    expect(productSchema.safeParse({ ...valid, images: [] }).success).toBe(
      false,
    );
  });

  it("menolak badge di luar daftar", () => {
    expect(
      productSchema.safeParse({ ...valid, badge: "promo" }).success,
    ).toBe(false);
  });
});

describe("demoDbSchema", () => {
  it("menolak versi skema yang tidak dikenal", () => {
    expect(
      demoDbSchema.safeParse({
        schemaVersion: 99,
        categories: [],
        products: [],
      }).success,
    ).toBe(false);
  });
});
