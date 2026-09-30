import { describe, expect, it } from "vitest";
import {
  buildCustomOrderMessage,
  buildOrderMessage,
  buildSingleProductMessage,
} from "./buildWhatsAppMessage";

const items = [
  { name: "Buket Rose Blush", quantity: 1, price: 250000 },
  { name: "Hampers Sweet Day", quantity: 2, price: 360000 },
];

describe("buildSingleProductMessage", () => {
  it("memformat satu produk dengan total", () => {
    const msg = buildSingleProductMessage(
      { name: "Buket Rose Blush", price: 250000 },
      1,
    );
    expect(msg).toContain("1. Buket Rose Blush x1 - Rp250.000");
    expect(msg).toContain("*Total: Rp250.000*");
  });
});

describe("buildOrderMessage", () => {
  it("format Diantar memuat subtotal, ongkir manual, dan data acara", () => {
    const msg = buildOrderMessage({
      items,
      buyer: { name: "Sinta", phone: "08123456789" },
      method: "delivery",
      delivery: {
        destination: "Acara/Venue",
        event: "Pernikahan Rina & Dimas, Gedung Serbaguna X",
        recipient: "Rina",
        address: "Jl. Mawar No. 1",
        landmark: "Lobi utama, hubungi panitia",
        date: "14 Februari 2026",
        time: "10.00",
      },
      greeting: "Selamat menempuh hidup baru",
    });
    expect(msg).toMatchSnapshot();
    expect(msg).toContain("*Subtotal: Rp970.000*");
    expect(msg).toContain("Ongkir: dikonfirmasi admin");
    expect(msg).toContain("*Metode: Diantar*");
  });

  it("format Ambil di toko tanpa field pengiriman", () => {
    const msg = buildOrderMessage({
      items: [items[0]],
      buyer: { name: "Sinta", phone: "08123456789" },
      method: "pickup",
      pickup: { date: "14 Februari 2026", time: "10.00" },
    });
    expect(msg).toMatchSnapshot();
    expect(msg).toContain("*Total: Rp250.000*");
    expect(msg).toContain("*Metode: Ambil di toko*");
    expect(msg).not.toContain("Alamat:");
  });

  it("karakter khusus, emoji, dan baris baru lolos encode bolak-balik", () => {
    const msg = buildOrderMessage({
      items: [{ name: "Buket & Co. <spesial>", quantity: 1, price: 100000 }],
      buyer: { name: "Andi 😊", phone: "0812" },
      method: "pickup",
      pickup: { date: "14 Februari 2026", time: "10.00" },
      note: "Baris satu\nBaris dua & tiga",
    });
    const encoded = encodeURIComponent(msg);
    expect(decodeURIComponent(encoded)).toBe(msg);
    expect(msg).toContain("Buket & Co. <spesial>");
  });
});

describe("buildCustomOrderMessage", () => {
  it("memuat template konsultasi", () => {
    expect(buildCustomOrderMessage()).toContain("konsultasi custom order");
  });
});

describe("batas panjang (M3-11)", () => {
  it("pesan dengan field maksimal tetap jauh di bawah batas WhatsApp", () => {
    const msg = buildOrderMessage({
      items,
      buyer: { name: "n".repeat(100), phone: "08123456789" },
      method: "delivery",
      delivery: {
        destination: "Acara/Venue",
        event: "e".repeat(150),
        recipient: "r".repeat(100),
        address: "a".repeat(500),
        landmark: "l".repeat(200),
        date: "14 Februari 2026",
        time: "10.00",
      },
      greeting: "g".repeat(200),
      note: "n".repeat(500),
    });
    expect(msg.length).toBeLessThan(65000);
    expect(decodeURIComponent(encodeURIComponent(msg))).toBe(msg);
  });
});
