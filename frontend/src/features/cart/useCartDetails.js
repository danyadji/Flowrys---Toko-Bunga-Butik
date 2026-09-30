import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService.js";
import { useCartStore } from "./cartStore.js";

/**
 * Gabungkan isi keranjang dengan katalog terbaru (M3-02).
 * Produk yang dihapus admin dibersihkan otomatis; produk stok habis
 * ditandai dan dikeluarkan dari ringkasan serta pesanan.
 */
export function useCartDetails() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);

  const catalogQuery = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProducts({ pageSize: 100 }),
  });

  const byId = useMemo(() => {
    const map = new Map();
    (catalogQuery.data?.data ?? []).forEach((p) => map.set(p.id, p));
    return map;
  }, [catalogQuery.data]);

  useEffect(() => {
    if (!catalogQuery.data) return;
    items.forEach((item) => {
      if (!byId.has(item.productId)) remove(item.productId);
    });
  }, [catalogQuery.data, items, byId, remove]);

  const detailed = items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity, unavailable: !product.isAvailable };
    })
    .filter(Boolean);

  const orderable = detailed.filter((d) => !d.unavailable);
  const subtotal = orderable.reduce(
    (sum, d) => sum + d.product.price * d.quantity,
    0,
  );

  return { detailed, orderable, subtotal, ...catalogQuery };
}
