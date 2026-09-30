import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

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
  });

  it("mengarahkan ke login bila belum ada sesi", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Halaman login")).toBeInTheDocument();
    });
  });

  it("menampilkan konten bila sesi ada", async () => {
    localStorage.setItem(
      "flowrys.demo-session",
      JSON.stringify({ user: { email: "admin@demo.com", role: "admin" } }),
    );
    setup();
    await waitFor(() => {
      expect(screen.getByText("Area admin")).toBeInTheDocument();
    });
  });
});
