export function Skeleton({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-card bg-line/60 ${className}`}
      {...props}
    />
  );
}
