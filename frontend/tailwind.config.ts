import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // Enables dark mode via the 'dark' class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3f3cbb', // Light mode color
          dark: '#121063',  // Dark mode color
        },
        background: {
          light: '#ffffff', // Light mode background
          dark: '#000000',  // Dark mode background
        },
        text: {
          light: '#000000', // Light mode text
          dark: '#ffffff',  // Dark mode text
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
