import { useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/productService.js";
import { toast } from "../../components/ui/Toast.jsx";

export function isQuotaError(error) {
  return (
    error?.name === "QuotaExceededError" ||
    error?.code === 22 ||
    /quota/i.test(error?.message ?? "")
  );
}

export function quotaMessage() {
  return "Penyimpanan browser penuh. Hapus gambar unggahan (pakai URL https) lalu coba lagi.";
}

// Mutasi admin dengan invalidasi cache storefront (M4-10) dan penanganan
// penyimpanan penuh (M4-12).
export function useAdminMutations() {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product"] });
  }

  function handleError(error, fallback) {
    if (isQuotaError(error)) toast(quotaMessage());
    else toast(fallback);
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

  async function resetDemoData() {
    try {
      await productService.resetDemoData();
      invalidate();
      toast("Data demo dikembalikan ke awal.");
    } catch (error) {
      handleError(error, "Gagal mereset data.");
      throw error;
    }
  }

  return { saveProduct, removeProduct, toggleAvailability, resetDemoData };
}
