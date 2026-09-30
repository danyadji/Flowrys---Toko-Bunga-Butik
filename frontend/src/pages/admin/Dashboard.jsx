import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Seo } from "../../components/Seo.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { ToastHost, toast } from "../../components/ui/Toast.jsx";
import { AdminLayout } from "../../features/admin/AdminLayout.jsx";
import { ProductTable } from "../../features/admin/ProductTable.jsx";
import { ProductForm } from "../../features/admin/ProductForm.jsx";
import { useAdminMutations } from "../../features/admin/useAdminMutations.js";
import { useCategories, useCatalog } from "../../features/products/hooks/useCatalog.js";
import { productService } from "../../services/productService.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { data: catalog } = useCatalog();
  const { saveProduct, removeProduct, toggleAvailability } = useAdminMutations();

  const [formState, setFormState] = useState(null); // null | { product? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [serverImages, setServerImages] = useState([]);

  const existingSlugs = (catalog?.data ?? []).map((p) => ({ id: p.id, slug: p.slug }));

  useEffect(() => {
    if (formState?.product?.id) {
      productService
        .listImages(formState.product.id)
        .then(setServerImages)
        .catch(() => setServerImages([]));
    } else {
      setServerImages([]);
    }
  }, [formState]);

  // Form tidak di-unmount saat menyimpan agar file yang ditampung tidak hilang
  // bila simpan gagal dan pengguna mencoba lagi.
  async function handleFormSubmit(input, { files = [] } = {}) {
    try {
      const saved = await saveProduct({ id: formState?.product?.id, input });
      // Mode tambah: unggah file yang ditampung setelah produk dibuat.
      if (files.length > 0 && saved?.id) {
        const results = await Promise.allSettled(
          files.map((file) => productService.uploadImage(saved.id, file)),
        );
        const failed = results.filter((r) => r.status === "rejected").length;
        if (failed > 0) toast(`${failed} foto gagal diunggah. Coba lagi dari form ubah.`);
      }
      setFormState(null);
    } catch (error) {
      // Token mati (misal database di-fresh): paksa login ulang.
      if (error?.code === "UNAUTHORIZED") navigate("/admin/login");
    }
  }

  async function handleUploadFile(file) {
    const productId = formState?.product?.id;
    if (!productId) throw new Error("Simpan produk dulu sebelum mengunggah.");
    const json = await productService.uploadImage(productId, file);
    const uploaded = { id: json.id, url: json.url };
    setServerImages((prev) =>
      prev.some((img) => img.id === uploaded.id) ? prev : [...prev, uploaded],
    );
    // Kembalikan URL agar masuk nilai form (lolos validasi minimal 1 gambar).
    // Render mendedupe dengan daftar server sehingga tidak tampil ganda.
    return json.url;
  }

  async function handleDeleteServerImage(imageId) {
    const productId = formState?.product?.id;
    if (!productId) return;
    try {
      await productService.deleteImage(productId, imageId);
      setServerImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      toast("Gagal menghapus gambar.");
    }
  }

  return (
    <>
      <Seo title="Dasbor Admin" description="Kelola katalog produk Flowrys." />
      <AdminLayout title="Produk">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setFormState({ product: null })}
          >
            <Plus size={17} aria-hidden="true" />
            Tambah produk
          </button>
        </div>

        <ProductTable
          categories={categories}
          onEdit={(product) => setFormState({ product })}
          onDelete={setDeleteTarget}
          onToggleStock={(product) => toggleAvailability(product).catch(() => {})}
        />

        {formState ? (
          <Modal
            wide
            title={formState.product ? "Ubah produk" : "Tambah produk"}
            onClose={() => setFormState(null)}
          >
            <ProductForm
              product={formState.product}
              categories={categories}
              existingSlugs={existingSlugs}
              onSubmit={handleFormSubmit}
              serverImages={serverImages}
              onUploadFile={handleUploadFile}
              onDeleteServerImage={handleDeleteServerImage}
            />
          </Modal>
        ) : null}

        {deleteTarget ? (
          <Modal title="Hapus produk" onClose={() => setDeleteTarget(null)}>
            <p className="text-[15px]">
              Hapus <strong>{deleteTarget.name}</strong> dari katalog? Tindakan
              ini tidak bisa dibatalkan.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="btn-outline flex-1"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-danger px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                onClick={() => {
                  removeProduct(deleteTarget.id)
                    .then(() => setDeleteTarget(null))
                    .catch(() => {});
                }}
              >
                Hapus
              </button>
            </div>
          </Modal>
        ) : null}
      </AdminLayout>
      <ToastHost />
    </>
  );
}
