const variants = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    />
  );
}
