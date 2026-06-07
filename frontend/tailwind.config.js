/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#3f51b5', light: '#7986cb', dark: '#283593' },
        secondary: { DEFAULT: '#667eea', light: '#9fa8da' },
        accent:    { DEFAULT: '#764ba2' },
        success:   { DEFAULT: '#28a745', light: '#d4edda' },
        warning:   { DEFAULT: '#ff9800', light: '#fff3e0' },
        danger:    { DEFAULT: '#dc3545', light: '#f8d7da' },
        amvat:     { DEFAULT: '#7b1fa2', light: '#e1bee7' },
      },
      fontFamily: { sans: ['Roboto', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.10)',
        modal: '0 20px 60px rgba(0,0,0,0.30)',
      }
    }
  },
  plugins: []
}
