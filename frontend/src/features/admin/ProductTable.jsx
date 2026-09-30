import { useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Chip } from "../../components/ui/Chip.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { useProducts } from "../products/hooks/useCatalog.js";
import { formatRupiah } from "../../utils/formatRupiah.js";

const PAGE_SIZE = 8;

export function ProductTable({ categories, onEdit, onDelete, onToggleStock }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const query = useProducts({
    category: category || undefined,
    search: search || undefined,
    sort: "newest",
    page,
    pageSize: PAGE_SIZE,
  });

  function resetFilters() {
    setSearch("");
    setCategory("");
    setPage(1);
  }

  return (
    <div className="rounded-card bg-white p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <label htmlFor="admin-search" className="sr-only">Cari produk</label>
          <input
            id="admin-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama produk..."
            className="input-field !pl-12"
          />
        </div>
        <Select
          id="admin-filter-category"
          aria-label="Filter kategori"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="md:w-52"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              <th scope="col" className="px-3 py-2 font-semibold">Produk</th>
              <th scope="col" className="px-3 py-2 font-semibold">Kategori</th>
              <th scope="col" className="px-3 py-2 font-semibold">Harga</th>
              <th scope="col" className="px-3 py-2 font-semibold">Stok</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(query.data?.data ?? []).map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              return (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        aria-hidden="true"
                        className="h-11 w-11 shrink-0 rounded-xl object-cover"
                      />
                      <span className="font-semibold text-plum-900">{p.name}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-ink-body">{cat?.name ?? "-"}</td>
                  <td className="px-3 py-3 font-semibold text-plum-900">
                    {formatRupiah(p.price)}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleStock(p)}
                      aria-pressed={p.isAvailable}
                      aria-label={`Ubah stok ${p.name} menjadi ${p.isAvailable ? "habis" : "tersedia"}`}
                      title={p.isAvailable ? "Tandai habis" : "Tandai tersedia"}
                    >
                      <Badge tone={p.isAvailable ? "light" : "danger"}>
                        {p.isAvailable ? "Tersedia" : "Habis"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        aria-label={`Ubah ${p.name}`}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100"
                      >
                        <Pencil size={17} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(p)}
                        aria-label={`Hapus ${p.name}`}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-muted hover:bg-cream-100 hover:text-danger"
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {query.isPending ? (
          <p className="py-8 text-center text-ink-muted">Memuat produk...</p>
        ) : null}
        {query.isError ? (
          <div className="py-8 text-center">
            <p>Tabel gagal dimuat.</p>
            <button type="button" className="btn-outline mt-3" onClick={() => query.refetch()}>
              Coba lagi
            </button>
          </div>
        ) : null}
        {query.data && query.data.meta.total === 0 ? (
          <div className="py-8 text-center">
            <p>Tidak ada produk yang cocok.</p>
            <Chip className="mt-3" onClick={resetFilters}>
              Reset filter
            </Chip>
          </div>
        ) : null}
      </div>

      {query.data && query.data.meta.last_page > 1 ? (
        <nav aria-label="Halaman tabel" className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            className="btn-outline !px-5"
            disabled={page <= 1}
            onClick={() => setPage((v) => v - 1)}
          >
            Sebelumnya
          </button>
          <p className="text-sm" aria-live="polite">
            Halaman {query.data.meta.current_page} dari {query.data.meta.last_page}
          </p>
          <button
            type="button"
            className="btn-outline !px-5"
            disabled={page >= query.data.meta.last_page}
            onClick={() => setPage((v) => v + 1)}
          >
            Berikutnya
          </button>
        </nav>
      ) : null}
    </div>
  );
}
