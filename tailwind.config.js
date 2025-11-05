export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "100%",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px",
      },
    },
    extend: {
      fontSize: {
        section: ["1.5rem", "2rem"],
        menu: ["1.5rem", "2rem"],
        note: ["0.75rem", "1rem"],
      },
      fontFamily: {
        prompt: ['Alan Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
