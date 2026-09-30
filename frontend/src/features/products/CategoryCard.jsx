import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatRupiah } from "../../utils/formatRupiah.js";
import emptyState from "../../assets/empty-state.svg";

const pastelBySlug = {
  buket: "bg-rose-200",
  "bunga-papan": "bg-sage-200",
  "bunga-meja": "bg-peach-200",
  hampers: "bg-lavender-200",
};

export function CategoryCard({ category, index, count, minPrice, illustration, description, offset }) {
  // Gambar dari database diutamakan; ilustrasi bawaan lalu placeholder.
  const image = category.image || illustration || emptyState;
  return (
    <div className={offset ? "md:translate-y-8" : ""}>
      <Link
        to={`/koleksi?kategori=${category.slug}`}
        aria-label={`${category.name}, ${count} produk`}
        className="group block rounded-arch bg-white p-4 pb-6 text-center transition hover:shadow-card"
      >
        <div className={`rounded-arch px-4 pb-6 pt-8 ${pastelBySlug[category.slug] ?? "bg-cream-100"}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] text-ink-muted">
            0{index + 1}
          </p>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="mx-auto mt-2 h-32 w-32 rounded-full bg-white/60 object-cover p-2"
            onError={(e) => {
              if (e.currentTarget.src !== emptyState) e.currentTarget.src = emptyState;
            }}
          />
          {minPrice > 0 ? (
            <p className="mx-auto mt-3 inline-block -rotate-6 rounded-2xl bg-white px-3 py-1.5 text-left shadow-nav">
              <span className="block text-[10px] font-bold tracking-wider text-ink-muted">
                MULAI
              </span>
              <span className="font-heading text-[15px] font-bold text-plum-900">
                {formatRupiah(minPrice)}
              </span>
            </p>
          ) : null}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <h3 className="font-heading text-[18px] font-bold text-plum-900">
            {category.name}
          </h3>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-plum-900 transition group-hover:border-plum-900">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
        <p className="mx-auto mt-1 max-w-[220px] text-[13px] text-ink-muted">
          {description}
        </p>
      </Link>
    </div>
  );
}
