import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";

const product = {
  id: "px",
  name: "Buket Uji",
  slug: "buket-uji",
  categoryId: "c1",
  price: 100000,
  // Upaya injeksi dari input admin. Harus tampil sebagai teks biasa.
  description: '<script>alert("xss")</script><img src=x onerror=alert(1)>',
  images: ["/images/product-placeholder.svg"],
  rating: 4.5,
  soldCount: 10,
  badge: null,
  isAvailable: true,
};

describe("ProductCard", () => {
  it("merender deskripsi sebagai teks biasa, bukan HTML", () => {
    const { container } = render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );
    expect(container.querySelector("script")).toBe(null);
    expect(
      screen.getByText(/<script>alert\("xss"\)<\/script>/),
    ).toBeInTheDocument();
  });
});
