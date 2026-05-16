/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aegis: {
          primary: '#4f46e5',
          danger: '#dc2626',
          warning: '#f59e0b',
          ink: '#111827'
        }
      }
    }
  },
  plugins: []
};
