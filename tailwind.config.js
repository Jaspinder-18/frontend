  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E39912', // Premium Gold
          dim: '#B67B0F',
          light: '#F5BE4C'
        },
        accent: {
          DEFAULT: '#D9480F', // Burnt Orange/Red
          hover: '#C03700'
        },
        dark: {
          DEFAULT: '#0F0F0F', // Rich Black
          lighter: '#1A1A1A',
          card: '#1F1F1F',
          muted: '#888888'
        },
        light: {
          DEFAULT: '#FDFDFD',
          muted: '#E5E5E5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        handwriting: ['Nothing You Could Do', 'cursive'] // Add if needed, or remove
      },
      animation: {
        'slow-spin': 'spin 10s linear infinite',
      }
    },
  },
  plugins: [],
}

