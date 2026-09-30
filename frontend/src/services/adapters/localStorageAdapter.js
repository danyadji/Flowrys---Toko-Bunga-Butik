import { categories as seedCategories } from "../../data/categories.js";
import { products as seedProducts } from "../../data/products.js";
import { demoDbSchema } from "../../schemas/product.js";

// Adapter localStorage (Fase 1). Satu-satunya kode yang menyentuh
// localStorage. Di Fase 2 diganti httpAdapter tanpa mengubah service.
// Kunci versi membuat data lama yang rusak otomatis kembali ke seed.
const STORAGE_KEY = "flowrys.demo-db.v1";

function seedDb() {
  return {
    schemaVersion: 1,
    categories: seedCategories,
    products: seedProducts,
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDb();
    const parsed = demoDbSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return seedDb();
    return parsed.data;
  } catch {
    return seedDb();
  }
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

/** Simulasi latensi kecil agar UI menangani loading sejak awal. */
function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const localStorageAdapter = {
  async read() {
    await delay();
    return loadDb();
  },

  async write(db) {
    await delay(100);
    saveDb(db);
    return db;
  },

  async reset() {
    await delay(100);
    const fresh = seedDb();
    saveDb(fresh);
    return fresh;
  },
};

export { STORAGE_KEY };
