import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Seo } from "../components/Seo.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { BannerCta } from "../components/layout/BannerCta.jsx";
import { ProductCard } from "../features/products/ProductCard.jsx";
import { ProductCardSkeleton } from "../features/products/ProductCardSkeleton.jsx";
import { CategoryCard } from "../features/products/CategoryCard.jsx";
import { ToastHost } from "../components/ui/Toast.jsx";
import {
  useCatalog,
  useCategories,
} from "../features/products/hooks/useCatalog.js";
import { buildCustomOrderMessage, buildSingleProductMessage } from "../utils/buildWhatsAppMessage.js";
import { buildWhatsAppLink } from "../config/store.js";
import { formatRupiah } from "../utils/formatRupiah.js";
import { formatSoldCount } from "../utils/formatSold.js";
import { Badge } from "../components/ui/Badge.jsx";
import heroPhoto from "../assets/hero-1.png";
import buketImg from "../assets/buket-bunga.png";
import papanImg from "../assets/bunga-papan.png";
import mejaImg from "../assets/bunga-meja.png";
import hampersImg from "../assets/hampers.png";

const illustrations = {
  buket: buketImg,
  "bunga-papan": papanImg,
  "bunga-meja": mejaImg,
  hampers: hampersImg,
};

const categoryDescriptions = {
  buket: "Buket tangan untuk wisuda, ulang tahun, dan pernyataan cinta.",
  "bunga-papan": "Papan ucapan untuk pembukaan toko, pernikahan, dan duka cita.",
  "bunga-meja": "Vas dan pot kecil untuk meja kerja dan ruang tamu.",
  hampers: "Kotak hadiah berisi bunga dan camilan untuk orang tersayang.",
};

const steps = [
  { title: "Pilih bunga", text: "Jelajahi koleksi dan masukkan favoritmu ke keranjang." },
  { title: "Isi detail", text: "Tentukan tanggal ambil atau tiba, alamat, dan kartu ucapan." },
  { title: "Kirim via WhatsApp", text: "Pesananmu terkirim sebagai pesan rapi ke admin kami." },
  { title: "Kami siapkan", text: "Admin mengonfirmasi ongkir dan jadwal, bunga dirangkai segar." },
];

const stepPastel = ["bg-rose-200", "bg-sage-200", "bg-peach-200", "bg-lavender-200"];

const tabs = [
  { id: "all", label: "Semua" },
  { id: "c1", label: "Buket" },
  { id: "c3", label: "Bunga Meja" },
];

function HandUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      className="absolute -bottom-1 left-0 h-3 w-full"
    >
      <path
        d="M4 9 C 40 3, 70 11, 110 7 S 180 4, 216 8"
        fill="none"
        stroke="#F6C9D3"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 pb-10 pt-12 text-center md:pb-14 md:pt-16">
        <p className="inline-flex items-center rounded-full border border-line bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">
          Pesan hari ini, tiba mulai besok
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl text-[40px] leading-[1.05] md:text-[64px]">
          Bunga segar untuk momen yang{" "}
          <span className="relative inline-block">
            lebih bermakna
            <HandUnderline />
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed md:text-[18px]">
          Pesan buket, bunga meja, dan hampers hari ini. Atur tanggal kirim
          dan kartu ucapan, lalu selesaikan pesanan lewat WhatsApp.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/koleksi" className="btn-primary w-full sm:w-auto">
            Pesan Bunga Sekarang
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/koleksi" className="btn-ghost">
            Lihat Koleksi
          </Link>
        </div>
        <img
          src={heroPhoto}
          alt="Rangkaian bunga segar Flowrys"
          className="mx-auto mt-10 w-full max-w-3xl rounded-card object-cover"
        />
      </div>
    </section>
  );
}

function CategorySection() {
  const { data: categories } = useCategories();
  const { data: catalog, isError, refetch } = useCatalog();
  const products = catalog?.data ?? [];

  return (
    <section aria-labelledby="kategori-heading" className="mx-auto max-w-container px-4 pt-16 md:pt-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-ink-muted" />
            Koleksi kami
          </p>
          <h2 id="kategori-heading" className="mt-2 text-[30px] md:text-[40px]">
            Pilih sesuai momenmu
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-[15px]">
            Empat koleksi utama, semuanya bisa dipesan untuk diambil di toko
            atau diantar ke lokasimu.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={buildWhatsAppLink(buildCustomOrderMessage()) ?? "#kontak"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-plum-900 underline decoration-rose-200 decoration-2 underline-offset-4"
            >
              Mau custom? Konsultasi gratis
            </a>
            <Link
              to="/koleksi"
              className="font-semibold text-plum-900 underline decoration-rose-200 decoration-2 underline-offset-4"
            >
              Lihat semua koleksi
            </Link>
          </p>
        </div>
      </div>
      {isError ? (
        <div className="mt-8 py-8 text-center">
          <p className="text-[15px]">Kategori gagal dimuat.</p>
          <button type="button" className="btn-outline mt-3" onClick={() => refetch()}>
            Coba lagi
          </button>
        </div>
      ) : (
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {(categories ?? []).map((category, i) => {
          const inCategory = products.filter((p) => p.categoryId === category.id);
          const cheapest =
            inCategory.length > 0
              ? Math.min(...inCategory.map((p) => p.price))
              : 0;
          // Harga manual diutamakan; kosong berarti otomatis termurah.
          const minPrice = category.startingPrice ?? cheapest;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              count={inCategory.length}
              minPrice={minPrice}
              illustration={illustrations[category.slug]}
              description={category.description || categoryDescriptions[category.slug]}
              offset={i % 2 === 1}
            />
          );
        })}
      </div>
      )}
    </section>
  );
}

