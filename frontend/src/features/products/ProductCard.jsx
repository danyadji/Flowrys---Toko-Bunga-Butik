import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { discountPercent, formatRupiah } from "../../utils/formatRupiah.js";
import { formatSoldCount } from "../../utils/formatSold.js";
import { Badge } from "../../components/ui/Badge.jsx";

const PLACEHOLDER = "/images/product-placeholder.svg";

function badgeLabel(badge) {
  if (badge === "terlaris") return "Terlaris";
  if (badge === "baru") return "Baru";
  return null;
}

export function ProductCard({ product }) {
  const discount = discountPercent(product.price, product.originalPrice);
  const soldOut = !product.isAvailable;

  return (
    <Link
      to={`/produk/${product.slug}`}
      aria-label={soldOut ? `${product.name}, stok habis` : product.name}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-card">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
          }}
          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/55">
            <Badge tone="danger">Stok habis</Badge>
          </div>
        ) : (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.badge ? <Badge>{badgeLabel(product.badge)}</Badge> : null}
            {discount > 0 ? <Badge tone="dark">-{discount}%</Badge> : null}
          </div>
        )}
      </div>
      <div className="px-1 pt-3">
        <p className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
          <Star size={12} aria-hidden="true" className="fill-star text-star" />
          <span className="sr-only">Rating</span>
          {product.rating.toFixed(1)}
          <span aria-hidden="true">.</span>
          {formatSoldCount(product.soldCount)} terjual
        </p>
        <h3 className="mt-1 font-heading text-[16px] font-bold leading-snug text-plum-900">
          {product.name}
        </h3>
        <p className="mt-0.5 truncate text-[13px] text-ink-muted">
          {product.description}
        </p>
        <p className="mt-1.5 flex items-baseline gap-2 font-heading text-[16px] font-bold text-plum-900">
          {formatRupiah(product.price)}
          {product.originalPrice ? (
            <span className="font-body text-[13px] font-normal text-ink-muted line-through">
              {formatRupiah(product.originalPrice)}
            </span>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
