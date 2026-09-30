import { Link, useNavigate } from "react-router-dom";
import { LogOut, RotateCcw } from "lucide-react";
import { ToastHost } from "../../components/ui/Toast.jsx";
import { authService } from "../../services/authService.js";
import { STORAGE_KEY } from "../../services/adapters/localStorageAdapter.js";
import logo from "../../assets/logo.svg";

function storageMegabytes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    return raw.length / (1024 * 1024);
  } catch {
    return 0;
  }
}

// Kerangka admin (M4-03): sidebar plum, banner demo, slot konten.
export function AdminLayout({ title, onResetRequest, children }) {
  const navigate = useNavigate();
  const usageMb = storageMegabytes();

  async function handleLogout() {
    await authService.logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-50 md:flex">
      <aside className="bg-plum-900 text-cream-50 md:flex md:w-60 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between px-4 py-3 md:block md:px-6 md:py-6">
          <Link to="/" aria-label="Flowrys, ke toko">
            <img src={logo} alt="" aria-hidden="true" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold hover:bg-white/10 md:mt-8"
          >
            <LogOut size={16} aria-hidden="true" />
            Keluar
          </button>
        </div>
        <nav aria-label="Navigasi admin" className="hidden px-6 md:block">
          <p className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
            Produk
          </p>
          <Link
            to="/"
            className="mt-1 block rounded-2xl px-4 py-3 text-sm text-cream-50/80 hover:bg-white/10"
          >
            Lihat toko
          </Link>
        </nav>
      </aside>

      <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-card bg-peach-200 p-4 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold text-plum-900">
            {onResetRequest
              ? "Demo mode: data disimpan di browser kamu."
              : "Mode API: data tersimpan di server."}
          </p>
          {onResetRequest ? (
            <button
              type="button"
              onClick={onResetRequest}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-plum-900 px-4 text-sm font-semibold text-plum-900 hover:bg-white/50"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset data demo
            </button>
          ) : null}
        </div>

        {usageMb > 3.5 ? (
          <p role="alert" className="mb-5 rounded-card bg-peach-200 p-4 text-sm font-semibold text-plum-900">
            Penyimpanan hampir penuh ({usageMb.toFixed(1)} MB). Pakai URL
            gambar, bukan unggahan, agar tidak error.
          </p>
        ) : null}

        <h1 className="text-2xl md:text-3xl">{title}</h1>
        <div className="mt-5">{children}</div>
      </div>
      <ToastHost />
    </div>
  );
}
