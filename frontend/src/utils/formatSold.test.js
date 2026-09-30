import { describe, expect, it } from "vitest";
import { formatSoldCount } from "./formatSold";

describe("formatSoldCount", () => {
  it("menyingkat ribuan dengan koma", () => {
    expect(formatSoldCount(1240)).toBe("1,2rb");
    expect(formatSoldCount(1000)).toBe("1rb");
  });

  it("membiarkan angka kecil apa adanya", () => {
    expect(formatSoldCount(860)).toBe("860");
  });
});
