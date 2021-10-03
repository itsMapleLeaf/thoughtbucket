const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
      },
      fontFamily: {
        sans: `'Nunito', sans-serif`,
      },
      boxShadow: {
        DEFAULT:
          "0 1px 4px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.18)",
        inner: "inset 0 1px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      // @ts-expect-error
      minWidth: (theme) => theme("maxWidth"),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
