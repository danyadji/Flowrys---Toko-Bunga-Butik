import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Seo } from "../components/Seo.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { ToastHost, toast } from "../components/ui/Toast.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { EmptyState } from "../features/products/EmptyState.jsx";
import { CheckoutForm } from "../features/checkout/CheckoutForm.jsx";
import { useCartStore } from "../features/cart/cartStore.js";
import { useCartDetails } from "../features/cart/useCartDetails.js";
import { buildOrderMessage } from "../utils/buildWhatsAppMessage.js";
import { buildWhatsAppLink } from "../config/store.js";
import { formatRupiah } from "../utils/formatRupiah.js";

const PLACEHOLDER = "/images/product-placeholder.svg";

function OrderSummary({ orderable, subtotal, method }) {
  return (
    <aside className="rounded-card bg-white p-6 lg:sticky lg:top-24" aria-label="Ringkasan pesanan">
      <h2 className="font-heading text-lg font-bold">Ringkasan pesanan</h2>
      <ul className="mt-3 space-y-3">
        {orderable.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-3">
            <img
              src={product.images[0]}
              alt=""
              aria-hidden="true"
              onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
              }}
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
            <p className="min-w-0 flex-1 truncate text-sm">
              {product.name}
              <span className="text-ink-muted"> x{quantity}</span>
            </p>
            <p className="text-sm font-bold text-plum-900">
              {formatRupiah(product.price * quantity)}
            </p>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 border-t border-line pt-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="font-bold text-plum-900">{formatRupiah(subtotal)}</dd>
        </div>
        {method === "delivery" ? (
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Ongkir</dt>
            <dd className="text-right text-sm text-ink-muted">
              Dikonfirmasi admin via WhatsApp
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const clear = useCartStore((s) => s.clear);
  const rawItems = useCartStore((s) => s.items);
  const { orderable, subtotal, isPending, isError, refetch } = useCartDetails();
  const [sent, setSent] = useState(false);
  const [method, setMethod] = useState("pickup");

  if (!sent && rawItems.length === 0 && !isPending) {
    return <Navigate to="/koleksi" replace />;
  }

  function handleSubmit(form) {
    setMethod(form.method);
    const link = buildWhatsAppLink(
      buildOrderMessage({
        items: orderable.map((d) => ({
          name: d.product.name,
          quantity: d.quantity,
          price: d.product.price,
        })),
        buyer: { name: form.buyerName, phone: form.buyerPhone },
        method: form.method,
        pickup:
          form.method === "pickup"
            ? { date: form.date, time: form.time }
            : undefined,
        delivery:
          form.method === "delivery"
            ? {
                destination: form.destination,
                event: form.event || undefined,
                recipient: form.recipient,
                recipientPhone: form.recipientPhone || undefined,
                address: form.address,
                landmark: form.landmark || undefined,
                date: form.date,
                time: form.time,
              }
            : undefined,
        greeting: form.greeting || undefined,
        note: form.note || undefined,
      }),
    );
    if (!link) {
      toast("Nomor WhatsApp toko belum dikonfigurasi.");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <>
      <Seo title="Checkout" description="Isi detail pengiriman dan selesaikan pesanan via WhatsApp." />
      <Navbar />
      <main className="mx-auto max-w-container px-4 pt-10">
        <h1 className="text-3xl md:text-4xl">Checkout</h1>

        {isPending ? (
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center">
            <p>Checkout gagal dimuat. Periksa koneksimu lalu coba lagi.</p>
            <button type="button" className="btn-outline mt-4" onClick={() => refetch()}>
              Coba lagi
            </button>
          </div>
        ) : orderable.length === 0 ? (
          <EmptyState
            title="Tidak ada yang bisa dipesan"
            text="Semua item di keranjangmu sedang stok habis."
            actionLabel="Kembali ke Keranjang"
            onAction={() => navigate("/keranjang")}
          />
        ) : sent ? (
          <div className="mx-auto max-w-lg py-12 text-center">
            <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-200 text-plum-900">
              <MessageCircle size={26} aria-hidden="true" />
            </p>
            <h2 className="mt-4 text-2xl">Pesanan dibuka di WhatsApp</h2>
            <p className="mt-2 text-[15px] text-ink-muted">
              Selesaikan pengiriman pesan di tab WhatsApp. Setelah terkirim,
              kamu boleh mengosongkan keranjang.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  clear();
                  navigate("/");
                }}
              >
                Kosongkan keranjang
              </button>
              <button type="button" className="btn-outline" onClick={() => setSent(false)}>
                Ubah pesanan
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-8 pb-16 lg:grid-cols-[1fr_360px]">
            <div className="rounded-card bg-white p-5 md:p-7">
              <CheckoutForm onSubmit={handleSubmit} onMethodChange={setMethod} />
            </div>
            <OrderSummary orderable={orderable} subtotal={subtotal} method={method} />
          </div>
        )}

        {!sent && orderable.length > 0 && (
          <p className="pb-16 text-center text-sm text-ink-muted">
            Sudah mengisi? Tombol pesan ada di bawah form.{" "}
            <Link to="/keranjang" className="font-semibold text-plum-900 underline">
              Kembali ke keranjang
            </Link>
          </p>
        )}
      </main>
      <Footer />
      <ToastHost />
    </>
  );
}
