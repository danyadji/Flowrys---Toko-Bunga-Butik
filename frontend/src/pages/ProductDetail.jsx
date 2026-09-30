import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageCircle, Minus, Plus, Star } from "lucide-react";
import { Seo } from "../components/Seo.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { ToastHost, toast } from "../components/ui/Toast.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ProductCard } from "../features/products/ProductCard.jsx";
import { useCartStore } from "../features/cart/cartStore.js";
import {
  useProductBySlug,
  useProducts,
} from "../features/products/hooks/useCatalog.js";
import { buildSingleProductMessage } from "../utils/buildWhatsAppMessage.js";
import { buildWhatsAppLink } from "../config/store.js";
import { discountPercent, formatRupiah } from "../utils/formatRupiah.js";
import { formatSoldCount } from "../utils/formatSold.js";
import NotFound from "./NotFound.jsx";

const PLACEHOLDER = "/images/product-placeholder.svg";

function badgeLabel(badge) {
  if (badge === "terlaris") return "Terlaris";
  if (badge === "baru") return "Baru";
  return null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const add = useCartStore((s) => s.add);

  const productQuery = useProductBySlug(slug);
  const product = productQuery.data;

  const relatedQuery = useProducts(
    product
      ? { category: undefined, sort: "popular", pageSize: 100 }
      : undefined,
  );
  const related = ((relatedQuery.data?.data ?? []).filter(
    (p) => product && p.categoryId === product.categoryId && p.id !== product.id,
  )).slice(0, 4);

  if (productQuery.isPending) {
    return (
      <>
        <Navbar />
        <main className="mx-auto grid max-w-container gap-8 px-4 pt-10 md:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full" />
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <Skeleton className="mt-3 h-6 w-1/3" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (productQuery.isError) {
    if (productQuery.error?.code === "NOT_FOUND") return <NotFound />;
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-container px-4 py-16 text-center">
          <p>Detail gagal dimuat. Periksa koneksimu lalu coba lagi.</p>
          <button type="button" className="btn-outline mt-4" onClick={() => productQuery.refetch()}>
            Coba lagi
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const discount = discountPercent(product.price, product.originalPrice);
  const soldOut = !product.isAvailable;
  const waLink =
    buildWhatsAppLink(buildSingleProductMessage(product, quantity)) ?? "#kontak";

  function handleAdd() {
    add(product.id, quantity);
    toast("Ditambahkan ke keranjang");
  }

  return (
    <>
      <Seo title={product.name} description={product.description} />
      <Navbar />
      <main className="mx-auto max-w-container px-4 pb-28 pt-10 md:pb-16">
        <p className="text-[13px] text-ink-muted">
          <Link to="/" className="hover:underline">Beranda</Link>
          {" / "}
          <Link to="/koleksi" className="hover:underline">Koleksi</Link>
          {" / "}
          <span aria-current="page">{product.name}</span>
        </p>

        <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <img
              src={product.images[activeImage] ?? PLACEHOLDER}
              alt={product.name}
              onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
              }}
              className="aspect-[4/5] w-full rounded-card object-cover"
            />
            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Lihat foto ${i + 1}`}
                    aria-pressed={activeImage === i}
                    className={`overflow-hidden rounded-2xl border-2 transition ${
                      activeImage === i ? "border-plum-900" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" aria-hidden="true" className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex gap-1.5">
              {product.badge ? <Badge>{badgeLabel(product.badge)}</Badge> : null}
              {discount > 0 ? <Badge tone="dark">-{discount}%</Badge> : null}
              {soldOut ? <Badge tone="danger">Stok habis</Badge> : null}
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl">{product.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-ink-muted">
              <Star size={15} aria-hidden="true" className="fill-star text-star" />
              <span className="sr-only">Rating</span>
              {product.rating.toFixed(1)}
              <span aria-hidden="true">.</span>
              {formatSoldCount(product.soldCount)} terjual
            </p>
            <p className="mt-3 flex items-baseline gap-2 font-heading text-2xl font-bold">
              {formatRupiah(product.price)}
              {product.originalPrice ? (
                <span className="font-body text-[15px] font-normal text-ink-muted line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              ) : null}
            </p>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 hidden items-center gap-3 md:flex">
              <div className="flex items-center rounded-full border border-line bg-white">
                <button
                  type="button"
                  aria-label="Kurangi jumlah"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100"
                >
                  <Minus size={17} aria-hidden="true" />
                </button>
                <span aria-live="polite" className="w-8 text-center font-bold text-plum-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tambah jumlah"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100"
                >
                  <Plus size={17} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={soldOut}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {soldOut ? "Stok Habis" : "Tambah ke Keranjang"}
              </button>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-3 hidden w-full md:inline-flex"
            >
              <MessageCircle size={17} aria-hidden="true" />
              Pesan via WhatsApp
            </a>
          </div>
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="terkait-heading" className="pt-16">
            <h2 id="terkait-heading" className="text-2xl">Mungkin kamu suka</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-container items-center gap-2">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              aria-label="Kurangi jumlah"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900"
            >
              <Minus size={17} aria-hidden="true" />
            </button>
            <span aria-live="polite" className="w-7 text-center font-bold text-plum-900">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Tambah jumlah"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900"
            >
              <Plus size={17} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {soldOut ? "Stok Habis" : `Tambah . ${formatRupiah(product.price * quantity)}`}
          </button>
        </div>
      </div>

      <Footer />
      <ToastHost />
    </>
  );
}
