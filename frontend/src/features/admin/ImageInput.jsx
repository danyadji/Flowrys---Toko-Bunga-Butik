import { useState } from "react";
import { ImagePlus, Link2, X } from "lucide-react";

// Input gambar admin: URL https atau unggah file ke server.
// Hanya JPEG/PNG/WebP (maks 2MB per file), SVG ditolak server.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageInput({
  value = [],
  onChange,
  error,
  serverImages = [],
  onDeleteServerImage,
  onUploadFile,
  onSelectPendingFiles,
  pendingCount = 0,
}) {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState("");
  const [busy, setBusy] = useState(false);

  function checkType(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError(`Format ${file.type || "tidak dikenal"} ditolak. Pakai JPEG, PNG, atau WebP.`);
      return false;
    }
    return true;
  }

  function addImage(src) {
    if (value.length + serverImages.length + pendingCount >= 6) {
      setLocalError("Maksimal 6 gambar.");
      return;
    }
    setLocalError("");
    onChange([...value, src]);
  }

  function addUrl() {
    const trimmed = url.trim();
    if (!trimmed.startsWith("https://")) {
      setLocalError("URL gambar wajib diawali https://");
      return;
    }
    addImage(trimmed);
    setUrl("");
  }

  async function addFiles(files) {
    for (const file of files) {
      if (!checkType(file)) continue;
      if (onSelectPendingFiles) {
        onSelectPendingFiles(file);
        continue;
      }
      setBusy(true);
      try {
        const src = await onUploadFile(file);
        // null berarti pratinjau sudah ditangani pemanggil (daftar server).
        if (src) addImage(src);
        else setLocalError("");
      } catch (err) {
        setLocalError(err.message ?? "Gagal mengunggah gambar.");
      } finally {
        setBusy(false);
      }
    }
  }

  const message = error ?? localError;
  // URL yang sudah ada di daftar server tidak dirender ulang dari value
  // agar satu foto tidak tampil dua kali.
  const serverUrls = new Set(serverImages.map((image) => image.url));
  const localOnly = value
    .map((src, index) => ({ src, index }))
    .filter(({ src }) => !serverUrls.has(src));
  const total = serverImages.length + localOnly.length + pendingCount;

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold text-plum-900">
        Gambar ({total}/6)
      </span>
      {serverImages.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {serverImages.map((image) => (
            <li key={`server-${image.id}`} className="relative">
              <img
                src={image.url}
                alt="Gambar produk di server"
                className="h-20 w-20 rounded-2xl border border-line object-cover"
              />
              <button
                type="button"
                aria-label="Hapus gambar dari server"
                onClick={() => onDeleteServerImage?.(image.id, image.url)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-plum-900 text-white"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {localOnly.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {localOnly.map(({ src, index }) => (
            <li key={`${index}-${src.slice(0, 24)}`} className="relative">
              <img
                src={src}
                alt={`Gambar produk ${index + 1}`}
                className="h-20 w-20 rounded-2xl border border-line object-cover"
              />
              <button
                type="button"
                aria-label={`Hapus gambar ${index + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== index))}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-plum-900 text-white"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <label htmlFor="image-url" className="sr-only">Tambah gambar dari URL https</label>
          <input
            id="image-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="input-field !pl-11"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-outline shrink-0 !px-4">
          Tambah
        </button>
      </div>

      <label className="btn-outline mt-2 inline-flex cursor-pointer">
        <ImagePlus size={17} aria-hidden="true" />
        {busy ? "Mengunggah..." : "Unggah foto"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
      <p className="mt-1.5 text-[12px] text-ink-muted">
        Foto tersimpan di server (maks 2MB per file).
      </p>
      {message ? (
        <p role="alert" className="mt-1 text-[13px] text-danger">{message}</p>
      ) : null}
    </div>
  );
}
