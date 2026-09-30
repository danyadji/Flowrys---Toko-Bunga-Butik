import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./components/ui/Button.jsx";

describe("fondasi", () => {
  it("contoh tes lulus dan komponen Button tampil", () => {
    render(<Button>Uji tombol</Button>);
    expect(screen.getByRole("button", { name: "Uji tombol" })).toBeVisible();
  });
});
