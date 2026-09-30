import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "../../features/cart/cartStore.js";
import logo from "../../assets/logo.svg";

const menu = [
  { to: "/koleksi", label: "Koleksi" },
  { to: "/#cara-pesan", label: "Cara Pesan" },
  { to: "/#kontak", label: "Kontak" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const totalQty = useCartStore((s) => s.totalQty());

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-container px-4">
      <nav
        aria-label="Navigasi utama"
        className="flex items-center justify-between gap-2 rounded-full bg-white py-2 pl-4 pr-2 shadow-nav"
      >
        <Link to="/" aria-label="Flowrys, kembali ke beranda" className="shrink-0">
          <img src={logo} alt="" aria-hidden="true" className="h-8 w-auto" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {menu.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-semibold text-plum-900 hover:bg-cream-100"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <Link
            to="/keranjang"
            aria-label={`Keranjang, ${totalQty} item`}
            className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {totalQty > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-plum-900 px-1 text-[11px] font-bold text-white">
                {totalQty}
              </span>
            ) : null}
          </Link>
          <Link to="/koleksi" className="btn-primary hidden !py-2.5 md:inline-flex">
            Pesan Sekarang
          </Link>
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-plum-900 hover:bg-cream-100 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open ? (
        <ul className="mt-2 rounded-card bg-white p-2 shadow-card md:hidden">
          {menu.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-[15px] font-semibold text-plum-900 hover:bg-cream-100"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/koleksi"
              onClick={() => setOpen(false)}
              className="btn-primary mt-1 w-full"
            >
              Pesan Sekarang
            </Link>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
