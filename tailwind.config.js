/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'iebem': {
          'primary': '#70795b',     // Verde institucional
          'secondary': '#b29a7e',   // Naranja cálido
          'accent': '#8B5CF6',      // Púrpura moderno
          'dark': '#374151',        // Gris piedra
          'light': '#F0FDF4',       // Verde muy claro
          'gold': '#F59E0B',        // Dorado logo
        },
        'success': '#10B981',
        'warning': '#F59E0B', 
        'danger': '#EF4444',
        'info': '#3B82F6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}