// Token desain dari DESIGN.md bagian 11. Satu-satunya sumber warna,
// font, radius, dan bayangan. Komponen dilarang memakai hex langsung.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 500: "#7A5565", 700: "#6B3F52", 900: "#4A2030" },
        ink: { body: "#6B4A56", muted: "#9A8088" },
        cream: { 50: "#FAF6F3", 100: "#F5EEE9" },
        line: "#EBE0DB",
        rose: { 200: "#F6C9D3", 400: "#E8A0B4" },
        sage: { 200: "#DCEBD5", 400: "#A9CFA0" },
        peach: { 200: "#FCE5D0", 400: "#F4B98A" },
        lavender: { 200: "#E9E0F3" },
        star: "#F5B82E",
        success: "#4C9A6A",
        danger: "#C0455B",
        warning: "#D9952B",
      },
      fontFamily: {
        heading: ["Quicksand", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        arch: "9999px 9999px 20px 20px",
      },
      boxShadow: {
        nav: "0 4px 24px rgba(74, 32, 48, 0.06)",
        card: "0 12px 32px rgba(74, 32, 48, 0.10)",
      },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [],
};
