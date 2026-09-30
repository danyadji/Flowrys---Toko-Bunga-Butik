import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-container px-4 py-16 text-center">
      <h1 className="text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-ink-muted">
        Alamat yang kamu tuju tidak ada atau sudah dipindah.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Kembali ke beranda
      </Link>
    </main>
  );
}
