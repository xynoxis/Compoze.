/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        serif: ['"EB Garamond"', 'Lora', 'Georgia', 'serif'],
      },
      colors: {
        'surface': '#F7F7F5',
        'surface-container': '#ebeee9',
        'surface-container-high': '#e6e9e4',
        'on-surface': '#191c1b',
        'on-surface-variant': '#3f4946',
        'primary': '#075e56',
        'on-primary': '#ffffff',
        'primary-container': '#9df2e2',
        'on-primary-container': '#00201c',
        'border-subtle': '#bec9c5',
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#0c8f82',
          600: '#0a786e',
          700: '#075e56',
          800: '#064c46',
          900: '#043833',
        }
      },
      boxShadow: {
        'neumorphic': '6px 6px 12px #d1d4ce, -6px -6px 12px #ffffff',
        'neumorphic-inset': 'inset 4px 4px 8px #d1d4ce, inset -4px -4px 8px #ffffff',
        'neumorphic-raised': '8px 8px 16px #d8dbd9, -8px -8px 16px #ffffff',
        'neumorphic-float': '12px 12px 24px #d8dbd9, -12px -12px 24px #ffffff',
      }
    },
  },
  plugins: [],
}

