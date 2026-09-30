import { describe, expect, it } from "vitest";
import { adminProductSchema, toServiceInput } from "./adminProductSchema";

const base = {
  name: "Buket Uji",
  slug: "buket-uji",
  categoryId: "c1",
  price: 100000,
  originalPrice: "",
  description: "Deskripsi.",
  badge: "none",
  isFeatured: false,
  isAvailable: true,
  images: ["https://contoh.com/foto.webp"],
};

describe("adminProductSchema", () => {
  it("menerima input valid", () => {
    expect(adminProductSchema([]).safeParse(base).success).toBe(true);
  });

  it("menolak harga nol dan gambar kosong", () => {
    expect(adminProductSchema([]).safeParse({ ...base, price: 0 }).success).toBe(false);
    expect(adminProductSchema([]).safeParse({ ...base, images: [] }).success).toBe(false);
  });

  it("menolak harga coret di bawah harga jual", () => {
    const res = adminProductSchema([]).safeParse({ ...base, originalPrice: 50000 });
    expect(res.success).toBe(false);
  });

  it("menerima harga coret di atas harga jual", () => {
    expect(
      adminProductSchema([]).safeParse({ ...base, originalPrice: 150000 }).success,
    ).toBe(true);
  });

  it("menolak slug duplikat milik produk lain", () => {
    const schema = adminProductSchema([{ id: "p1", slug: "buket-uji" }]);
    expect(schema.safeParse(base).success).toBe(false);
  });

  it("mengizinkan slug sendiri saat edit", () => {
    const schema = adminProductSchema([{ id: "p1", slug: "buket-uji" }], "p1");
    expect(schema.safeParse(base).success).toBe(true);
  });
});

describe("toServiceInput", () => {
  it("mengubah badge none menjadi null dan membuang harga coret kosong", () => {
    const input = toServiceInput(base);
    expect(input.badge).toBe(null);
    expect(input).not.toHaveProperty("originalPrice");
  });
});
