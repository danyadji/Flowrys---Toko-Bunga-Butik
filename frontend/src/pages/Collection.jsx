import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Seo } from "../components/Seo.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { BannerCta } from "../components/layout/BannerCta.jsx";
import { ToastHost } from "../components/ui/Toast.jsx";
import { Chip } from "../components/ui/Chip.jsx";
import { Select } from "../components/ui/Select.jsx";
import { ProductCard } from "../features/products/ProductCard.jsx";
import { ProductCardSkeleton } from "../features/products/ProductCardSkeleton.jsx";
import { EmptyState } from "../features/products/EmptyState.jsx";
import {
  useCatalog,
  useCategories,
  useProducts,
} from "../features/products/hooks/useCatalog.js";
import { buildCustomOrderMessage } from "../utils/buildWhatsAppMessage.js";
import { buildWhatsAppLink } from "../config/store.js";

const sortOptions = [
  { value: "popular", label: "Terpopuler" },
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Harga terendah" },
  { value: "price-desc", label: "Harga tertinggi" },
];

function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export default function Collection() {
  const [params, setParams] = useSearchParams();
  const category = params.get("kategori") ?? "";
  const sort = params.get("urut") ?? "popular";
  const page = Number(params.get("halaman") ?? "1") || 1;

  const [searchInput, setSearchInput] = useState(params.get("cari") ?? "");
  const debouncedSearch = useDebouncedValue(searchInput);

  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("cari", debouncedSearch);
        else next.delete("cari");
        next.delete("halaman");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, setParams]);

  const search = params.get("cari") ?? "";
  const query = useProducts({
    category: category || undefined,
    search: search || undefined,
    sort,
    page,
    pageSize: 12,
  });
  const { data: categories } = useCategories();
  const { data: catalog } = useCatalog();
  const counts = {};
  (catalog?.data ?? []).forEach((p) => {
    counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  });

  function updateParam(key, value) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("halaman");
      return next;
    });
  }

  const total = query.data?.meta.total ?? 0;

  return (
    <>
      <Seo
        title="Koleksi Bunga"
        description="Jelajahi buket, bunga papan, bunga meja, dan hampers Flowrys. Saring kategori, cari, dan urutkan."
      />
      <Navbar />
      <main className="mx-auto max-w-container px-4 pt-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] text-ink-muted">
              Beranda / <span aria-current="page">Koleksi</span>
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl">Koleksi Bunga</h1>
          </div>
          <p className="max-w-sm text-[15px]">
            Semua dirangkai segar di hari pengiriman. Pilih kategori atau cari
            nama bunga favoritmu.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          <Chip active={category === ""} onClick={() => updateParam("kategori", "")}>
            Semua
            <span className="text-[12px] opacity-70">{catalog?.data.length ?? ""}</span>
          </Chip>
          {(categories ?? []).map((c) => (
            <Chip
              key={c.id}
              active={category === c.slug}
              onClick={() => updateParam("kategori", category === c.slug ? "" : c.slug)}
            >
              {c.name}
              <span className="text-[12px] opacity-70">{counts[c.id] ?? 0}</span>
            </Chip>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <label htmlFor="cari-produk" className="sr-only">
              Cari produk
            </label>
            <input
              id="cari-produk"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari buket, papan, hampers..."
              className="input-field !pl-12"
            />
          </div>
          <Select
            id="urut-produk"
            aria-label="Urutkan produk"
            value={sort}
            onChange={(e) => updateParam("urut", e.target.value)}
            className="md:w-56"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        <p className="mt-4 text-[13px] text-ink-muted" aria-live="polite">
          Menampilkan <strong className="text-plum-900">{total}</strong> produk
        </p>

        <div className="mt-4">
          {query.isPending ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : query.isError ? (
            <div className="py-12 text-center">
              <p className="text-[15px]">
                Koleksi gagal dimuat. Periksa koneksimu lalu coba lagi.
              </p>
              <button type="button" className="btn-outline mt-4" onClick={() => query.refetch()}>
                Coba lagi
              </button>
            </div>
          ) : total === 0 ? (
            <EmptyState
              title="Tidak ada yang cocok"
              text="Coba kata kunci lain atau reset filter untuk melihat semua koleksi."
              actionLabel="Reset filter"
              onAction={() => {
                setSearchInput("");
                setParams({});
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {query.data.data.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {query.data.meta.last_page > 1 ? (
                <nav aria-label="Halaman koleksi" className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="btn-outline !px-5"
                    disabled={page <= 1}
                    onClick={() => updateParam("halaman", String(page - 1))}
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
                    onClick={() => updateParam("halaman", String(page + 1))}
                  >
                    Berikutnya
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>

        <div className="py-16 md:py-24">
          <BannerCta
            title="Tidak menemukan yang pas?"
            text="Ceritakan momen dan budgetmu, kami bantu pilihkan atau buatkan custom."
            actionLabel="Chat WhatsApp"
            actionHref={buildWhatsAppLink(buildCustomOrderMessage()) ?? undefined}
          />
        </div>
      </main>
      <Footer />
      <ToastHost />
    </>
  );
}
