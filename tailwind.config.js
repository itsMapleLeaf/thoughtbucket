// @ts-nocheck
/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: `'Nunito', sans-serif`,
    },
    boxShadow: {
      DEFAULT:
        "0 1px 4px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.18)",
      inner: "inset 0 1px 4px 0 rgba(0, 0, 0, 0.25)",
    },
    extend: {
      minWidth: (theme) => theme("maxWidth"),
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
