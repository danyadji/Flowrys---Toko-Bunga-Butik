import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Menu, Tags, X } from "lucide-react";
import { ToastHost } from "../../components/ui/Toast.jsx";
import { authService } from "../../services/authService.js";
import logo from "../../assets/logo.svg";

const menuItems = [
  { to: "/admin/produk", label: "Produk", Icon: LayoutGrid },
  { to: "/admin/kategori", label: "Kategori", Icon: Tags },
];

function MenuLinks({ onNavigate }) {
  return (
    <nav aria-label="Navigasi admin" className="space-y-1">
      {menuItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex min-h-[44px] items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition ${
              isActive ? "bg-white/15 text-white" : "text-cream-50/80 hover:bg-white/10"
            }`
          }
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
      <Link
        to="/"
        onClick={onNavigate}
        className="flex min-h-[44px] items-center gap-3 rounded-2xl px-4 text-sm text-cream-50/80 hover:bg-white/10"
      >
        Lihat toko
      </Link>
    </nav>
  );
}

// Kerangka admin: sidebar sticky di desktop, drawer di mobile.
export function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    await authService.logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-50 md:flex">
      {/* Bar atas mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-plum-900 px-4 py-2.5 text-cream-50 md:hidden">
        <Link to="/admin/produk" aria-label="Flowrys admin">
          <img src={logo} alt="" aria-hidden="true" className="h-7 w-auto brightness-0 invert" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-white/10"
          >
            <LogOut size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu admin"
            aria-expanded={drawerOpen}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-white/10"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-plum-900/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-plum-900 p-4 text-cream-50">
            <div className="mb-4 flex items-center justify-between">
              <img src={logo} alt="" aria-hidden="true" className="h-7 w-auto brightness-0 invert" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu admin"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-white/10"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <MenuLinks onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Sidebar desktop: sticky, tidak ikut scroll */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-plum-900 px-4 py-6 text-cream-50 md:flex">
        <Link to="/admin/produk" aria-label="Flowrys, ke dasbor">
          <img src={logo} alt="" aria-hidden="true" className="h-8 w-auto brightness-0 invert" />
        </Link>
        <div className="mt-6 flex-1">
          <MenuLinks />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold hover:bg-white/10"
        >
          <LogOut size={16} aria-hidden="true" />
          Keluar
        </button>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        <div className="mt-5">{children}</div>
      </div>
      <ToastHost />
    </div>
  );
}
