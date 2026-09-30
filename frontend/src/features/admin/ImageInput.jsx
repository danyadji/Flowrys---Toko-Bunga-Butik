import { useState } from "react";
import { ImagePlus, Link2, X } from "lucide-react";

// Input gambar admin (M4-07, M6-13): URL https atau unggah file.
// Mode demo: file dikompres di klien menjadi data URL.
// Mode API: file diunggah ke server lewat onUploadFile (edit langsung,
// tambah setelah produk dibuat). Hanya JPEG/PNG/WebP, SVG ditolak.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 1200;
const MAX_DATA_URL = 1_200_000;

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        URL.revokeObjectURL(url);
        if (dataUrl.length > MAX_DATA_URL) {
          reject(new Error("Hasil kompresi masih di atas 1MB. Pakai foto yang lebih kecil atau input URL."));
        } else {
          resolve(dataUrl);
        }
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("File gambar tidak bisa dibaca."));
    };
    img.src = url;
  });
}

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
    if (value.length >= 6) {
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
      // Mode API tambah: file ditampung, diunggah setelah produk dibuat.
      if (onSelectPendingFiles) {
        onSelectPendingFiles(file);
        continue;
      }
      setBusy(true);
      try {
        const src = onUploadFile ? await onUploadFile(file) : await compressImage(file);
        addImage(src);
      } catch (err) {
        setLocalError(err.message ?? "Gagal memproses gambar.");
      } finally {
        setBusy(false);
      }
    }
  }

  const message = error ?? localError;
  const total = value.length + serverImages.length + pendingCount;

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
      {value.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {value.map((src, i) => (
            <li key={`${i}-${src.slice(0, 24)}`} className="relative">
              <img
                src={src}
                alt={`Gambar produk ${i + 1}`}
                className="h-20 w-20 rounded-2xl border border-line object-cover"
              />
              <button
                type="button"
                aria-label={`Hapus gambar ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
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
        {busy ? "Memproses..." : "Unggah foto"}
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
        {onUploadFile || onSelectPendingFiles
          ? "Foto tersimpan di server (maks 2MB per file)."
          : "Unggahan dikompres otomatis (maks 1200px, JPEG). Utamakan URL agar penyimpanan browser tidak cepat penuh."}
      </p>
      {message ? (
        <p role="alert" className="mt-1 text-[13px] text-danger">{message}</p>
      ) : null}
    </div>
  );
}
