export function Input({ label, error, id, className = "", ...props }) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-[13px] font-semibold text-plum-900"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`input-field ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={describedBy} role="alert" className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
