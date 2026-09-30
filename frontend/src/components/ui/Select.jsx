export function Select({ label, error, id, children, ...props }) {
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
      <select
        id={id}
        className="input-field appearance-none pr-10"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={describedBy} role="alert" className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
