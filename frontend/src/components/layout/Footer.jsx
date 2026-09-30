import { Link } from "react-router-dom";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { storeConfig } from "../../config/store.js";
import logo from "../../assets/logo.svg";

const collectionLinks = [
  { to: "/koleksi?kategori=buket", label: "Buket Bunga" },
  { to: "/koleksi?kategori=bunga-papan", label: "Bunga Papan" },
  { to: "/koleksi?kategori=bunga-meja", label: "Bunga Meja" },
  { to: "/koleksi?kategori=hampers", label: "Hampers" },
];

export function Footer() {
  return (
    <footer id="kontak" className="mt-24 bg-plum-900 text-cream-50">
      <div className="mx-auto grid max-w-container gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <img src={logo} alt="Flowrys" className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-cream-50/80">
            Toko bunga butik. Dirangkai segar setiap pagi.
          </p>
        </div>
        <nav aria-label="Tautan koleksi">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-cream-50/60">
            Koleksi
          </p>
          <ul className="mt-3 space-y-2">
            {collectionLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-[15px] hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-cream-50/60">
            Hubungi kami
          </p>
          <ul className="mt-3 space-y-3 text-[15px]">
            <li>
              <a
                href={`https://wa.me/${storeConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={17} aria-hidden="true" />
                WhatsApp toko
              </a>
            </li>
            <li className="flex items-start gap-2 text-cream-50/80">
              <MapPin size={17} aria-hidden="true" className="mt-0.5 shrink-0" />
              {storeConfig.address}
            </li>
            <li className="flex items-start gap-2 text-cream-50/80">
              <Clock size={17} aria-hidden="true" className="mt-0.5 shrink-0" />
              {storeConfig.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-container px-4 py-5 text-[13px] text-cream-50/60">
          2026 Flowrys. Demo portofolio, data tersimpan di browser kamu.
        </p>
      </div>
    </footer>
  );
}
