import { useQuery } from "@tanstack/react-query";
import { productService } from "../../../services/productService.js";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
  });
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    retry: false,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productService.getFeaturedProducts(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });
}

/**
 * Semua produk untuk hitung jumlah dan harga mulai per kategori.
 * Katalog demo kecil (18 produk) sehingga satu query cukup.
 */
export function useCatalog() {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productService.getProducts({ pageSize: 100 }),
  });
}
