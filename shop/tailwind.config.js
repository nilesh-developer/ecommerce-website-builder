/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Set Poppins as the default sans font
      },
      fontSize: {
        // base: '0.875rem', // 14px
        // sm: '0.75rem',    // 12px
        // lg: '1rem',       // 16px
        // xl: '1.125rem',   // 18px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
        '4xl': '1.875rem',// 30px
        '5xl': '2.25rem', // 36px
      },
    },
  },
  plugins: [
    daisyui,
  ],
}