function Bestsellers() {
  const [tab, setTab] = useState("all");
  const { data: catalog, isPending, isError, refetch } = useCatalog();
  const products = (catalog?.data ?? []).filter((p) => p.isAvailable);
  const filtered =
    tab === "all" ? products.filter((p) => p.isFeatured) : products.filter((p) => p.categoryId === tab);
  const [big, ...rest] = filtered;
  const customLink = buildWhatsAppLink(buildCustomOrderMessage());

  return (
    <section aria-labelledby="terlaris-heading" className="mx-auto max-w-container px-4 pt-16 md:pt-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-ink-muted" />
            Produk terlaris
          </p>
          <h2 id="terlaris-heading" className="mt-2 text-[30px] md:text-[40px]">
            Favorit pembeli minggu ini
          </h2>
        </div>
        <div role="tablist" aria-label="Filter produk terlaris" className="flex gap-1 rounded-full border border-line bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition ${
                tab === t.id ? "bg-plum-900 text-white" : "text-plum-900 hover:bg-cream-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {isPending ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center">
            <p className="text-[15px]">Produk terlaris gagal dimuat.</p>
            <button type="button" className="btn-outline mt-3" onClick={() => refetch()}>
              Coba lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {big ? (
              <article className="relative col-span-2 row-span-2 overflow-hidden rounded-card">
                <img
                  src={big.images[0]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full min-h-[420px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-900/95 via-plum-900/40 to-transparent" />
                <div className="absolute left-4 top-4">
                  <Badge>Terlaris #1</Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="flex items-center gap-1 text-[12px] font-semibold text-white/80">
                    {big.rating.toFixed(1)} rating . {formatSoldCount(big.soldCount)} terjual
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-white">
                    {big.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 max-w-md text-sm text-white/80">
                    {big.description}
                  </p>
                  <p className="mt-2 flex items-baseline gap-2 font-heading text-lg font-bold text-white">
                    {formatRupiah(big.price)}
                    {big.originalPrice ? (
                      <span className="font-body text-sm font-normal text-white/60 line-through">
                        {formatRupiah(big.originalPrice)}
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={buildWhatsAppLink(buildSingleProductMessage(big, 1)) ?? "#kontak"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-plum-900 transition hover:bg-cream-100"
                  >
                    <MessageCircle size={17} aria-hidden="true" />
                    Pesan Sekarang
                  </a>
                </div>
              </article>
            ) : null}
            {rest.slice(0, 2).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            <aside className="col-span-2 flex flex-col justify-between rounded-card bg-plum-900 p-6 lg:col-span-1 lg:row-span-1">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream-50/60">
                  Custom order
                </p>
                <h3 className="mt-2 font-heading text-xl font-bold text-white">
                  Punya referensi sendiri?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-50/80">
                  Kirim contoh gambar ke WhatsApp, kami buatkan yang mirip
                  sesuai budget.
                </p>
              </div>
              <a
                href={customLink ?? "#kontak"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-plum-900 transition hover:bg-cream-100"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Konsultasi gratis
              </a>
            </aside>
          </div>
        )}
      </div>
      <div className="mt-8 text-center">
        <Link to="/koleksi" className="btn-outline">
          Lihat semua koleksi
        </Link>
      </div>
    </section>
  );
}

function HowToOrder() {
  return (
    <section aria-labelledby="cara-pesan-heading" id="cara-pesan" className="mx-auto max-w-container scroll-mt-24 px-4 pt-16 md:pt-24">
      <p className="eyebrow flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-px w-6 bg-ink-muted" />
        Cara pesan
      </p>
      <h2 id="cara-pesan-heading" className="mt-2 text-[30px] md:text-[40px]">
        Dari pilih sampai terima, empat langkah
      </h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-card bg-white p-6">
            <p aria-hidden="true" className={`inline-flex h-11 w-11 items-center justify-center rounded-full font-heading text-lg font-bold text-plum-900 ${stepPastel[i]}`}>
              {i + 1}
            </p>
            <h3 className="mt-3 font-heading text-[18px] font-bold">{step.title}</h3>
            <p className="mt-1 text-[14px] leading-relaxed">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title="Toko Bunga Butik"
        description="Flowrys menjual buket, bunga meja, dan hampers segar. Pesan cepat lewat WhatsApp."
      />
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <Bestsellers />
        <HowToOrder />
        <div className="pt-16 md:pt-24">
          <BannerCta
            title="Tidak menemukan yang pas?"
            text="Ceritakan kebutuhanmu, kami bantu pilihkan atau buatkan custom sesuai budget."
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
