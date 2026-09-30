import { describe, expect, it } from "vitest";
import { discountPercent, formatRupiah } from "./formatRupiah";

describe("formatRupiah", () => {
  it("memformat ribuan dengan titik", () => {
    expect(formatRupiah(250000)).toBe("Rp250.000");
    expect(formatRupiah(1000)).toBe("Rp1.000");
    expect(formatRupiah(95000)).toBe("Rp95.000");
  });

  it("menangani input bukan angka", () => {
    expect(formatRupiah(NaN)).toBe("Rp0");
    expect(formatRupiah(undefined)).toBe("Rp0");
  });
});

describe("discountPercent", () => {
  it("menghitung persen dari harga coret", () => {
    expect(discountPercent(165000, 195000)).toBe(15);
  });

  it("nol bila tidak ada diskon", () => {
    expect(discountPercent(250000, undefined)).toBe(0);
    expect(discountPercent(250000, 200000)).toBe(0);
  });
});
