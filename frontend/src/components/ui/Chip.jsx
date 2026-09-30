export function Chip({ active = false, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`chip ${active ? "chip-active" : ""} ${className}`}
      {...props}
    />
  );
}
