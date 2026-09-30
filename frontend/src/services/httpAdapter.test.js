import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOKEN_KEY, httpAdapter } from "./adapters/httpAdapter.js";

function jsonResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

const apiProduct = {
  id: 1,
  name: "Buket Rose Blush",
  slug: "buket-rose-blush",
  category: { id: 1, name: "Buket Bunga", slug: "buket" },
  price: 250000,
  original_price: null,
  description: "Segar.",
  images: ["/images/products/buket-rose-blush.webp"],
  rating: 4.9,
  sold_count: 1240,
  badge: "terlaris",
  is_available: true,
  is_featured: true,
  created_at: "",
  updated_at: "",
};

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

describe("httpAdapter", () => {
  it("memetakan produk API ke bentuk frontend", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(jsonResponse({ data: [{ id: 1, name: "Buket Bunga", slug: "buket" }] }))
      .mockResolvedValueOnce(
        jsonResponse({ data: [apiProduct], meta: { current_page: 1, last_page: 1, total: 1 } }),
      );
    const res = await httpAdapter.getProducts({ category: 1, sort: "popular" });
    expect(res.data[0]).toMatchObject({
      categoryId: 1,
      soldCount: 1240,
      isAvailable: true,
    });
    expect(res.meta.total).toBe(1);
    expect(globalThis.fetch.mock.calls[1][0]).toContain("category=buket");
  });

  it("melempar NOT_FOUND untuk slug asing", async () => {
    globalThis.fetch.mockResolvedValueOnce(jsonResponse({ message: "x" }, 404));
    await expect(httpAdapter.getProductBySlug("tidak-ada")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("mengirim token pada endpoint admin", async () => {
    localStorage.setItem(TOKEN_KEY, "token-rahasia");
    globalThis.fetch.mockResolvedValueOnce(jsonResponse({ data: apiProduct }, 201));
    await httpAdapter.createProduct({
      name: "Baru",
      slug: "baru",
      categoryId: 1,
      price: 100000,
      images: [],
    });
    const [, options] = globalThis.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer token-rahasia");
    expect(options.method).toBe("POST");
  });

  it("resetDemoData tidak didukung", async () => {
    await expect(httpAdapter.resetDemoData()).rejects.toThrow();
  });
});
