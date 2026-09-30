import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./Home.jsx";

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/"]}>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Home", () => {
  it("render H1, navbar, dan footer tanpa error", async () => {
    setup();
    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { level: 1 }),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
