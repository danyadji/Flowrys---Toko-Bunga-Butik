import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { TOKEN_KEY } from "../services/adapters/httpAdapter.js";

function setup(path = "/admin") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/login" element={<p>Halaman login</p>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <p>Area admin</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  it("mengarahkan ke login bila belum ada sesi", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Halaman login")).toBeInTheDocument();
    });
  });

  it("menampilkan konten bila token valid", async () => {
    localStorage.setItem(TOKEN_KEY, "token-valid");
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ email: "admin@tokomu.com", role: "admin" }),
    });
    setup();
    await waitFor(() => {
      expect(screen.getByText("Area admin")).toBeInTheDocument();
    });
  });

  it("mengarahkan ke login bila token ditolak server", async () => {
    localStorage.setItem(TOKEN_KEY, "token-basi");
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    setup();
    await waitFor(() => {
      expect(screen.getByText("Halaman login")).toBeInTheDocument();
    });
    expect(localStorage.getItem(TOKEN_KEY)).toBe(null);
  });
});
