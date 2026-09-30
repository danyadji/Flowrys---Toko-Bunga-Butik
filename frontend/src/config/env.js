// Variabel lingkungan publik. Tidak ada secret di sini (aturan 1.1 nomor 9).
// VITE_DATA_SOURCE=demo memakai localStorage, =api memakai backend Laravel.
export const env = {
  mode: import.meta.env.MODE,
  dataSource: import.meta.env.VITE_DATA_SOURCE ?? "demo",
  isDemo: (import.meta.env.VITE_DATA_SOURCE ?? "demo") === "demo",
  apiUrl:
    (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, ""),
  adminEmail: import.meta.env.VITE_DEMO_ADMIN_EMAIL ?? "admin@demo.com",
};
