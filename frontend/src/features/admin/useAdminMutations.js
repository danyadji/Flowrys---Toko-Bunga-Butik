import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/productService.js";
import { toast } from "../../components/ui/Toast.jsx";

// Mutasi admin dengan invalidasi cache storefront. Error API (422 validasi,
// 401 sesi berakhir) diteruskan sebagai toast yang jelas.
export function useAdminMutations() {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product"] });
  }

  function handleError(error, fallback) {
    if (error?.code === "UNAUTHORIZED") {
      toast("Sesi berakhir. Masuk lagi.");
    } else {
      toast(error?.message ?? fallback);
    }
  }

  async function saveProduct({ id, input }) {
    try {
      const saved = id
        ? await productService.updateProduct(id, input)
        : await productService.createProduct(input);
      invalidate();
      toast(id ? "Produk diperbarui." : "Produk ditambahkan.");
      return saved;
    } catch (error) {
      handleError(error, "Gagal menyimpan produk.");
      throw error;
    }
  }

  async function removeProduct(id) {
    try {
      await productService.deleteProduct(id);
      invalidate();
      toast("Produk dihapus.");
    } catch (error) {
      handleError(error, "Gagal menghapus produk.");
      throw error;
    }
  }

  // Toggle cepat dengan optimistic update dan rollback bila gagal (M4-05).
  async function toggleAvailability(product) {
    const next = !product.isAvailable;
    await queryClient.cancelQueries({ queryKey: ["products"] });
    const snapshots = queryClient.getQueriesData({ queryKey: ["products"] });
    queryClient.setQueriesData({ queryKey: ["products"] }, (old) => {
      if (!old) return old;
      if (Array.isArray(old)) {
        return old.map((p) => (p.id === product.id ? { ...p, isAvailable: next } : p));
      }
      if (old.data) {
        return {
          ...old,
          data: old.data.map((p) => (p.id === product.id ? { ...p, isAvailable: next } : p)),
        };
      }
      return old;
    });
    try {
      await productService.setAvailability(product.id, next);
      toast(next ? "Produk tersedia." : "Produk ditandai habis.");
    } catch (error) {
      snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      handleError(error, "Gagal mengubah stok.");
      throw error;
    } finally {
      invalidate();
    }
  }

  return { saveProduct, removeProduct, toggleAvailability };
}
