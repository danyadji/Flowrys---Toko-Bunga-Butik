// Variabel lingkungan publik. Tidak ada secret di sini.
export const env = {
  mode: import.meta.env.MODE,
  apiUrl: (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, ""),
};
