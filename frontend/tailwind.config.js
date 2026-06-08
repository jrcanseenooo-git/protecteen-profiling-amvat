/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        // ProtecTEEN brand — purple palette (matching sample dashboard)
        primary:  {
          DEFAULT: '#7c3aed',   // vivid violet
          light:   '#ede9fe',   // very light lavender
          dark:    '#5b21b6',   // deep purple
          mid:     '#a78bfa',   // medium violet
        },
        amvat:    {
          DEFAULT: '#6d28d9',   // purple-700
          light:   '#f5f3ff',
        },
        success:  { DEFAULT: '#059669', light: '#d1fae5' },
        warning:  { DEFAULT: '#d97706', light: '#fef3c7' },
        danger:   { DEFAULT: '#dc2626', light: '#fee2e2' },
      },
      fontFamily: { sans: ['Roboto', 'sans-serif'] },
      boxShadow: {
        card:  '0 2px 16px rgba(124,58,237,0.08)',
        modal: '0 20px 60px rgba(0,0,0,0.22)',
      }
    }
  },
  plugins: []
}
