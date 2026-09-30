import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { productService } from "../../services/productService.js";
import { slugify } from "../../utils/slugify.js";
import { toast } from "../../components/ui/Toast.jsx";

// Kelola kategori: tambah, ubah nama/slug, hapus (ditolak bila dipakai produk).
export function CategoryManager({ categories, onChanged }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
        await productService.updateCategory(editing.id, { name: name.trim() });
        toast("Kategori diperbarui.");
      } else {
        await productService.createCategory({
          name: name.trim(),
          slug: slugify(name.trim()),
        });
        toast("Kategori ditambahkan.");
      }
      setName("");
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err?.fields?.slug?.[0] ?? err?.fields?.name?.[0] ?? err.message ?? "Gagal menyimpan.");
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

  return (
    <section aria-labelledby="kategori-heading" className="rounded-card bg-white p-4 md:p-6">
      <h2 id="kategori-heading" className="font-heading text-lg font-bold">Kategori</h2>
      <ul className="mt-3 space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2 rounded-2xl bg-cream-50 px-4 py-2.5">
            <span className="text-sm font-semibold text-plum-900">
              {c.name} <span className="font-normal text-ink-muted">/{c.slug}</span>
            </span>
            <span className="flex gap-1">
              <button
                type="button"
                aria-label={`Ubah ${c.name}`}
                onClick={() => {
                  setEditing(c);
                  setName(c.name);
                }}
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
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex-1">
          <label htmlFor="category-name" className="sr-only">
            {editing ? "Nama kategori baru" : "Nama kategori"}
          </label>
          <Input
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={editing ? `Ubah "${editing.name}"` : "Kategori baru, contoh: Paket Wedding"}
            maxLength={100}
          />
        </div>
        <button type="submit" disabled={busy} className="btn-primary shrink-0 !px-5">
          <Plus size={16} aria-hidden="true" />
          {editing ? "Simpan" : "Tambah"}
        </button>
        {editing ? (
          <button
            type="button"
            className="btn-outline shrink-0 !px-5"
            onClick={() => {
              setEditing(null);
              setName("");
            }}
          >
            Batal
          </button>
        ) : null}
      </form>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] text-danger">{error}</p>
      ) : null}
    </section>
  );
}
