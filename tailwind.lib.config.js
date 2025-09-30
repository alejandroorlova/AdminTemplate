/** Tailwind config for building the library CSS only (no runtime in consumers) */
module.exports = {
  content: [
    './projects/iebem-ui/src/lib/**/*.{html,ts}'
  ],
  theme: { extend: {} },
  corePlugins: { preflight: false },
  plugins: []
};

