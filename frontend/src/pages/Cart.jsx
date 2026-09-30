import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Seo } from "../components/Seo.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { ToastHost } from "../components/ui/Toast.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { EmptyState } from "../features/products/EmptyState.jsx";
import { useCartStore } from "../features/cart/cartStore.js";
import { useCartDetails } from "../features/cart/useCartDetails.js";
import { formatRupiah } from "../utils/formatRupiah.js";

const PLACEHOLDER = "/images/product-placeholder.svg";

function QtyStepper({ productId, quantity, disabled }) {
  const setQty = useCartStore((s) => s.setQty);
  return (
    <div className="flex items-center rounded-full border border-line bg-white">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        disabled={disabled}
        onClick={() => setQty(productId, quantity - 1)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100 disabled:opacity-40"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="w-7 text-center text-sm font-bold text-plum-900">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        disabled={disabled}
        onClick={() => setQty(productId, quantity + 1)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100 disabled:opacity-40"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const remove = useCartStore((s) => s.remove);
  const { detailed, orderable, subtotal, isPending, isError, refetch } = useCartDetails();

  return (
    <>
      <Seo title="Keranjang" description="Isi keranjang belanjamu di Flowrys." />
      <Navbar />
      <main className="mx-auto max-w-container px-4 pb-28 pt-10 lg:pb-16">
        <h1 className="text-3xl md:text-4xl">Keranjang</h1>

        {isPending ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
            <Skeleton className="h-56 w-full" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <p>Keranjang gagal dimuat. Periksa koneksimu lalu coba lagi.</p>
            <button type="button" className="btn-outline mt-4" onClick={() => refetch()}>
              Coba lagi
            </button>
          </div>
        ) : detailed.length === 0 ? (
          <EmptyState
            title="Keranjang masih kosong"
            text="Jelajahi koleksi dan temukan bunga yang pas untuk momenmu."
            actionLabel="Lihat Koleksi"
            onAction={() => navigate("/koleksi")}
          />
        ) : (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {detailed.map(({ product, quantity, unavailable }) => (
                <li
                  key={product.id}
                  className={`flex gap-4 rounded-card bg-white p-4 ${unavailable ? "opacity-70" : ""}`}
                >
                  <img
                    src={product.images[0]}
                    alt=""
                    aria-hidden="true"
                    onError={(e) => {
                      if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
                    }}
                    className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-[16px] font-bold text-plum-900">
                      {product.name}
                    </p>
                    <p className="text-sm">{formatRupiah(product.price)}</p>
                    {unavailable ? (
                      <p className="mt-1">
                        <Badge tone="danger">Stok habis, tidak ikut dipesan</Badge>
                      </p>
                    ) : (
                      <div className="mt-2">
                        <QtyStepper productId={product.id} quantity={quantity} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-sm font-bold text-plum-900">
                      {formatRupiah(product.price * quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      aria-label={`Hapus ${product.name} dari keranjang`}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-muted hover:bg-cream-100 hover:text-danger"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="hidden rounded-card bg-white p-6 lg:block lg:sticky lg:top-24" aria-label="Ringkasan belanja">
              <h2 className="font-heading text-lg font-bold">Ringkasan</h2>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">{orderable.length} jenis bunga</dt>
                  <dd className="font-bold text-plum-900">{formatRupiah(subtotal)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[13px] text-ink-muted">
                Ongkir dihitung manual dan dikonfirmasi admin via WhatsApp.
              </p>
              {orderable.length > 0 ? (
                <Link to="/checkout" className="btn-primary mt-4 w-full">
                  Lanjut ke Checkout
                </Link>
              ) : (
                <p className="mt-4 rounded-full bg-cream-100 px-6 py-3 text-center text-sm font-semibold text-ink-muted">
                  Semua item stok habis
                </p>
              )}
            </aside>
          </div>
        )}
      </main>

      {detailed.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-container items-center justify-between gap-3">
            <div>
              <p className="text-[12px] text-ink-muted">Subtotal</p>
              <p className="font-heading text-lg font-bold text-plum-900">
                {formatRupiah(subtotal)}
              </p>
            </div>
            {orderable.length > 0 ? (
              <Link to="/checkout" className="btn-primary">
                Lanjut ke Checkout
              </Link>
            ) : (
              <p className="rounded-full bg-cream-100 px-6 py-3 text-center text-sm font-semibold text-ink-muted">
                Stok habis
              </p>
            )}
          </div>
        </div>
      ) : null}

      <Footer />
      <ToastHost />
    </>
  );
}
