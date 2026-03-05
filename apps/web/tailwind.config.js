/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg-main)",
        bgsec: "var(--bg-sec)",
        card: "var(--card-bg)",
        pri: "var(--primary-text)",
        sec: "var(--secondary-text)",
        muted: "var(--text-muted)",
        border: "var(--borders)",
        accent: "var(--accent)"
      }
    },
  },
  plugins: [],
}