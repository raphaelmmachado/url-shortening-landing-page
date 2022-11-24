/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
      },
      pri: {
        cyan: "hsl(180, 66%, 49%)",
        dk_viol: "hsl(257, 27%, 26%)",
      },
      sec: {
        red: "hsl(0, 87%, 67%)",
      },
      neutral: {
        gray: "hsl(0, 0%, 75%)",
        gray_vio: "hsl(257, 7%, 63%)",
        v_dk_blue: "hsl(255, 11%, 22%)",
        v_dk_viol: "hsl(260, 8%, 14%)",
      },
    },
  },
  plugins: [],
};
