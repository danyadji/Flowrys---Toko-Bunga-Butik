import { env } from "../config/env.js";
import { TOKEN_KEY } from "./adapters/httpAdapter.js";

// Autentikasi token Sanctum. Token kedaluwarsa atau dicabut membuat sesi
// berakhir dan admin diarahkan ke login.
export const authService = {
  async login({ email, password }) {
    const res = await fetch(`${env.apiUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = new Error("Email atau kata sandi salah.");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }
    const json = await res.json();
    localStorage.setItem(TOKEN_KEY, json.token);
    localStorage.setItem(
      "flowrys.session",
      JSON.stringify({ user: json.user }),
    );
    return { user: json.user, token: json.token };
  },

  async logout() {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      await fetch(`${env.apiUrl}/admin/logout`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
    } catch {
      // Token tidak valid pun sesi lokal tetap dibersihkan.
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("flowrys.session");
  },

  async getSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      const res = await fetch(`${env.apiUrl.replace(/\/v1$/, "")}/user`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("flowrys.session");
        return null;
      }
      const user = await res.json();
      if (user.role && user.role !== "admin") return null;
      return { email: user.email, role: user.role ?? "admin" };
    } catch {
      try {
        return JSON.parse(localStorage.getItem("flowrys.session")).user ?? null;
      } catch {
        return null;
      }
    }
  },
};
