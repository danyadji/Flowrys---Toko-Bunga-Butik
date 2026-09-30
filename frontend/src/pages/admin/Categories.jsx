import { useQueryClient } from "@tanstack/react-query";
import { Seo } from "../../components/Seo.jsx";
import { AdminLayout } from "../../features/admin/AdminLayout.jsx";
import { CategoryManager } from "../../features/admin/CategoryManager.jsx";
import { useCategories } from "../../features/products/hooks/useCatalog.js";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { data: categories = [], isPending, isError, refetch } = useCategories();

  function handleChanged() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <>
      <Seo title="Kategori Admin" description="Kelola kategori produk Flowrys." />
      <AdminLayout title="Kategori">
        <div className="max-w-4xl">
          {isPending ? (
            <p className="rounded-card bg-white p-6 text-center text-ink-muted">Memuat kategori...</p>
          ) : isError ? (
            <div className="rounded-card bg-white p-6 text-center">
              <p>Kategori gagal dimuat.</p>
              <button type="button" className="btn-outline mt-3" onClick={() => refetch()}>
                Coba lagi
              </button>
            </div>
          ) : (
            <CategoryManager categories={categories} onChanged={handleChanged} />
          )}
        </div>
      </AdminLayout>
    </>
  );
}
