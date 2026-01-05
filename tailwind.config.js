/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  safelist: [
    "dark:bg-gray-900",
    "dark:bg-gray-800",
    "dark:bg-gray-700",
    "dark:text-white",
    "dark:text-gray-300",
    "dark:text-gray-400",
    "dark:border-gray-700",
    "dark:border-gray-600",
    "dark:shadow-gray-900/30",
    "dark:shadow-gray-900/50",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
    },
  },
  plugins: [],
};
