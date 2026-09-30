import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("mengubah nama menjadi slug", () => {
    expect(slugify("Buket Rose Blush")).toBe("buket-rose-blush");
    expect(slugify("  Hampers Sweet Day! ")).toBe("hampers-sweet-day");
  });

  it("membuang aksen dan karakter khusus", () => {
    expect(slugify("Bunga Papan Élite & Co.")).toBe("bunga-papan-elite-co");
  });
});
