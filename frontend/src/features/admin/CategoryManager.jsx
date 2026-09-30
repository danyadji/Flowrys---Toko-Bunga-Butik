import { useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { productService } from "../../services/productService.js";
import { slugify } from "../../utils/slugify.js";
import { toast } from "../../components/ui/Toast.jsx";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Kelola kategori: tambah, ubah (nama, deskripsi, gambar), hapus
// (ditolak bila dipakai produk).
export function CategoryManager({ categories, onChanged }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setName("");
    setDescription("");
    setImageUrl("");
    setPendingFile(null);
    setEditing(null);
  }

  function startEdit(category) {
    setEditing(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setImageUrl(category.image && category.image.startsWith("https://") ? category.image : "");
    setPendingFile(null);
    setError("");
  }

  async function uploadFile(categoryId, file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error("Format ditolak. Pakai JPEG, PNG, atau WebP.");
    }
    const json = await productService.uploadCategoryImage(categoryId, file);
    return json.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }
    setBusy(true);
    try {
      if (editing) {
        await productService.updateCategory(editing.id, {
          name: name.trim(),
          description: description.trim() || null,
          image: imageUrl.trim() || undefined,
        });
        if (pendingFile) {
          await uploadFile(editing.id, pendingFile);
        }
        toast("Kategori diperbarui.");
      } else {
        const created = await productService.createCategory({
          name: name.trim(),
          slug: slugify(name.trim()),
          description: description.trim() || undefined,
          image: imageUrl.trim() || undefined,
        });
        if (pendingFile) {
          await uploadFile(created.id, pendingFile);
        }
        toast("Kategori ditambahkan.");
      }
      resetForm();
      onChanged();
    } catch (err) {
      setError(
        err?.fields?.slug?.[0] ??
          err?.fields?.name?.[0] ??
          err?.fields?.image?.[0] ??
          err.message ??
          "Gagal menyimpan.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(category) {
    setError("");
    try {
      await productService.deleteCategory(category.id);
      toast("Kategori dihapus.");
      onChanged();
    } catch (err) {
      setError(err.message ?? "Gagal menghapus.");
    }
  }

  const preview = useMemo(() => {
    if (pendingFile) return URL.createObjectURL(pendingFile);
    return imageUrl.trim() || editing?.image || "";
  }, [pendingFile, imageUrl, editing]);

  return (
    <section aria-labelledby="kategori-heading" className="rounded-card bg-white p-4 md:p-6">
      <h2 id="kategori-heading" className="font-heading text-lg font-bold">Kategori</h2>
      <ul className="mt-3 space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 rounded-2xl bg-cream-50 px-4 py-2.5">
            <span className="flex min-w-0 items-center gap-3">
              {c.image ? (
                <img src={c.image} alt="" aria-hidden="true" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
              ) : (
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-[11px] font-bold text-ink-muted">
                  {c.name.slice(0, 1)}
                </span>
              )}
              <span className="truncate text-sm font-semibold text-plum-900">
                {c.name} <span className="font-normal text-ink-muted">/{c.slug}</span>
              </span>
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label={`Ubah ${c.name}`}
                onClick={() => startEdit(c)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-white"
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={`Hapus ${c.name}`}
                onClick={() => handleDelete(c)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-muted hover:bg-white hover:text-danger"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3 border-t border-line pt-4">
        <p className="text-sm font-bold text-plum-900">
          {editing ? `Ubah "${editing.name}"` : "Kategori baru"}
        </p>
        <Input
          id="category-name"
          label="Nama kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Paket Wedding"
          maxLength={100}
        />
        <div>
          <label htmlFor="category-description" className="mb-1.5 block text-[13px] font-semibold text-plum-900">
            Deskripsi (tampil di landing)
          </label>
          <textarea
            id="category-description"
            rows={2}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Rangkaian spesial untuk hari pernikahan."
            className="input-field !h-auto !rounded-xl py-3"
          />
        </div>
        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-plum-900">
            Gambar (tampil di kartu landing)
          </span>
          {preview ? (
            <p className="relative mb-2 inline-block">
              <img src={preview} alt="Pratinjau gambar kategori" className="h-20 w-20 rounded-2xl border border-line object-cover" />
              <button
                type="button"
                aria-label="Hapus gambar pilihan"
                onClick={() => {
                  setPendingFile(null);
                  setImageUrl("");
                  if (editing) startEdit({ ...editing, image: null });
                }}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-plum-900 text-white"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </p>
          ) : null}
          <div className="flex gap-2">
            <Input
              id="category-image-url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPendingFile(null);
              }}
              placeholder="https://..."
            />
          </div>
          <label className="btn-outline mt-2 inline-flex cursor-pointer !px-4">
            <ImagePlus size={16} aria-hidden="true" />
            {pendingFile ? "Ganti file" : "Pilih file"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPendingFile(file);
                  setImageUrl("");
                  setError("");
                }
                e.target.value = "";
              }}
            />
          </label>
          <p className="mt-1 text-[12px] text-ink-muted">URL https atau file (maks 2MB).</p>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
            <Plus size={16} aria-hidden="true" />
            {busy ? "Menyimpan..." : editing ? "Simpan" : "Tambah"}
          </button>
          {editing ? (
            <button
              type="button"
              className="btn-outline shrink-0 !px-5"
              onClick={resetForm}
            >
              Batal
            </button>
          ) : null}
        </div>
      </form>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>
      ) : null}
    </section>
  );
}
