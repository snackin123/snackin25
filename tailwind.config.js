/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // If using Next.js 13+ app routing
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Ensure these variables are defined in your CSS
        foreground: "var(--foreground)", // Ensure these variables are defined in your CSS
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out', // Custom fade-in animation
        'scroll': 'scroll 20s linear infinite', // Marquee animation
        'marquee': 'marquee 60s linear infinite', // Slowed down marquee animation (60 seconds)
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scroll: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      spacing: {
        128: "32rem", // Custom spacing for layout
        144: "36rem", // Custom spacing for layout
      },
      fontFamily: {
        custom: ["var(--font-poppins)", "sans-serif"], // Custom font family
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
