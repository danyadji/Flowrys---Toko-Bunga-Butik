import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Truck } from "lucide-react";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { checkoutSchema, limits } from "./checkoutSchema.js";
import { storeConfig } from "../../config/store.js";

const methods = [
  {
    id: "pickup",
    title: "Ambil di toko",
    text: `${storeConfig.address}. ${storeConfig.hours}.`,
    Icon: Store,
  },
  {
    id: "delivery",
    title: "Diantar",
    text: "Ke rumah, kantor, atau lokasi acaramu.",
    Icon: Truck,
  },
];

export function CheckoutForm({ onSubmit, onMethodChange }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { method: "pickup", destination: "Rumah", greeting: "", note: "" },
  });

  const method = watch("method");
  const greetingLength = (watch("greeting") ?? "").length;

  useEffect(() => {
    onMethodChange?.(method);
  }, [method, onMethodChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-[13px] font-semibold text-plum-900">
          Metode penerimaan
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map(({ id, title, text, Icon }) => (
            <label
              key={id}
              className={`cursor-pointer rounded-card border-2 p-4 transition ${
                method === id
                  ? "border-plum-900 bg-rose-200/30"
                  : "border-line bg-white hover:border-plum-500"
              }`}
            >
              <span className="flex items-center gap-2 font-heading text-[16px] font-bold text-plum-900">
                <Icon size={19} aria-hidden="true" />
                {title}
              </span>
              <span className="mt-1 block text-[13px] text-ink-muted">{text}</span>
              <input
                type="radio"
                value={id}
                {...register("method")}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="buyerName"
          label="Nama pemesan"
          autoComplete="name"
          maxLength={limits.name}
          error={errors.buyerName?.message}
          {...register("buyerName")}
        />
        <Input
          id="buyerPhone"
          label="Nomor HP pemesan"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08..."
          error={errors.buyerPhone?.message}
          {...register("buyerPhone")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="date"
          type="date"
          label={method === "pickup" ? "Tanggal ambil" : "Tanggal kirim"}
          error={errors.date?.message}
          {...register("date")}
        />
        <Input
          id="time"
          type="time"
          label={method === "pickup" ? "Jam ambil" : "Jam tiba yang diinginkan"}
          error={errors.time?.message}
          {...register("time")}
        />
      </div>
      <p className="-mt-3 text-[13px] text-ink-muted">
        Pemesanan minimal H+{storeConfig.leadTimeDays}, jam layanan {storeConfig.openHour}.00-{storeConfig.closeHour}.00.
      </p>

      {method === "delivery" ? (
        <div className="space-y-4">
          <Select id="destination" label="Jenis tujuan" error={errors.destination?.message} {...register("destination")}>
            <option value="Rumah">Rumah</option>
            <option value="Kantor">Kantor</option>
            <option value="Acara/Venue">Acara/Venue</option>
          </Select>
          <Input
            id="event"
            label="Nama acara atau lokasi (opsional)"
            placeholder="Contoh: Pernikahan Rina dan Dimas"
            maxLength={limits.event}
            error={errors.event?.message}
            {...register("event")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="recipient"
              label="Nama penerima"
              maxLength={limits.name}
              error={errors.recipient?.message}
              {...register("recipient")}
            />
            <Input
              id="recipientPhone"
              label="Nomor HP penerima (opsional)"
              inputMode="tel"
              placeholder="08..."
              error={errors.recipientPhone?.message}
              {...register("recipientPhone")}
            />
          </div>
          <div>
            <label htmlFor="address" className="mb-1.5 block text-[13px] font-semibold text-plum-900">
              Alamat pengiriman
            </label>
            <textarea
              id="address"
              rows={3}
              maxLength={limits.address}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
              className="input-field !h-auto !rounded-xl py-3"
              {...register("address")}
            />
            {errors.address ? (
              <p id="address-error" role="alert" className="mt-1 text-[13px] text-danger">
                {errors.address.message}
              </p>
            ) : null}
          </div>
          <Input
            id="landmark"
            label="Patokan atau catatan lokasi (opsional)"
            placeholder="Contoh: Lobi utama, hubungi panitia"
            maxLength={limits.landmark}
            error={errors.landmark?.message}
            {...register("landmark")}
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="greeting" className="mb-1.5 block text-[13px] font-semibold text-plum-900">
          Kartu ucapan (opsional)
        </label>
        <textarea
          id="greeting"
          rows={2}
          maxLength={limits.greeting}
          aria-describedby="greeting-count"
          className="input-field !h-auto !rounded-xl py-3"
          {...register("greeting")}
        />
        <p id="greeting-count" className="mt-1 text-[12px] text-ink-muted" aria-live="polite">
          {greetingLength}/{limits.greeting} karakter
        </p>
        {errors.greeting ? (
          <p role="alert" className="mt-1 text-[13px] text-danger">
            {errors.greeting.message}
          </p>
        ) : null}
      </div>

      <Input
        id="note"
        label="Catatan tambahan (opsional)"
        maxLength={limits.note}
        error={errors.note?.message}
        {...register("note")}
      />

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        Pesan via WhatsApp
      </button>
    </form>
  );
}
