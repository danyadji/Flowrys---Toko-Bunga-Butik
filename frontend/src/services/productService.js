import { env } from "../config/env.js";
import { demoAdapter } from "./adapters/demoAdapter.js";
import { httpAdapter } from "./adapters/httpAdapter.js";

// Kontrak service dikunci (TASKS 1.2). VITE_DATA_SOURCE=demo memakai
// localStorage, =api memakai backend Laravel. Komponen tidak berubah.
export const productService = env.isDemo ? demoAdapter : httpAdapter;
