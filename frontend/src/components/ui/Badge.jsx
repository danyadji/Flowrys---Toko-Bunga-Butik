const styles = {
  // Badge putih untuk Terlaris dan Baru.
  light: "bg-white text-plum-900",
  // Badge gelap untuk diskon.
  dark: "bg-plum-900 font-bold text-white",
  danger: "bg-danger text-white",
};

export function Badge({ tone = "light", className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${styles[tone]} ${className}`}
      {...props}
    />
  );
}
