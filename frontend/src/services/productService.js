import { httpAdapter } from "./adapters/httpAdapter.js";

// Seluruh akses data lewat backend Laravel (kontrak service TASKS 1.2).
// Komponen tidak menyentuh fetch langsung.
export const productService = httpAdapter;
