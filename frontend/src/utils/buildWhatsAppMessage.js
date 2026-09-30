import { formatRupiah } from "./formatRupiah.js";

function itemLine(index, name, quantity, price) {
  return `${index}. ${name} x${quantity} - ${formatRupiah(price * quantity)}`;
}

function subtotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Pesan untuk tombol "Pesan via WhatsApp" di halaman detail (satu produk).
 */
export function buildSingleProductMessage(product, quantity = 1) {
  return [
    "Halo Flowrys, saya ingin memesan:",
    "",
    "*Pesanan*",
    itemLine(1, product.name, quantity, product.price),
    "",
    `*Total: ${formatRupiah(product.price * quantity)}*`,
  ].join("\n");
}

/**
 * Pesan template untuk kartu Custom Order / Konsultasi gratis (D5).
 */
export function buildCustomOrderMessage() {
  return [
    "Halo Flowrys, saya mau konsultasi custom order.",
    "",
    "Referensi/desain yang saya mau: ...",
    "Budget saya: ...",
    "Tanggal dibutuhkan: ...",
  ].join("\n");
}

/**
 * Pesan checkout keranjang, dua format sesuai PRD 6.4.
 * @param {{ items: Array<{name: string, quantity: number, price: number}>, buyer: {name: string, phone: string}, method: "pickup" | "delivery", pickup?: {date: string, time: string}, delivery?: {destination: string, event?: string, recipient: string, recipientPhone?: string, address: string, landmark?: string, date: string, time: string}, greeting?: string, note?: string }} order
 */
export function buildOrderMessage(order) {
  const lines = ["Halo Flowrys, saya ingin memesan:", "", "*Pesanan*"];
  order.items.forEach((item, i) => {
    lines.push(itemLine(i + 1, item.name, item.quantity, item.price));
  });
  lines.push("");
  const total = subtotal(order.items);

  if (order.method === "delivery") {
    const d = order.delivery;
    lines.push(
      `*Subtotal: ${formatRupiah(total)}*`,
      "Ongkir: dikonfirmasi admin",
      "",
      "*Data Pemesan*",
      `Nama: ${order.buyer.name}`,
      `No. HP: ${order.buyer.phone}`,
      "",
      "*Metode: Diantar*",
      `Tujuan: ${d.destination}`,
    );
    if (d.event) lines.push(`Acara/Lokasi: ${d.event}`);
    lines.push(`Penerima: ${d.recipient}`);
    if (d.recipientPhone) lines.push(`No. HP penerima: ${d.recipientPhone}`);
    lines.push(`Alamat: ${d.address}`);
    if (d.landmark) lines.push(`Patokan: ${d.landmark}`);
    lines.push(`Tanggal/Jam tiba: ${d.date}, ${d.time}`);
  } else {
    lines.push(
      `*Total: ${formatRupiah(total)}*`,
      "",
      "*Data Pemesan*",
      `Nama: ${order.buyer.name}`,
      `No. HP: ${order.buyer.phone}`,
      "",
      "*Metode: Ambil di toko*",
      `Tanggal/Jam ambil: ${order.pickup.date}, ${order.pickup.time}`,
    );
  }

  if (order.greeting) {
    lines.push("", "*Kartu ucapan*", `"${order.greeting}"`);
  }
  if (order.note) {
    lines.push("", "*Catatan*", order.note);
  }
  return lines.join("\n");
}
