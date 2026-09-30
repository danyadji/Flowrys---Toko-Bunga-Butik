import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { ImageInput } from "./ImageInput.jsx";
import { adminProductSchema, toServiceInput } from "./adminProductSchema.js";
import { slugify } from "../../utils/slugify.js";

function toFormValues(product) {
  if (!product) {
    return {
      name: "",
      slug: "",
      categoryId: "",
      price: "",
      originalPrice: "",
      description: "",
      badge: "none",
      isFeatured: false,
      isAvailable: true,
      images: [],
    };
  }
  return {
    name: product.name,
    slug: product.slug,
    categoryId: String(product.categoryId),
    price: product.price,
    originalPrice: product.originalPrice ?? "",
    description: product.description ?? "",
    badge: product.badge ?? "none",
    isFeatured: Boolean(product.isFeatured),
    isAvailable: Boolean(product.isAvailable),
    images: product.images ?? [],
  };
}

// Satu form untuk tambah dan edit. File baru ditampung sebagai pratinjau
// lalu diunggah setelah simpan (tambah) atau langsung (ubah).
export function ProductForm({
  product,
  categories,
  existingSlugs,
  onSubmit,
  serverImages = [],
  onUploadFile,
  onDeleteServerImage,
}) {
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [pendingFiles, setPendingFiles] = useState({});
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      adminProductSchema(existingSlugs, product?.id ?? null),
    ),
    defaultValues: toFormValues(product),
  });

  const images = watch("images");

  function addPendingFile(file) {
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => ({ ...prev, [preview]: file }));
    setValue("images", [...watch("images"), preview], { shouldValidate: true });
    clearErrors("images");
  }

  async function handleUploadFile(file) {
    const url = await onUploadFile(file);
    return url;
  }

  function handleImagesChange(next) {
    const removed = watch("images").filter((src) => !next.includes(src));
    removed.forEach((src) => {
      if (src.startsWith("blob:")) {
        setPendingFiles((prev) => {
          const nextMap = { ...prev };
          delete nextMap[src];
          return nextMap;
        });
        URL.revokeObjectURL(src);
      }
    });
    setValue("images", next, { shouldValidate: true });
  }

  function handleDeleteServerImage(id, url) {
    onDeleteServerImage?.(id);
    setValue(
      "images",
      watch("images").filter((src) => src !== url),
      { shouldValidate: true },
    );
  }

  function submit(values) {
    const urls = [];
    const files = [];
    values.images.forEach((src) => {
      if (src.startsWith("blob:") && pendingFiles[src]) files.push(pendingFiles[src]);
      else urls.push(src);
    });
    onSubmit(toServiceInput({ ...values, images: urls }), { files });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <Input
        id="admin-name"
        label="Nama produk"
        maxLength={150}
        error={errors.name?.message}
        {...register("name", {
          onChange: (e) => {
            if (!slugTouched) setValue("slug", slugify(e.target.value));
          },
        })}
      />
      <Input
        id="admin-slug"
        label="Slug (otomatis dari nama, bisa diubah)"
        error={errors.slug?.message}
        {...register("slug", { onChange: () => setSlugTouched(true) })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="admin-category" label="Kategori" error={errors.categoryId?.message} {...register("categoryId")}>
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select id="admin-badge" label="Badge" {...register("badge")}>
          <option value="none">Tanpa badge</option>
          <option value="terlaris">Terlaris</option>
          <option value="baru">Baru</option>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="admin-price"
          label="Harga jual (Rp)"
          type="number"
          min={1}
          step={1}
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          id="admin-original"
          label="Harga coret, opsional (Rp)"
          type="number"
          min={1}
          step={1}
          error={errors.originalPrice?.message}
          {...register("originalPrice")}
        />
      </div>
      <div>
        <label htmlFor="admin-description" className="mb-1.5 block text-[13px] font-semibold text-plum-900">
          Deskripsi
        </label>
        <textarea
          id="admin-description"
          rows={4}
          maxLength={2000}
          aria-invalid={Boolean(errors.description)}
          className="input-field !h-auto !rounded-xl py-3"
          {...register("description")}
        />
        {errors.description ? (
          <p role="alert" className="mt-1 text-[13px] text-danger">
            {errors.description.message}
          </p>
        ) : null}
      </div>
      <ImageInput
        value={images}
        onChange={handleImagesChange}
        error={errors.images?.message}
        serverImages={serverImages}
        onDeleteServerImage={handleDeleteServerImage}
        onUploadFile={product ? handleUploadFile : undefined}
        onSelectPendingFiles={product ? undefined : addPendingFile}
        pendingCount={Object.keys(pendingFiles).length}
      />
      <div className="flex flex-wrap gap-4">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-plum-900">
          <input type="checkbox" {...register("isAvailable")} className="h-5 w-5 accent-plum-900" />
          Stok tersedia
        </label>
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-plum-900">
          <input type="checkbox" {...register("isFeatured")} className="h-5 w-5 accent-plum-900" />
          Tampilkan di unggulan
        </label>
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {product ? "Simpan perubahan" : "Tambah produk"}
      </button>
    </form>
  );
}
