import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkoutSchema";

function futureDate(daysAhead = 5) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

const pickupBase = {
  method: "pickup",
  buyerName: "Sinta",
  buyerPhone: "08123456789",
  date: futureDate(),
  time: "10:00",
};

describe("checkoutSchema", () => {
  it("menerima form ambil di toko yang lengkap", () => {
    expect(checkoutSchema.safeParse(pickupBase).success).toBe(true);
  });

  it("field tersembunyi tidak divalidasi pada metode ambil", () => {
    // Tanpa alamat dan penerima tetap lolos untuk pickup.
    expect(checkoutSchema.safeParse(pickupBase).success).toBe(true);
  });

  it("metode antar wajib memiliki alamat dan penerima", () => {
    const res = checkoutSchema.safeParse({
      ...pickupBase,
      method: "delivery",
      destination: "Rumah",
      address: "",
      recipient: "",
    });
    expect(res.success).toBe(false);
  });

  it("menerima form antar yang lengkap", () => {
    expect(
      checkoutSchema.safeParse({
        ...pickupBase,
        method: "delivery",
        destination: "Acara/Venue",
        event: "Pernikahan Rina & Dimas",
        recipient: "Rina",
        address: "Jl. Mawar No. 1",
        date: futureDate(),
        time: "10:00",
      }).success,
    ).toBe(true);
  });

  it("menolak tanggal lampau dan di bawah lead time", () => {
    expect(
      checkoutSchema.safeParse({ ...pickupBase, date: "2020-01-01" }).success,
    ).toBe(false);
  });

  it("menolak jam di luar operasional", () => {
    expect(checkoutSchema.safeParse({ ...pickupBase, time: "22:00" }).success).toBe(false);
  });

  it("menolak nomor HP yang bukan format Indonesia", () => {
    expect(
      checkoutSchema.safeParse({ ...pickupBase, buyerPhone: "12345" }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...pickupBase, buyerPhone: "+628123456789" }).success,
    ).toBe(true);
  });

  it("menolak kartu ucapan lebih dari 200 karakter", () => {
    expect(
      checkoutSchema.safeParse({ ...pickupBase, greeting: "a".repeat(201) }).success,
    ).toBe(false);
  });
});
