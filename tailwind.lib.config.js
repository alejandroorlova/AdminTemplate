/** Tailwind config for building the library CSS only (no runtime in consumers) */
module.exports = {
  content: [
    './projects/iebem-ui/src/lib/**/*.{html,ts}'
  ],
  safelist: [
    // Button base + variants + sizes used by the library
    'btn-base',
    'btn-primary',
    'btn-secondary',
    'btn-accent',
    'btn-success',
    'btn-warning',
    'btn-danger',
    'btn-info',
    'btn-dark',
    'btn-light',
    'btn-outline',
    'btn-outline-secondary',
    'btn-outline-danger',
    'btn-ghost',
    'btn-link',
    'btn-gradient',
    'btn-shadow',
    'btn-icon',
    'btn-xs',
    'btn-sm',
    'btn-md',
    'btn-lg',
    'btn-xl',
    // Inputs
    'input-base',
    'input-default',
    'input-error',
    'input-success',
    'input-disabled',
    'search-input'
  ],
  theme: {
    extend: {
      colors: {
        'iebem': {
          'primary': '#70795b',
          'secondary': '#b29a7e',
          'accent': '#8B5CF6',
          'dark': '#374151',
          'light': '#F0FDF4',
          'gold': '#F59E0B',
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
    }
  },
  corePlugins: { preflight: false },
  plugins: []
};
