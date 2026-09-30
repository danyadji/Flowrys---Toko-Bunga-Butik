import { env } from "../config/env.js";
import { TOKEN_KEY } from "./adapters/httpAdapter.js";

// Autentikasi mock (D9). Simulasi login admin untuk demo Fase 1, bukan
// pengamanan sungguhan. Hanya penanda sesi yang disimpan, bukan password.
const SESSION_KEY = "flowrys.demo-session";
const DEMO_PASSWORD = "demo123";

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const demoAuth = {
  async login({ email, password }) {
    await delay();
    if (email !== env.adminEmail || password !== DEMO_PASSWORD) {
      const error = new Error("Email atau kata sandi salah.");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }
    const user = { email, role: "admin" };
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user, loggedInAt: new Date().toISOString() }),
    );
    return { user, token: "demo-session" };
  },

  async logout() {
    await delay(100);
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession() {
    await delay(50);
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw).user ?? null;
    } catch {
      return null;
    }
  },
};

// Autentikasi token Sanctum (Fase 2, M6-12). Token kedaluwarsa atau dicabut
// membuat sesi berakhir dan admin diarahkan ke login.
const httpAuth = {
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
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: json.user }));
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
    localStorage.removeItem(SESSION_KEY);
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
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      const user = await res.json();
      if (user.role && user.role !== "admin") return null;
      return { email: user.email, role: user.role ?? "admin" };
    } catch {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY)).user ?? null;
      } catch {
        return null;
      }
    }
  },
};

export const authService = env.isDemo ? demoAuth : httpAuth;

export { DEMO_PASSWORD };
