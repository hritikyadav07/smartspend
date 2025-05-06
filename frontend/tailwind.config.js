/** @type {import('tailwindcss').Config} */

import {heroui} from "@heroui/react";


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal & copper palette for a modern, luxurious, and dark look
        primary: {
          DEFAULT: '#b87333', // copper
          dark: '#7c4700',   // deep copper
        },
        accent: {
          DEFAULT: '#f4e2d8', // light copper/rose
          dark: '#c9a27b',   // muted copper
        },
        background: {
          DEFAULT: '#18181b', // charcoal dark
          dark: '#232323',   // slightly lighter charcoal
        },
        card: {
          DEFAULT: '#232323', // slightly lighter charcoal
          dark: '#18181b',   // charcoal dark
        },
        border: {
          DEFAULT: '#b87333', // copper
        },
        text: {
          DEFAULT: '#f4e2d8', // light copper/rose
          muted: '#b87333',   // copper
          heading: '#b87333', // copper
        },
        brand: {
          DEFAULT: '#b87333', // copper
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}