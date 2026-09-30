import { useEffect, useRef } from "react";

export function Modal({ title, onClose, children, wide = false }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(74, 32, 48, 0.4)" }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`max-h-[90dvh] w-full overflow-y-auto rounded-card bg-white p-5 outline-none md:p-6 ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-line text-plum-900 hover:border-plum-900"
          >
            Tutup
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
