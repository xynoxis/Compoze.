/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['"EB Garamond"', 'serif'],
      },
      boxShadow: {
        'depth-1': 'inset 1px 1px 0px #ffffff, inset -1px -1px 0px rgba(25,28,27,0.03), 0 2px 4px rgba(25,28,27,0.04), 0 6px 14px rgba(25,28,27,0.03)',
        'depth-2': 'inset 1px 1px 0px rgba(255,255,255,0.4), inset -1px -1px 0px rgba(0,0,0,0.25), 0 3px 6px rgba(7,94,86,0.18), 0 10px 22px rgba(7,94,86,0.14)',
        'depth-3': 'inset 1.2px 1.2px 0px #ffffff, inset -1.2px -1.2px 0px rgba(25,28,27,0.04), 0 3px 8px rgba(25,28,27,0.04), 0 16px 36px rgba(25,28,27,0.05)',
        'depth-hero': 'inset 1.5px 1.5px 0px #ffffff, inset -2.5px -2.5px 0px rgba(25,28,27,0.08), 0 4px 10px rgba(25,28,27,0.07), 0 24px 52px rgba(25,28,27,0.09)',
        'depth-recessed': 'inset 2px 2px 4px rgba(25,28,27,0.06), inset -2px -2px 5px rgba(255,255,255,0.85)',
        
        // Backward compatibility mapping to physical depth system
        'neumorphic': 'inset 1px 1px 0px #ffffff, inset -1px -1px 0px rgba(25,28,27,0.03), 0 2px 4px rgba(25,28,27,0.04), 0 6px 14px rgba(25,28,27,0.03)',
        'neumorphic-inset': 'inset 2px 2px 4px rgba(25,28,27,0.06), inset -2px -2px 5px rgba(255,255,255,0.85)',
        'neumorphic-raised': 'inset 1.2px 1.2px 0px #ffffff, inset -1.2px -1.2px 0px rgba(25,28,27,0.04), 0 3px 8px rgba(25,28,27,0.04), 0 16px 36px rgba(25,28,27,0.05)',
        'neumorphic-float': 'inset 1.5px 1.5px 0px #ffffff, inset -2.5px -2.5px 0px rgba(25,28,27,0.08), 0 4px 10px rgba(25,28,27,0.07), 0 24px 52px rgba(25,28,27,0.09)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
