import { describe, expect, it } from "vitest";
import { minDate, validateDate, validateTime } from "./dateRules";

const TODAY = new Date(2026, 1, 10, 15, 0, 0);

describe("minDate", () => {
  it("minimal H+1 dari hari ini", () => {
    expect(minDate(1, TODAY).getDate()).toBe(11);
  });
});

describe("validateDate", () => {
  it("menolak tanggal lampau", () => {
    expect(validateDate("2026-02-09", 1, TODAY).ok).toBe(false);
  });

  it("menolak hari ini saat lead time H+1", () => {
    const res = validateDate("2026-02-10", 1, TODAY);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/H\+1/);
  });

  it("menerima tanggal yang memenuhi lead time", () => {
    expect(validateDate("2026-02-11", 1, TODAY).ok).toBe(true);
  });
});

describe("validateTime", () => {
  it("menerima jam dalam rentang operasional", () => {
    expect(validateTime("10:00", 9, 19).ok).toBe(true);
  });

  it("menolak jam di luar operasional dengan pesan jelas", () => {
    const res = validateTime("20:00", 9, 19);
    expect(res.ok).toBe(false);
    expect(res.reason).toMatch(/9\.00-19\.00/);
  });
});
