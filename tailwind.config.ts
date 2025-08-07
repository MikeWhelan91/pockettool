import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ← add this container block
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '100%',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B22222",
          dark: "#8E1B1B",
        },
      },
    },
  },
  plugins: [],
}
export default config
