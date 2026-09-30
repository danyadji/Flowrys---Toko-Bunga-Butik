import { describe, expect, it, beforeEach } from "vitest";
import { productService } from "./productService";

beforeEach(async () => {
  localStorage.clear();
  await productService.resetDemoData();
});

describe("productService.getProducts", () => {
  it("mengembalikan bentuk { data, meta } seperti kontrak API", async () => {
    const res = await productService.getProducts({ pageSize: 5 });
    expect(res.data).toHaveLength(5);
    expect(res.meta.total).toBe(18);
    expect(res.meta).toMatchObject({ current_page: 1 });
  });

  it("filter, cari, dan sort dapat dikombinasikan", async () => {
    const res = await productService.getProducts({
      category: "c1",
      search: "buket",
      sort: "price-asc",
      pageSize: 20,
    });
    expect(res.meta.total).toBeGreaterThan(0);
    expect(res.data.every((p) => p.categoryId === "c1")).toBe(true);
    const prices = res.data.map((p) => p.price);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it("sort terpopuler memakai soldCount", async () => {
    const res = await productService.getProducts({
      sort: "popular",
      pageSize: 20,
    });
    expect(res.data[0].soldCount).toBeGreaterThanOrEqual(
      res.data[res.data.length - 1].soldCount,
    );
  });
});

describe("productService CRUD", () => {
  it("getProductBySlug melempar NOT_FOUND untuk slug asing", async () => {
    await expect(
      productService.getProductBySlug("tidak-ada"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("create lalu update lalu delete", async () => {
    const created = await productService.createProduct({
      name: "Buket Uji Coba",
      categoryId: "c1",
      price: 100000,
      description: "Produk untuk tes.",
      images: ["/images/products/uji.webp"],
      isAvailable: true,
      isFeatured: false,
    });
    expect(created.slug).toBe("buket-uji-coba");

    const updated = await productService.updateProduct(created.id, {
      price: 120000,
    });
    expect(updated.price).toBe(120000);

    await productService.setAvailability(created.id, false);
    const fetched = await productService.getProductBySlug(updated.slug);
    expect(fetched.isAvailable).toBe(false);

    await productService.deleteProduct(created.id);
    await expect(
      productService.getProductBySlug(updated.slug),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("slug duplikat dibuat unik otomatis", async () => {
    const base = {
      name: "Buket Rose Blush",
      categoryId: "c1",
      price: 100000,
      images: ["/images/products/uji.webp"],
    };
    const created = await productService.createProduct(base);
    expect(created.slug).not.toBe("buket-rose-blush");
  });
});
