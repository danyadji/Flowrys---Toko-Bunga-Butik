import { slugify } from "../../utils/slugify.js";
import { localStorageAdapter } from "./localStorageAdapter.js";

// Implementasi demo (Fase 1): localStorage. Dipilih lewat productService
// saat VITE_DATA_SOURCE=demo. Komponen tidak berubah.
const adapter = localStorageAdapter;

function applyQuery(products, { category, search, sort }) {
  let list = [...products];
  if (category) {
    list = list.filter((p) => p.categoryId === category);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q),
    );
  }
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      list.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
      break;
    case "newest":
    default:
      list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      break;
  }
  return list;
}

function uniqueSlug(products, base, ignoreId) {
  let slug = base;
  let n = 2;
  const taken = new Set(
    products.filter((p) => p.id !== ignoreId).map((p) => p.slug),
  );
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export const demoAdapter = {
  async getProducts({ category, search, sort, page = 1, pageSize = 12 } = {}) {
    const db = await adapter.read();
    const filtered = applyQuery(db.products, { category, search, sort });
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), lastPage);
    const data = filtered.slice(
      (safePage - 1) * pageSize,
      safePage * pageSize,
    );
    return {
      data,
      meta: { current_page: safePage, last_page: lastPage, total },
    };
  },

  async getProductBySlug(slug) {
    const db = await adapter.read();
    const product = db.products.find((p) => p.slug === slug);
    if (!product) {
      const error = new Error("Produk tidak ditemukan.");
      error.code = "NOT_FOUND";
      throw error;
    }
    return product;
  },

  async getFeaturedProducts() {
    const db = await adapter.read();
    return db.products.filter((p) => p.isFeatured);
  },

  async getCategories() {
    const db = await adapter.read();
    return db.categories;
  },

  async createProduct(input) {
    const db = await adapter.read();
    const now = new Date().toISOString();
    const product = {
      ...input,
      id: `p-${Date.now()}`,
      slug: uniqueSlug(db.products, input.slug || slugify(input.name)),
      createdAt: now,
      updatedAt: now,
    };
    db.products.unshift(product);
    await adapter.write(db);
    return product;
  },

  async updateProduct(id, input) {
    const db = await adapter.read();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      const error = new Error("Produk tidak ditemukan.");
      error.code = "NOT_FOUND";
      throw error;
    }
    const current = db.products[index];
    const base = input.slug || slugify(input.name ?? current.name);
    const updated = {
      ...current,
      ...input,
      slug: uniqueSlug(db.products, base, id),
      updatedAt: new Date().toISOString(),
    };
    db.products[index] = updated;
    await adapter.write(db);
    return updated;
  },

  async deleteProduct(id) {
    const db = await adapter.read();
    db.products = db.products.filter((p) => p.id !== id);
    await adapter.write(db);
  },

  async setAvailability(id, isAvailable) {
    const db = await adapter.read();
    const product = db.products.find((p) => p.id === id);
    if (!product) {
      const error = new Error("Produk tidak ditemukan.");
      error.code = "NOT_FOUND";
      throw error;
    }
    product.isAvailable = isAvailable;
    product.updatedAt = new Date().toISOString();
    await adapter.write(db);
    return product;
  },

  async resetDemoData() {
    await adapter.reset();
  },
};
