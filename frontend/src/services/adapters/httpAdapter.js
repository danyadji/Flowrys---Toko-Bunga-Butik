import { env } from "../../config/env.js";

// Adapter HTTP (Fase 2, M6-11): implementasi kontrak service 1.2 yang sama
// terhadap Laravel REST API. Bentuk snake_case API dipetakan ke camelCase
// frontend di satu tempat ini.
const TOKEN_KEY = "flowrys.api-token";

function baseUrl() {
  return env.apiUrl.replace(/\/$/, "");
}

function apiToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body, auth = false, timeoutMs = 30000 } = {}) {
  const headers = { Accept: "application/json" };
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";
  const token = apiToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const error = new Error(
      err?.name === "AbortError"
        ? "Server tidak merespons. Pastikan backend jalan lalu coba lagi."
        : "Tidak tersambung ke server. Pastikan backend jalan.",
    );
    error.code = "NETWORK_ERROR";
    throw error;
  }
  clearTimeout(timer);

  if (res.status === 404) {
    const error = new Error("Produk tidak ditemukan.");
    error.code = "NOT_FOUND";
    throw error;
  }
  if (res.status === 401 || res.status === 419) {
    const error = new Error("Sesi berakhir. Masuk lagi.");
    error.code = "UNAUTHORIZED";
    throw error;
  }
  if (res.status === 403) {
    const error = new Error("Akses ditolak.");
    error.code = "FORBIDDEN";
    throw error;
  }
  if (!res.ok) {
    const error = new Error("Permintaan gagal.");
    try {
      const json = await res.json();
      error.fields = json.errors;
      if (json.message) error.message = json.message;
    } catch {
      // biarkan pesan bawaan
    }
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
}

function mapProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.category?.id ?? p.category_id,
    price: p.price,
    ...(p.original_price != null ? { originalPrice: p.original_price } : {}),
    description: p.description ?? "",
    images: p.images ?? [],
    rating: p.rating ?? 0,
    soldCount: p.sold_count ?? 0,
    badge: p.badge ?? null,
    isAvailable: Boolean(p.is_available),
    isFeatured: Boolean(p.is_featured),
    createdAt: p.created_at ?? "",
    updatedAt: p.updated_at ?? "",
  };
}

let categoryCache = null;

async function categoriesById() {
  if (!categoryCache) {
    const json = await request("/categories");
    categoryCache = new Map(json.data.map((c) => [String(c.id), c.slug]));
  }
  return categoryCache;
}

async function resolveCategorySlug(category) {
  if (!category) return undefined;
  const map = await categoriesById();
  return map.get(String(category)) ?? String(category);
}

export const httpAdapter = {
  async getProducts({ category, search, sort, page = 1, pageSize = 12 } = {}) {
    const params = new URLSearchParams();
    const slug = await resolveCategorySlug(category);
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    const json = await request(`/products?${params.toString()}`);
    return {
      data: json.data.map(mapProduct),
      meta: {
        current_page: json.meta.current_page,
        last_page: json.meta.last_page,
        total: json.meta.total,
      },
    };
  },

  async getProductBySlug(slug) {
    const json = await request(`/products/${encodeURIComponent(slug)}`);
    return mapProduct(json.data);
  },

  async getFeaturedProducts() {
    const json = await request("/products?pageSize=100");
    return json.data.map(mapProduct).filter((p) => p.isFeatured);
  },

  async getCategories() {
    const json = await request("/categories");
    return json.data;
  },

  async createProduct(input) {
    const json = await request(
      "/admin/products",
      {
        method: "POST",
        auth: true,
        body: {
          name: input.name,
          slug: input.slug,
          category_id: input.categoryId,
          price: input.price,
          original_price: input.originalPrice ?? null,
          description: input.description ?? "",
          badge: input.badge,
          is_available: input.isAvailable ?? true,
          is_featured: input.isFeatured ?? false,
          images: input.images ?? [],
        },
      },
    );
    return mapProduct(json.data);
  },

  async updateProduct(id, input) {
    const body = {};
    if (input.name !== undefined) body.name = input.name;
    if (input.slug !== undefined) body.slug = input.slug;
    if (input.categoryId !== undefined) body.category_id = input.categoryId;
    if (input.price !== undefined) body.price = input.price;
    if (input.originalPrice !== undefined) body.original_price = input.originalPrice;
    if (input.description !== undefined) body.description = input.description;
    if (input.badge !== undefined) body.badge = input.badge;
    if (input.isAvailable !== undefined) body.is_available = input.isAvailable;
    if (input.isFeatured !== undefined) body.is_featured = input.isFeatured;
    const json = await request(`/admin/products/${id}`, {
      method: "PUT",
      auth: true,
      body,
    });
    return mapProduct(json.data);
  },

  async deleteProduct(id) {
    await request(`/admin/products/${id}`, { method: "DELETE", auth: true });
  },

  async setAvailability(id, isAvailable) {
    const json = await request(`/admin/products/${id}/availability`, {
      method: "PATCH",
      auth: true,
      body: { is_available: isAvailable },
    });
    return mapProduct(json.data);
  },

  async listImages(productId) {
    const json = await request(`/admin/products/${productId}/images`, { auth: true });
    return json.data;
  },

  async uploadImage(productId, file) {
    const form = new FormData();
    form.append("image", file);
    const json = await request(`/admin/products/${productId}/images`, {
      method: "POST",
      auth: true,
      body: form,
    });
    return json;
  },

  async deleteImage(productId, imageId) {
    await request(`/admin/products/${productId}/images/${imageId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  async createCategory(input) {
    categoryCache = null;
    const json = await request("/admin/categories", {
      method: "POST",
      auth: true,
      body: { name: input.name, slug: input.slug || undefined, image: input.image || undefined, description: input.description || undefined },
    });
    return json.data;
  },

  async updateCategory(id, input) {
    categoryCache = null;
    const json = await request(`/admin/categories/${id}`, {
      method: "PUT",
      auth: true,
      body: input,
    });
    return json.data;
  },

  async uploadCategoryImage(id, file) {
    categoryCache = null;
    const form = new FormData();
    form.append("image", file);
    const json = await request(`/admin/categories/${id}/image`, {
      method: "POST",
      auth: true,
      body: form,
    });
    return json;
  },

  async deleteCategory(id) {
    categoryCache = null;
    await request(`/admin/categories/${id}`, { method: "DELETE", auth: true });
  },

  async resetDemoData() {
    throw new Error("Reset hanya tersedia di mode demo.");
  },
};

export { TOKEN_KEY };
