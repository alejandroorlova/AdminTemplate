/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}"
  ],
  safelist: [
    'fas', 'far', 'fab',
    { pattern: /^fa-[a-z0-9-]+$/ },
  ],
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
      },
      
      // NUEVAS ADICIONES RECOMENDADAS:
      animation: {
        'checkIn': 'checkIn 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'indeterminateIn': 'indeterminateIn 0.2s ease-out',
        'ripple': 'ripple 0.4s ease-out',
        'gradientShift': 'gradientShift 3s ease infinite',
      },
      
      keyframes: {
        checkIn: {
          '0%': { transform: 'scale(0) rotate(45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.15) rotate(45deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(45deg)', opacity: '1' },
        },
        indeterminateIn: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      },
      
      boxShadow: {
        'checkbox': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'checkbox-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'checkbox-focus': '0 0 0 3px rgba(112, 121, 91, 0.1)', // Actualizado para primary verde
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
