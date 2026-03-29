/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],  // Example; adjust as needed
        heading: ['Poppins', 'sans-serif'],  // Example; adjust as needed
      },
      colors: {
        brand: {
          50: '#f0f9ff',  // Example hex codes; replace with your palette
          100: '#e0f2fe',
          200: '#bae6fd',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}